import { BaseSdkClient } from "../http";
import { Pageable, SdkRequestOptions } from "../types";
export declare abstract class BaseSdkApi {
    protected _client: BaseSdkClient;
    constructor(client: BaseSdkClient);
    protected getBasePath(options?: SdkRequestOptions): string;
    protected getQueryParams(queryParams: any & Pageable, options?: SdkRequestOptions): any;
}
