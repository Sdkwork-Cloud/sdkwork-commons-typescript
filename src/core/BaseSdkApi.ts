import { BaseSdkClient } from '../http';
import { SdkRequestOptions } from '../types';

export abstract class BaseSdkApi {
  protected _client: BaseSdkClient;

  constructor(client: BaseSdkClient) {
    this._client = client;
  }
  protected getBasePath(options?: SdkRequestOptions) {
    return this._client.getBasePath(options);
  }
}