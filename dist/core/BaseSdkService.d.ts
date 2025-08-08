import { BaseSdkClient } from '../http';
export declare abstract class BaseSdkService<T extends BaseSdkClient> {
    protected _client: T;
    constructor(client: T);
}
