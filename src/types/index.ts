export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface SdkClientOptions {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface SdkRequestOptions {
  url: string;
  method: HTTPMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  queryParams?: Record<string, string | number | boolean>;
}

export interface SdkResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}



export type RequestOptions = Partial<FinalRequestOptions>;

// Create a version of SdkRequestOptions with HTTPMethod instead of literal types
export interface FinalRequestOptions extends Omit<SdkRequestOptions, 'method'> {
  method: HTTPMethod;
  path: string;
}

export type PromiseOrValue<T> = T | Promise<T>;

// We'll define the actual BaseSdkClient in the http module
// Just declare the type here for APIPromise
declare type BaseSdkClientType = any;

export class APIPromise<T> implements Promise<SdkResponse<T>> {
  private promise: Promise<SdkResponse<T>>;
  
  constructor(
    private client: BaseSdkClientType,
    promise: Promise<SdkResponse<T>>
  ) {
    this.promise = promise;
  }
  
  then<TResult1 = SdkResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: SdkResponse<T>) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }
  
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<SdkResponse<T> | TResult> {
    return this.promise.catch(onrejected);
  }
  
  finally(onfinally?: (() => void) | undefined | null): Promise<SdkResponse<T>> {
    return this.promise.finally(onfinally);
  }
  
  [Symbol.toStringTag]: string = 'APIPromise';
  
  // Additional methods to make it compatible with the extended functionality
  asResponse(): Promise<SdkResponse<T>> {
    return this.promise;
  }
}