import { BaseSdkClient } from '../http';

export abstract class BaseSdkApi {
  protected _client: BaseSdkClient;

  constructor(client: BaseSdkClient) {
    this._client = client;
  }
}