import { BaseSdkClient } from '../http'; 

export abstract class BaseSdkService {
  protected _client: BaseSdkClient;

  constructor(client: BaseSdkClient) {
    this._client = client;
  } 
}