export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface SdkClientOptions {
    baseUrl: string;
    apiKey?: string;
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
export interface FinalRequestOptions extends Omit<SdkRequestOptions, 'method'> {
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
export {};
