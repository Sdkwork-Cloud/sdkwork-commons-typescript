import { AxiosResponse } from "axios";
export * from "./stream";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface TokenManager {
  getAuthToken(): string | null;
  getRefreshToken(): string | null;
  getAccessToken(): string | null;
}
export interface ResponseHandler {
  handle<T>(response: AxiosResponse): SdkResponse<T>;
}
export interface ExceptionResponseHandler {
  onAccessDenied<T>(response: AxiosResponse): SdkResponse<T>;
  onUnauthorized<T>(response: AxiosResponse): SdkResponse<T>;
  onException<T>(response: AxiosResponse): SdkResponse<T>;
}
export interface SdkClientOptions {
  baseUrl: string;
  apiKey?: string;
  accessToken?: string;
  timeout?: number;
  headers?: Record<string, string>;

  tokenManager?: TokenManager;
  responseHandler?: ResponseHandler;
  exceptionHandler?: ExceptionResponseHandler;
}

export interface SdkRequestOptions {
  url?: string;
  method: HTTPMethod;
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string | number | boolean> | any;
  responseHandler?: ResponseHandler;
  exceptionHandler?: ExceptionResponseHandler;

  /**
   * The maximum number of times that the client will retry a request in case of a
   * temporary failure, like a network error or a 5XX error from the server.
   *
   * @default 2
   */
  maxRetries?: number;

  stream?: boolean | undefined;

  /**
   * The maximum amount of time (in milliseconds) that the client should wait for a response
   * from the server before timing out a single request.
   *
   * @unit milliseconds
   */
  timeout?: number;
  /**
   * An AbortSignal that can be used to cancel the request.
   */
  signal?: AbortSignal | undefined | null;
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
    promise: Promise<SdkResponse<T> | any>
  ) {
    this.promise = promise;
  }

  then<TResult1 = SdkResponse<T> | any, TResult2 = never>(
    onfulfilled?:
      | ((value: SdkResponse<T> | any) => TResult1 | PromiseLike<TResult1>)
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
  ): Promise<SdkResponse<T> | TResult | any> {
    return this.promise.catch(onrejected);
  }

  finally(
    onfinally?: (() => void) | undefined | null
  ): Promise<SdkResponse<T> | any> {
    return this.promise.finally(onfinally);
  }

  [Symbol.toStringTag]: string = "APIPromise";

  // Additional methods to make it compatible with the extended functionality
  asResponse(): Promise<SdkResponse<T> | any> {
    return this.promise;
  }
}
/**
 * 分页请求参数接口
 */
export interface Pageable {
  /**
   * 页码（从0开始）
   * @default 0
   */
  page?: number;

  /**
   * 每页记录数
   * @default 10
   */
  size?: number;

  /**
   * 排序参数
   * 格式：字段名,排序方向（asc/desc）
   * 示例：["createdAt,desc", "name,asc"]
   */
  sort?: string[];

  /**
   * 搜索关键字（可选）
   */
  keyword?: string;

  /**
   * 自定义过滤参数（键值对）
   */
  filters?: Record<string, any>;
}
/**
 * ApiResult - 表示API响应结果的类
 * @template T 数据类型
 */
export class ApiResult<T> {
  data: T;
  code: string;
  msg: string;
  errorMsg: string;
  errorName: string;
  requestId: string;
  ip?: string;
  hostname?: string;
  channelErrorCode?: string;
  channelErrorMsg?: string;
  sign?: string;
  signType?: string;
  encryptType?: string;
  encryptedText?: string;

  constructor(init: Partial<ApiResult<T>> = {}) {
    this.data = init.data ?? ({} as T);
    this.code = init.code ?? "";
    this.msg = init.msg ?? "";
    this.requestId = init.requestId ?? "";
    this.ip = init.ip ?? "";
    this.hostname = init.hostname ?? "";
    this.errorMsg = init.errorMsg ?? "";
    this.errorName = init.errorName ?? "";
    this.channelErrorCode = init.channelErrorCode ?? "";
    this.channelErrorMsg = init.channelErrorMsg ?? "";
    this.sign = init.sign ?? "";
    this.signType = init.signType ?? "";
    this.encryptType = init.encryptType ?? "";
    this.encryptedText = init.encryptedText ?? "";
  }

  /**
   * 判断API请求是否成功
   * @returns 当状态码为"200"时返回true，否则返回false
   */
  isSuccess(): boolean {
    return this.code === "200" || this.code === "2000";
  }

  /**
   * 获取错误信息摘要
   * @returns 错误信息摘要（包含errorName、errorMsg和channelErrorMsg）
   */
  getErrorSummary(): string {
    const parts: string[] = [];
    if (this.errorName) parts.push(`[${this.errorName}]`);
    if (this.errorMsg) parts.push(this.errorMsg);
    if (this.channelErrorMsg) parts.push(`(渠道错误: ${this.channelErrorMsg})`);

    return parts.length > 0 ? parts.join(" ") : "Unknown error";
  }
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
  direction: "ASC" | "DESC";
  property: string;
  ignoreCase: boolean;
  nullHandling: "NATIVE" | "NULLS_FIRST" | "NULLS_LAST";
}

/**
 * 分页元数据（不包含实际数据）
 */
export interface PageMetadata {
  size: number; // 每页元素数量
  totalElements: number; // 总元素数量
  totalPages: number; // 总页数
  number: number; // 当前页码（0起始）
}

/**
 * 完整分页响应
 * @template T - 分页内容项类型
 */
export interface Page<T> {
  content: T[]; // 实际数据数组
  empty: boolean; // 当前页是否为空
  first: boolean; // 是否第一页
  last: boolean; // 是否最后一页
  number: number; // 当前页码（0起始）
  numberOfElements: number; // 当前页元素数量
  size: number; // 每页元素数量
  sort: Sort; // 排序信息
  totalElements: number; // 总元素数量
  totalPages: number; // 总页数
}
