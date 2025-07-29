import { BaseSdkApi } from '../core/BaseSdkApi';
import { SdkResponse } from '../types';
/**
 * Example API class demonstrating how to use the SDK
 */
export declare class ExampleApi extends BaseSdkApi {
    /**
     * Perform a GET request
     * @param path The API endpoint path
     * @param queryParams Optional query parameters
     * @returns Promise with the response data
     */
    get<T>(path: string, queryParams?: Record<string, string | number | boolean>): Promise<SdkResponse<T>>;
    /**
     * Perform a POST request
     * @param path The API endpoint path
     * @param body The request body
     * @returns Promise with the response data
     */
    post<T>(path: string, body?: any): Promise<SdkResponse<T>>;
    /**
     * Perform a PUT request
     * @param path The API endpoint path
     * @param body The request body
     * @returns Promise with the response data
     */
    put<T>(path: string, body?: any): Promise<SdkResponse<T>>;
    /**
     * Perform a DELETE request
     * @param path The API endpoint path
     * @returns Promise with the response data
     */
    delete<T>(path: string): Promise<SdkResponse<T>>;
}
