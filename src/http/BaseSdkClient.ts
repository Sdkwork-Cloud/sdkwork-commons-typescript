import { SdkClientOptions } from "../types";
import { SdkRequestOptions } from "../types";
import { SdkResponse } from "../types";
import { HttpTool } from "./HttpTool";
import {
  HTTPMethod,
  FinalRequestOptions,
  PromiseOrValue,
  APIPromise,
} from "../types";

export class BaseSdkClient {
  private options: SdkClientOptions;

  constructor(options: SdkClientOptions) {
    this.options = options;
  }

  /**
   * Used as a callback for mutating the given `SdkRequestOptions` object.
   */
  protected async prepareOptions(
    requestOptions: SdkRequestOptions
  ): Promise<void> {
    if (!requestOptions?.headers) {
      requestOptions.headers = {};
    }
    if (this.options.apiKey) {
      requestOptions.headers["Authorization"] = `Bearer ${this.options.apiKey}`;
    }
    const tokenManager = this.options.tokenManager;
    const accessToken =
      this.options.accessToken || tokenManager?.getAccessToken();
    if (accessToken) {
      requestOptions.headers["Access-Token"] = `${accessToken}`;
    }
    const authToken = tokenManager?.getAuthToken();
    if (authToken) {
      requestOptions.headers["Authorization"] = `Bearer ${authToken}`;
    }
  }

  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  protected async prepareRequest(
    requestOptions: SdkRequestOptions
  ): Promise<void> {
    if (!requestOptions.exceptionHandler) {
      requestOptions.exceptionHandler = this.options.exceptionHandler;
    }
    if (!requestOptions.responseHandler) {
      requestOptions.responseHandler = this.options.responseHandler;
    }
  }

  get<Rsp>(
    path: string,
    opts?: PromiseOrValue<SdkRequestOptions>
  ): APIPromise<Rsp> {
    return this.methodRequest("GET", path, opts);
  }

  post<Rsp>(
    path: string,
    opts?: PromiseOrValue<SdkRequestOptions>
  ): APIPromise<Rsp> {
    return this.methodRequest("POST", path, opts);
  }

  patch<Rsp>(
    path: string,
    opts?: PromiseOrValue<SdkRequestOptions>
  ): APIPromise<Rsp> {
    return this.methodRequest("PATCH", path, opts);
  }

  put<Rsp>(
    path: string,
    opts?: PromiseOrValue<SdkRequestOptions>
  ): APIPromise<Rsp> {
    return this.methodRequest("PUT", path, opts);
  }

  delete<Rsp>(
    path: string,
    opts?: PromiseOrValue<SdkRequestOptions>
  ): APIPromise<Rsp> {
    return this.methodRequest("DELETE", path, opts);
  }

  private methodRequest<Rsp>(
    method: HTTPMethod,
    path: string,
    opts?: PromiseOrValue<SdkRequestOptions>
  ): APIPromise<Rsp> {
    return this.request(
      Promise.resolve(opts).then((opts) => {
        this.prepareOptions(opts ?? ({} as SdkRequestOptions));
        // Create the final options object without spreading to avoid type conflicts
        const finalOptions: FinalRequestOptions = {
          ...opts,
          method,
          path,
          url: path,
          headers: opts?.headers,
          body: opts?.body,
          timeout: opts?.timeout,
          queryParams: opts?.queryParams,
        };
        return finalOptions;
      })
    );
  }

  request<Rsp>(
    options: PromiseOrValue<FinalRequestOptions>,
    remainingRetries: number | null = null
  ): APIPromise<Rsp> {
    return new APIPromise(this, this.makeRequest(options, remainingRetries));
  }

  private async makeRequest<Rsp>(
    options: PromiseOrValue<FinalRequestOptions>,
    remainingRetries: number | null
  ): Promise<SdkResponse<Rsp>> {
    const opts = await Promise.resolve(options);

    // Call prepareOptions hook
    await this.prepareOptions(opts);

    // Build URL
    const url = this.buildUrl(opts.path);
    this.prepareRequest(opts);
    // Merge client options with request options
    const mergedOptions: SdkRequestOptions = {
      ...opts,
      method: opts.method,
      url: url,
      headers: {
        ...this.options.headers,
        ...opts.headers,
      },
      timeout: opts.timeout || this.options.timeout,
      body: opts.body,
      queryParams: opts.queryParams,
      responseHandler: opts.responseHandler,
      exceptionHandler: opts.exceptionHandler,
    };

    // Add API key to headers if provided
    if (this.options.apiKey) {
      mergedOptions.headers = {
        ...mergedOptions.headers,
        Authorization: `Bearer ${this.options.apiKey}`,
      };
    }

    return await HttpTool.request<Rsp>(mergedOptions);
  }

  public async sendRequest<T>(
    requestOptions: SdkRequestOptions
  ): Promise<SdkResponse<T>> {
    // Merge client options with request options
    const mergedOptions: SdkRequestOptions = {
      ...requestOptions,
      url: this.buildUrl(requestOptions.url||''),
      headers: {
        ...this.options.headers,
        ...requestOptions.headers,
      },
      timeout: requestOptions.timeout || this.options.timeout,
    };

    // Add API key to headers if provided
    if (this.options.apiKey) {
      mergedOptions.headers = {
        ...mergedOptions.headers,
        Authorization: `Bearer ${this.options.apiKey}`,
      };
    }
    this.prepareRequest(mergedOptions);
    return await HttpTool.request<T>(mergedOptions);
  }

  private buildUrl(path: string): string {
    // If path is already an absolute URL, return as is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Ensure baseUrl doesn't end with a slash and path doesn't start with one
    const baseUrl = this.options.baseUrl.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : "/" + path;

    return baseUrl + normalizedPath;
  }
  getBasePath(requestOptions?: SdkRequestOptions) {
    return this.options.baseUrl;
  }
  protected buildRequestOptions(requestOptions?: SdkRequestOptions) {
    if (!requestOptions) {
      requestOptions = {
        method: "GET",
      };
    }
    if (!requestOptions.exceptionHandler) {
      requestOptions.exceptionHandler = this.options.exceptionHandler;
    }
    if (!requestOptions.responseHandler) {
      requestOptions.responseHandler = this.options.responseHandler;
    }
    return requestOptions;
  }
}
