import { BaseSdkClient } from "../http";
import { Pageable, SdkRequestOptions } from "../types";
import type { HTTPMethod } from "../types";
import { EnumUtils } from "../utils/enum_utils";

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
  protected initRequestOptions(
    queryParams: any & Pageable,
    method: any,
    options?: SdkRequestOptions
  ): SdkRequestOptions {
    if (typeof method === "string") {
      method = method as HTTPMethod
    }
    if (!options) {
      options = {
        method: method,
      };
    }
    if (queryParams) {
      options.queryParams = this.getQueryParams(queryParams, options);
    }

    return options;
  }
}
