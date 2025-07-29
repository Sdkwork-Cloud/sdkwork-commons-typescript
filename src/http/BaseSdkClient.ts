import { SdkClientOptions } from '../types';
import { SdkRequestOptions } from '../types';
import { SdkResponse } from '../types';
import { HttpTool } from './HttpTool';
import { HTTPMethod, FinalRequestOptions, PromiseOrValue, APIPromise } from '../types';

export class BaseSdkClient {
  private options: SdkClientOptions;

  constructor(options: SdkClientOptions) {
    this.options = options;
  }

  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  protected async prepareOptions(options: FinalRequestOptions): Promise<void> {}

  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  protected async prepareRequest(
    request: RequestInit,
    { url, options }: { url: string; options: FinalRequestOptions },
  ): Promise<void> {}

  get<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('GET', path, opts);
  }

  post<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('POST', path, opts);
  }

  patch<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('PATCH', path, opts);
  }

  put<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('PUT', path, opts);
  }

  delete<Rsp>(path: string, opts?: PromiseOrValue<SdkRequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('DELETE', path, opts);
  }

  private methodRequest<Rsp>(
    method: HTTPMethod,
    path: string,
    opts?: PromiseOrValue<SdkRequestOptions>,
  ): APIPromise<Rsp> {
    return this.request(
      Promise.resolve(opts).then((opts) => {
        // Create the final options object without spreading to avoid type conflicts
        const finalOptions: FinalRequestOptions = {
          method,
          path,
          url: path,
          headers: opts?.headers,
          body: opts?.body,
          timeout: opts?.timeout,
          queryParams: opts?.queryParams
        };
        
        return finalOptions;
      }),
    );
  }

  request<Rsp>(
    options: PromiseOrValue<FinalRequestOptions>,
    remainingRetries: number | null = null,
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
    // Merge client options with request options
    const mergedOptions: SdkRequestOptions = {
      method:opts.method,
      url: url,
      headers: {
        ...this.options.headers,
        ...opts.headers
      },
      timeout: opts.timeout || this.options.timeout,
      body: opts.body,
      queryParams: opts.queryParams
    };

    // Add API key to headers if provided
    if (this.options.apiKey) {
      mergedOptions.headers = {
        ...mergedOptions.headers,
        'Authorization': `Bearer ${this.options.apiKey}`
      };
    }

    return await HttpTool.request<Rsp>(mergedOptions);
  }

  public async sendRequest<T>(requestOptions: SdkRequestOptions): Promise<SdkResponse<T>> {
    // Merge client options with request options
    const mergedOptions: SdkRequestOptions = {
      ...requestOptions,
      url: this.buildUrl(requestOptions.url),
      headers: {
        ...this.options.headers,
        ...requestOptions.headers
      },
      timeout: requestOptions.timeout || this.options.timeout
    };

    // Add API key to headers if provided
    if (this.options.apiKey) {
      mergedOptions.headers = {
        ...mergedOptions.headers,
        'Authorization': `Bearer ${this.options.apiKey}`
      };
    }

    return await HttpTool.request<T>(mergedOptions);
  }

  private buildUrl(path: string): string {
    // If path is already an absolute URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Ensure baseUrl doesn't end with a slash and path doesn't start with one
    const baseUrl = this.options.baseUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    
    return baseUrl + normalizedPath;
  }
}