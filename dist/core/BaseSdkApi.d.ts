import { BaseSdkClient } from '../http';
export declare abstract class BaseSdkApi {
    protected _client: BaseSdkClient | undefined;
    constructor(client: BaseSdkClient);
}
