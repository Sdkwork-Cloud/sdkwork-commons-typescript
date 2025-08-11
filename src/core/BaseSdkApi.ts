import { BaseSdkClient } from "../http";
import { Pageable, SdkRequestOptions } from "../types";

export abstract class BaseSdkApi {
  protected _client: BaseSdkClient;

  constructor(client: BaseSdkClient) {
    this._client = client;
  }
  protected getBasePath(options?: SdkRequestOptions) {
    return this._client.getBasePath(options);
  }
  protected getQueryParams(
    queryParams: any & Pageable,
    options?: SdkRequestOptions
  ) {
    let optionsQueryParam = {};
    if (options && options.queryParams) {
      optionsQueryParam = options.queryParams;
    }
    const result = {
      ...optionsQueryParam,
      ...(queryParams || {}),
    };
    return result;
  }
}
