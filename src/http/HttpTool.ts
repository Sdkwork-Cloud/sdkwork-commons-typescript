import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ExceptionResponseHandler,
  ResponseHandler,
  SdkRequestOptions,
} from "../types";
import { SdkResponse } from "../types";

export class HttpTool {
  static async request<T>(options: SdkRequestOptions): Promise<SdkResponse<T>> {
    // Build URL with query parameters
    let url = options.url||'';
    if (options.queryParams) {
      const queryParams = new URLSearchParams();
      Object.keys(options.queryParams).forEach((key) => {
        queryParams.append(key, String(options.queryParams![key]));
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    // Prepare axios request config
    const config: AxiosRequestConfig = {
      url,
      method: options.method,
      headers: options.headers,
      timeout: options.timeout,
      data: options.body,
      withCredentials: true,
      transformRequest: [
        (data, headers) => {
          return data;
        },
      ],
    };

    try {
      let exceptionHandler: ExceptionResponseHandler | undefined =
        options.exceptionHandler;
      let responseHandler: ResponseHandler | undefined =
        options.responseHandler;
      const response: AxiosResponse<T> = await axios.request<T>(config);
      console.log("response from server=", response);
      if (response.status === 401) {
        if (exceptionHandler) {
          return exceptionHandler.onUnauthorized(response);
        }
      }
      if (response.status === 403) {
        if (exceptionHandler) {
          return exceptionHandler.onAccessDenied(response);
        }
      }
      if (response.status >= 400) {
        if (exceptionHandler) {
          return exceptionHandler.onException(response);
        }
      }
      if (responseHandler) {
        let result: SdkResponse<T> = responseHandler.handle<T>(response);
        if (result) {
          return result;
        } else {
          return Promise.reject();
        }
      }
      // Convert axios response to our SdkResponse format
      const sdkResponse: SdkResponse<T> = {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
      };

      return sdkResponse;
    } catch (error) {
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const sdkResponse: SdkResponse<T> = {
            data: error.response.data,
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers as Record<string, string>,
          };
          return sdkResponse;
        } else if (error.request) {
          // Request was made but no response received
          throw new Error("No response received from server");
        } else {
          // Something else happened
          throw new Error(error.message);
        }
      } else {
        // Non-axios error
        throw error;
      }
    }
  }
}
