import { AxiosResponse } from "axios";
export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ServerSentEvent = {
    event: string | null;
    data: string;
    raw: string[];
};
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
    timeout?: number;
    queryParams?: Record<string, string | number | boolean>;
    responseHandler?: ResponseHandler;
    exceptionHandler?: ExceptionResponseHandler;
}
export interface SdkResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}
export type RequestOptions = Partial<FinalRequestOptions>;
export interface FinalRequestOptions extends Omit<SdkRequestOptions, "method"> {
    method: HTTPMethod;
    path: string;
}
export type PromiseOrValue<T> = T | Promise<T>;
declare type BaseSdkClientType = any;
export declare class APIPromise<T> implements Promise<SdkResponse<T>> {
    private client;
    private promise;
    constructor(client: BaseSdkClientType, promise: Promise<SdkResponse<T>>);
    then<TResult1 = SdkResponse<T>, TResult2 = never>(onfulfilled?: ((value: SdkResponse<T>) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<SdkResponse<T> | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<SdkResponse<T>>;
    [Symbol.toStringTag]: string;
    asResponse(): Promise<SdkResponse<T>>;
}
export declare function ReadableStreamToAsyncIterable<T>(stream: any): AsyncIterableIterator<T>;
export declare function _iterSSEMessages(response: Response, controller: AbortController): AsyncGenerator<ServerSentEvent, void, unknown>;
export declare class SdkStream<Item> implements AsyncIterable<Item> {
    private iterator;
    controller: AbortController;
    _client: BaseSdkClientType | undefined;
    constructor(iterator: () => AsyncIterator<Item>, controller: AbortController, client?: BaseSdkClientType);
    [Symbol.asyncIterator](): AsyncIterator<Item, any, undefined>;
    static fromSSEResponse<Item>(response: Response, controller: AbortController, client?: BaseSdkClientType): SdkStream<Item>;
    /**
     * Generates a Stream from a newline-separated ReadableStream
     * where each item is a JSON value.
     */
    static fromReadableStream<Item>(readableStream: ReadableStream, controller: AbortController, client?: BaseSdkClientType): SdkStream<Item>;
}
/**
 * ApiResult - 表示API响应结果的类
 * @template T 数据类型
 */
export declare class ApiResult<T> {
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
    constructor(init?: Partial<ApiResult<T>>);
    /**
     * 判断API请求是否成功
     * @returns 当状态码为"200"时返回true，否则返回false
     */
    isSuccess(): boolean;
    /**
     * 获取错误信息摘要
     * @returns 错误信息摘要（包含errorName、errorMsg和channelErrorMsg）
     */
    getErrorSummary(): string;
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
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}
/**
 * 完整分页响应
 * @template T - 分页内容项类型
 */
export interface Page<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    sort: Sort;
    totalElements: number;
    totalPages: number;
}
export {};
