import { BaseSdkClient } from '../http';
export declare abstract class BaseSdkApi {
    protected _client: BaseSdkClient;
    constructor(client: BaseSdkClient);
    protected getBasePath(): string;
}
