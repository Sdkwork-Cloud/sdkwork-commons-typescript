import { BaseSdkClient } from '../http';
export declare abstract class BaseSdkService {
    protected _client: BaseSdkClient;
    constructor(client: BaseSdkClient);
}
