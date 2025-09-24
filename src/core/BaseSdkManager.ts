import { BaseSdkClient } from '../http'; 
import { SdkRequestOptions } from '../types';

export abstract class BaseSdkManager<T extends BaseSdkClient> {
  protected _client: T;

  constructor(client: T) {
    this._client = client;
  } 
  protected buildOptions(options?: SdkRequestOptions){
    
  }
}