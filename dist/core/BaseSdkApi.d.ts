import { BaseSdkClient } from '../http';
import { SdkRequestOptions } from '../types';
export declare abstract class BaseSdkApi {
    protected _client: BaseSdkClient;
    constructor(client: BaseSdkClient);
    protected getBasePath(options?: SdkRequestOptions): string;
}
