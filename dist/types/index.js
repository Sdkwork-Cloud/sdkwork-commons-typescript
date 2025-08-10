"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResult = exports.SdkStream = exports.APIPromise = void 0;
exports.ReadableStreamToAsyncIterable = ReadableStreamToAsyncIterable;
exports._iterSSEMessages = _iterSSEMessages;
const bytes_1 = require("../utils/bytes");
const line_1 = require("../utils/decoders/line");
class APIPromise {
    constructor(client, promise) {
        this.client = client;
        this[_a] = "APIPromise";
        this.promise = promise;
    }
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.promise.catch(onrejected);
    }
    finally(onfinally) {
        return this.promise.finally(onfinally);
    }
    // Additional methods to make it compatible with the extended functionality
    asResponse() {
        return this.promise;
    }
}
exports.APIPromise = APIPromise;
_a = Symbol.toStringTag;
function ReadableStreamToAsyncIterable(stream) {
    if (stream[Symbol.asyncIterator])
        return stream;
    const reader = stream.getReader();
    return {
        async next() {
            try {
                const result = await reader.read();
                if (result?.done)
                    reader.releaseLock(); // release lock when stream becomes closed
                return result;
            }
            catch (e) {
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
async function* _iterSSEMessages(response, controller) {
    if (!response.body) {
        controller.abort();
        if (typeof globalThis.navigator !== 'undefined' &&
            globalThis.navigator.product === 'ReactNative') {
            throw new Error(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
        }
        throw new Error(`Attempted to iterate over a response with no body`);
    }
    const sseDecoder = new SSEDecoder();
    const lineDecoder = new line_1.LineDecoder();
    const iter = ReadableStreamToAsyncIterable(response.body);
    for await (const sseChunk of iterSSEChunks(iter)) {
        for (const line of lineDecoder.decode(sseChunk)) {
            const sse = sseDecoder.decode(line);
            if (sse)
                yield sse;
        }
    }
    for (const line of lineDecoder.flush()) {
        const sse = sseDecoder.decode(line);
        if (sse)
            yield sse;
    }
}
/**
 * Given an async iterable iterator, iterates over it and yields full
 * SSE chunks, i.e. yields when a double new-line is encountered.
 */
async function* iterSSEChunks(iterator) {
    let data = new Uint8Array();
    for await (const chunk of iterator) {
        if (chunk == null) {
            continue;
        }
        const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk)
            : typeof chunk === 'string' ? (0, bytes_1.encodeUTF8)(chunk)
                : chunk;
        let newData = new Uint8Array(data.length + binaryChunk.length);
        newData.set(data);
        newData.set(binaryChunk, data.length);
        data = newData;
        let patternIndex;
        while ((patternIndex = (0, line_1.findDoubleNewlineIndex)(data)) !== -1) {
            yield data.slice(0, patternIndex);
            data = data.slice(patternIndex);
        }
    }
    if (data.length > 0) {
        yield data;
    }
}
class SdkStream {
    constructor(iterator, controller, client) {
        this.iterator = iterator;
        this.controller = controller;
        this._client = client;
    }
    [Symbol.asyncIterator]() {
        throw new Error("Method not implemented.");
    }
    static fromSSEResponse(response, controller, client) {
        let consumed = false;
        const logger = console;
        async function* iterator() {
            if (consumed) {
                throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
            }
            consumed = true;
            let done = false;
            try {
                for await (const sse of _iterSSEMessages(response, controller)) {
                    if (done)
                        continue;
                    if (sse.data.startsWith("[DONE]")) {
                        done = true;
                        continue;
                    }
                    if (sse.event === null ||
                        sse.event.startsWith("response.") ||
                        sse.event.startsWith("image_edit.") ||
                        sse.event.startsWith("image_generation.") ||
                        sse.event.startsWith("transcript.")) {
                        let data;
                        try {
                            data = JSON.parse(sse.data);
                        }
                        catch (e) {
                            logger.error(`Could not parse message into JSON:`, sse.data);
                            logger.error(`From chunk:`, sse.raw);
                            throw e;
                        }
                        if (data && data.error) {
                            throw new Error("sse event error");
                        }
                        yield data;
                    }
                    else {
                        let data;
                        try {
                            data = JSON.parse(sse.data);
                        }
                        catch (e) {
                            console.error(`Could not parse message into JSON:`, sse.data);
                            console.error(`From chunk:`, sse.raw);
                            throw e;
                        }
                        // TODO: Is this where the error should be thrown?
                        if (sse.event == "error") {
                            throw new Error("sse event error");
                        }
                        yield { event: sse.event, data: data };
                    }
                }
                done = true;
            }
            catch (e) {
                // If the user calls `stream.controller.abort()`, we should exit without throwing. 
                throw e;
            }
            finally {
                // If the user `break`s, abort the ongoing request.
                if (!done)
                    controller.abort();
            }
        }
        return new SdkStream(iterator, controller, client);
    }
    /**
     * Generates a Stream from a newline-separated ReadableStream
     * where each item is a JSON value.
     */
    static fromReadableStream(readableStream, controller, client) {
        let consumed = false;
        async function* iterLines() {
            const lineDecoder = new line_1.LineDecoder();
            const iter = ReadableStreamToAsyncIterable(readableStream);
            for await (const chunk of iter) {
                for (const line of lineDecoder.decode(chunk)) {
                    yield line;
                }
            }
            for (const line of lineDecoder.flush()) {
                yield line;
            }
        }
        async function* iterator() {
            if (consumed) {
                throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
            }
            consumed = true;
            let done = false;
            try {
                for await (const line of iterLines()) {
                    if (done)
                        continue;
                    if (line)
                        yield JSON.parse(line);
                }
                done = true;
            }
            catch (e) {
                // If the user calls `stream.controller.abort()`, we should exit without throwing.
                throw e;
            }
            finally {
                // If the user `break`s, abort the ongoing request.
                if (!done)
                    controller.abort();
            }
        }
        return new SdkStream(iterator, controller, client);
    }
}
exports.SdkStream = SdkStream;
class SSEDecoder {
    constructor() {
        this.event = null;
        this.data = [];
        this.chunks = [];
    }
    decode(line) {
        if (line.endsWith('\r')) {
            line = line.substring(0, line.length - 1);
        }
        if (!line) {
            // empty line and we didn't previously encounter any messages
            if (!this.event && !this.data.length)
                return null;
            const sse = {
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
        }
        else if (fieldname === 'data') {
            this.data.push(value);
        }
        return null;
    }
}
function partition(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
        return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
    }
    return [str, '', ''];
}
/**
 * ApiResult - 表示API响应结果的类
 * @template T 数据类型
 */
class ApiResult {
    constructor(init = {}) {
        this.data = init.data ?? {};
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
    isSuccess() {
        return this.code === "200" || this.code === "2000";
    }
    /**
     * 获取错误信息摘要
     * @returns 错误信息摘要（包含errorName、errorMsg和channelErrorMsg）
     */
    getErrorSummary() {
        const parts = [];
        if (this.errorName)
            parts.push(`[${this.errorName}]`);
        if (this.errorMsg)
            parts.push(this.errorMsg);
        if (this.channelErrorMsg)
            parts.push(`(渠道错误: ${this.channelErrorMsg})`);
        return parts.length > 0 ? parts.join(" ") : "Unknown error";
    }
}
exports.ApiResult = ApiResult;
