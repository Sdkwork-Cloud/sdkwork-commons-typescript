import { SdkClientOptions } from '../types';
import { SdkRequestOptions } from '../types';
import { SdkResponse } from '../types';
import { FinalRequestOptions, PromiseOrValue, APIPromise } from '../types';
export declare class BaseSdkClient {
    private options;
    constructor(options: SdkClientOptions);
    /**
     * Used as a callback for mutating the given `FinalRequestOptions` object.
     */
    protected prepareOptions(options: FinalRequestOptions): Promise<void>;
    /**
     * Used as a callback for mutating the given `RequestInit` object.
     *
     * This is useful for cases where you want to add certain headers based off of
     * the request properties, e.g. `method` or `url`.
     */
    protected prepareRequest(request: RequestInit, { url, options }: {
        url: string;
        options: FinalRequestOptions;
    }): Promise<void>;
    get<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp>;
    post<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp>;
    patch<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp>;
    put<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp>;
    delete<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp>;
    private methodRequest;
    request<Rsp>(options: PromiseOrValue<FinalRequestOptions>, remainingRetries?: number | null): APIPromise<Rsp>;
    private makeRequest;
    sendRequest<T>(requestOptions: SdkRequestOptions): Promise<SdkResponse<T>>;
    private buildUrl;
}
