"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleApi = void 0;
const BaseSdkApi_1 = require("../core/BaseSdkApi");
/**
 * Example API class demonstrating how to use the SDK
 */
class ExampleApi extends BaseSdkApi_1.BaseSdkApi {
    /**
     * Perform a GET request
     * @param path The API endpoint path
     * @param queryParams Optional query parameters
     * @returns Promise with the response data
     */
    async get(path, queryParams) {
        if (!this._client) {
            throw new Error('Client not initialized');
        }
        const requestOptions = {
            url: path,
            method: 'GET',
            queryParams
        };
        return await this._client.sendRequest(requestOptions);
    }
    /**
     * Perform a POST request
     * @param path The API endpoint path
     * @param body The request body
     * @returns Promise with the response data
     */
    async post(path, body) {
        if (!this._client) {
            throw new Error('Client not initialized');
        }
        const requestOptions = {
            url: path,
            method: 'POST',
            body
        };
        return await this._client.sendRequest(requestOptions);
    }
    /**
     * Perform a PUT request
     * @param path The API endpoint path
     * @param body The request body
     * @returns Promise with the response data
     */
    async put(path, body) {
        if (!this._client) {
            throw new Error('Client not initialized');
        }
        const requestOptions = {
            url: path,
            method: 'PUT',
            body
        };
        return await this._client.sendRequest(requestOptions);
    }
    /**
     * Perform a DELETE request
     * @param path The API endpoint path
     * @returns Promise with the response data
     */
    async delete(path) {
        if (!this._client) {
            throw new Error('Client not initialized');
        }
        const requestOptions = {
            url: path,
            method: 'DELETE'
        };
        return await this._client.sendRequest(requestOptions);
    }
}
exports.ExampleApi = ExampleApi;
