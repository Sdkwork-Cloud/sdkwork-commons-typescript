import { encodeUTF8 } from "../utils/bytes";
import { findDoubleNewlineIndex, LineDecoder } from "../utils/decoders/line";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Bytes = string | ArrayBuffer | Uint8Array | null | undefined;

export type ServerSentEvent = {
  event: string | null;
  data: string;
  raw: string[];
};
export interface TokenManager{
  getAuthToken(): string | null;
  getRefreshToken(): string | null;
  getAccessToken(): string | null;
}
export interface SdkClientOptions {
  baseUrl: string;
  apiKey?: string;
  accessToken?: string;
  tokenManager?: TokenManager;
  timeout?: number;
  headers?: Record<string, string>;

}

export interface SdkRequestOptions {
  url: string;
  method: HTTPMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  queryParams?: Record<string, string | number | boolean>;
}

export interface SdkResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export type RequestOptions = Partial<FinalRequestOptions>;

// Create a version of SdkRequestOptions with HTTPMethod instead of literal types
export interface FinalRequestOptions extends Omit<SdkRequestOptions, "method"> {
  method: HTTPMethod;
  path: string;
}

export type PromiseOrValue<T> = T | Promise<T>;

// We'll define the actual BaseSdkClient in the http module
// Just declare the type here for APIPromise
declare type BaseSdkClientType = any;

export class APIPromise<T> implements Promise<SdkResponse<T>> {
  private promise: Promise<SdkResponse<T>>;

  constructor(
    private client: BaseSdkClientType,
    promise: Promise<SdkResponse<T>>
  ) {
    this.promise = promise;
  }

  then<TResult1 = SdkResponse<T>, TResult2 = never>(
    onfulfilled?:
      | ((value: SdkResponse<T>) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<SdkResponse<T> | TResult> {
    return this.promise.catch(onrejected);
  }

  finally(
    onfinally?: (() => void) | undefined | null
  ): Promise<SdkResponse<T>> {
    return this.promise.finally(onfinally);
  }

  [Symbol.toStringTag]: string = "APIPromise";

  // Additional methods to make it compatible with the extended functionality
  asResponse(): Promise<SdkResponse<T>> {
    return this.promise;
  }
}

export function ReadableStreamToAsyncIterable<T>(stream: any): AsyncIterableIterator<T> {
  if (stream[Symbol.asyncIterator]) return stream;

  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done) reader.releaseLock(); // release lock when stream becomes closed
        return result;
      } catch (e) {
        reader.releaseLock(); // release lock when stream becomes errored
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: undefined };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
export async function* _iterSSEMessages(
  response: Response,
  controller: AbortController,
): AsyncGenerator<ServerSentEvent, void, unknown> {
  if (!response.body) {
    controller.abort();
    if (
      typeof (globalThis as any).navigator !== 'undefined' &&
      (globalThis as any).navigator.product === 'ReactNative'
    ) {
      throw new Error(
        `The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`,
      );
    }
    throw new Error(`Attempted to iterate over a response with no body`);
  }

  const sseDecoder = new SSEDecoder();
  const lineDecoder = new LineDecoder();

  const iter = ReadableStreamToAsyncIterable<Bytes>(response.body);
  for await (const sseChunk of iterSSEChunks(iter)) {
    for (const line of lineDecoder.decode(sseChunk)) {
      const sse = sseDecoder.decode(line);
      if (sse) yield sse;
    }
  }

  for (const line of lineDecoder.flush()) {
    const sse = sseDecoder.decode(line);
    if (sse) yield sse;
  }
}

/**
 * Given an async iterable iterator, iterates over it and yields full
 * SSE chunks, i.e. yields when a double new-line is encountered.
 */
async function* iterSSEChunks(iterator: AsyncIterableIterator<Bytes>): AsyncGenerator<Uint8Array> {
  let data = new Uint8Array();

  for await (const chunk of iterator) {
    if (chunk == null) {
      continue;
    }

    const binaryChunk =
      chunk instanceof ArrayBuffer ? new Uint8Array(chunk)
      : typeof chunk === 'string' ? encodeUTF8(chunk)
      : chunk;

    let newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data);
    newData.set(binaryChunk, data.length);
    data = newData;

    let patternIndex;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
      yield data.slice(0, patternIndex);
      data = data.slice(patternIndex);
    }
  }

  if (data.length > 0) {
    yield data;
  }
}
export class SdkStream<Item> implements AsyncIterable<Item> {
  controller: AbortController;
  _client: BaseSdkClientType | undefined;

  constructor(
    private iterator: () => AsyncIterator<Item>,
    controller: AbortController,
    client?: BaseSdkClientType
  ) {
    this.controller = controller;
    this._client = client;
  }
  [Symbol.asyncIterator](): AsyncIterator<Item, any, undefined> {
    throw new Error("Method not implemented.");
  }

  static fromSSEResponse<Item>(
    response: Response,
    controller: AbortController,
    client?: BaseSdkClientType
  ): SdkStream<Item> {
    let consumed = false;
    const logger =  console;

    async function* iterator(): AsyncIterator<Item, any, undefined> {
      if (consumed) {
        throw new Error(
          "Cannot iterate over a consumed stream, use `.tee()` to split the stream."
        );
      }
      consumed = true;
      let done = false;
      try {
        for await (const sse of _iterSSEMessages(response, controller)) {
          if (done) continue;

          if (sse.data.startsWith("[DONE]")) {
            done = true;
            continue;
          }

          if (
            sse.event === null ||
            sse.event.startsWith("response.") ||
            sse.event.startsWith("image_edit.") ||
            sse.event.startsWith("image_generation.") ||
            sse.event.startsWith("transcript.")
          ) {
            let data;

            try {
              data = JSON.parse(sse.data);
            } catch (e) {
              logger.error(`Could not parse message into JSON:`, sse.data);
              logger.error(`From chunk:`, sse.raw);
              throw e;
            }

            if (data && data.error) {
              throw new Error( 
                "sse event error"
              );
            }

            yield data;
          } else {
            let data;
            try {
              data = JSON.parse(sse.data);
            } catch (e) {
              console.error(`Could not parse message into JSON:`, sse.data);
              console.error(`From chunk:`, sse.raw);
              throw e;
            }
            // TODO: Is this where the error should be thrown?
            if (sse.event == "error") {
              throw new Error( 
                "sse event error"
              );
            }
            yield { event: sse.event, data: data } as any;
          }
        }
        done = true;
      } catch (e) {
        // If the user calls `stream.controller.abort()`, we should exit without throwing. 
        throw e;
      } finally {
        // If the user `break`s, abort the ongoing request.
        if (!done) controller.abort();
      }
    }

    return new SdkStream(iterator, controller, client);
  }

  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream<Item>(
    readableStream: ReadableStream,
    controller: AbortController,
    client?: BaseSdkClientType
  ): SdkStream<Item> {
    let consumed = false;

    async function* iterLines(): AsyncGenerator<string, void, unknown> {
      const lineDecoder = new LineDecoder();

      const iter = ReadableStreamToAsyncIterable<Bytes>(readableStream);
      for await (const chunk of iter) {
        for (const line of lineDecoder.decode(chunk)) {
          yield line;
        }
      }

      for (const line of lineDecoder.flush()) {
        yield line;
      }
    }

    async function* iterator(): AsyncIterator<Item, any, undefined> {
      if (consumed) {
        throw new Error(
          "Cannot iterate over a consumed stream, use `.tee()` to split the stream."
        );
      }
      consumed = true;
      let done = false;
      try {
        for await (const line of iterLines()) {
          if (done) continue;
          if (line) yield JSON.parse(line);
        }
        done = true;
      } catch (e) {
        // If the user calls `stream.controller.abort()`, we should exit without throwing.
        throw e;
      } finally {
        // If the user `break`s, abort the ongoing request.
        if (!done) controller.abort();
      }
    }

    return new SdkStream(iterator, controller, client);
  }
}

class SSEDecoder {
  private data: string[];
  private event: string | null;
  private chunks: string[];

  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }

  decode(line: string) {
    if (line.endsWith('\r')) {
      line = line.substring(0, line.length - 1);
    }

    if (!line) {
      // empty line and we didn't previously encounter any messages
      if (!this.event && !this.data.length) return null;

      const sse: ServerSentEvent = {
        event: this.event,
        data: this.data.join('\n'),
        raw: this.chunks,
      };

      this.event = null;
      this.data = [];
      this.chunks = [];

      return sse;
    }

    this.chunks.push(line);

    if (line.startsWith(':')) {
      return null;
    }

    let [fieldname, _, value] = partition(line, ':');

    if (value.startsWith(' ')) {
      value = value.substring(1);
    }

    if (fieldname === 'event') {
      this.event = value;
    } else if (fieldname === 'data') {
      this.data.push(value);
    }

    return null;
  }
}
function partition(str: string, delimiter: string): [string, string, string] {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
  }

  return [str, '', ''];
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ApiResult
 */
export interface ApiResult<T> {
  /**
   * data字段
   * Java类型: java.lang.Object
   */
  data: T;
  /**
   * code字段
   * Java类型: java.lang.String
   */
  code: string;
  /**
   * msg字段
   * Java类型: java.lang.String
   */
  msg: string;
  /**
   * requestId字段
   * Java类型: java.lang.String
   */
  requestId: string;
  /**
   * ip字段
   * Java类型: java.lang.String
   */
  ip: string;
  /**
   * hostname字段
   * Java类型: java.lang.String
   */
  hostname: string;
  /**
   * errorMsg字段
   * Java类型: java.lang.String
   */
  errorMsg: string;
  /**
   * errorName字段
   * Java类型: java.lang.String
   */
  errorName: string;
  /**
   * channelErrorCode字段
   * Java类型: java.lang.String
   */
  channelErrorCode: string;
  /**
   * channelErrorMsg字段
   * Java类型: java.lang.String
   */
  channelErrorMsg: string;
  /**
   * sign字段
   * Java类型: java.lang.String
   */
  sign: string;
  /**
   * signType字段
   * Java类型: java.lang.String
   */
  signType: string;
  /**
   * encryptType字段
   * Java类型: java.lang.String
   */
  encryptType: string;
  /**
   * encryptedText字段
   * Java类型: java.lang.String
   */
  encryptedText: string;
}
/**
 * 分页排序信息
 */
export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
  orders?: Order[];
}

export interface Order {
  direction: 'ASC' | 'DESC';
  property: string;
  ignoreCase: boolean;
  nullHandling: 'NATIVE' | 'NULLS_FIRST' | 'NULLS_LAST';
}

/**
 * 分页元数据（不包含实际数据）
 */
export interface PageMetadata {
  size: number;          // 每页元素数量
  totalElements: number;  // 总元素数量
  totalPages: number;     // 总页数
  number: number;         // 当前页码（0起始）
}

/**
 * 完整分页响应
 * @template T - 分页内容项类型
 */
export interface Page<T> {
  content: T[];           // 实际数据数组
  empty: boolean;          // 当前页是否为空
  first: boolean;          // 是否第一页
  last: boolean;           // 是否最后一页
  number: number;          // 当前页码（0起始）
  numberOfElements: number; // 当前页元素数量
  size: number;            // 每页元素数量
  sort: Sort;              // 排序信息
  totalElements: number;   // 总元素数量
  totalPages: number;      // 总页数
}