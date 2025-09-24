import { BaseSdkClient } from '../http';
import { SdkRequestOptions } from '../types';
export declare abstract class BaseSdkManager<T extends BaseSdkClient> {
    protected _client: T;
    constructor(client: T);
    protected buildOptions(options?: SdkRequestOptions): void;
}
