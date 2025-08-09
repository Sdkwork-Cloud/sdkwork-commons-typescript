import { BaseSdkApi } from '../core/BaseSdkApi';
import { FinalRequestOptions, SdkRequestOptions } from '../types';
import { SdkResponse } from '../types';
import { HTTPMethod } from '../types';

/**
 * Example API class demonstrating how to use the SDK
 */
export class ExampleApi extends BaseSdkApi {
  /**
   * Perform a GET request
   * @param path The API endpoint path
   * @param queryParams Optional query parameters
   * @returns Promise with the response data
   */
  public async get<T>(path: string, queryParams?: Record<string, string | number | boolean>): Promise<SdkResponse<T>> {
    if (!this._client) {
      throw new Error('Client not initialized');
    }

    const requestOptions: FinalRequestOptions = {
      url: path,
      method: 'GET',
      queryParams,
      path: ''
    };

    return await this._client.request<T>(requestOptions);
  }

  /**
   * Perform a POST request
   * @param path The API endpoint path
   * @param body The request body
   * @returns Promise with the response data
   */
  public async post<T>(path: string, body?: any): Promise<SdkResponse<T>> {
    if (!this._client) {
      throw new Error('Client not initialized');
    }

    const requestOptions: FinalRequestOptions = {
      url: path,
      method: 'POST',
      body,
      path: ''
    };

    return await this._client.request<T>(requestOptions);
  }

  /**
   * Perform a PUT request
   * @param path The API endpoint path
   * @param body The request body
   * @returns Promise with the response data
   */
  public async put<T>(path: string, body?: any): Promise<SdkResponse<T>> {
    if (!this._client) {
      throw new Error('Client not initialized');
    }

    const requestOptions: FinalRequestOptions = {
      url: path,
      method: 'PUT',
      body,
      path: ''
    };

    return await this._client.request<T>(requestOptions);
  }

  /**
   * Perform a DELETE request
   * @param path The API endpoint path
   * @returns Promise with the response data
   */
  public async delete<T>(path: string): Promise<SdkResponse<T>> {
    if (!this._client) {
      throw new Error('Client not initialized');
    }

    const requestOptions: FinalRequestOptions = {
      url: path,
      method: 'DELETE',
      path: ''
    };

    return await this._client.request<T>(requestOptions);
  }
}