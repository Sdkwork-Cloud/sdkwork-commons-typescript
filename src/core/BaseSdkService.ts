import { BaseSdkClient } from '../http'; 

export abstract class BaseSdkService<T extends BaseSdkClient> {
  protected _client: T;

  constructor(client: T) {
    this._client = client;
  } 
}