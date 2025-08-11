"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSdkApi = void 0;
class BaseSdkApi {
    constructor(client) {
        this._client = client;
    }
    getBasePath(options) {
        return this._client.getBasePath(options);
    }
    getQueryParams(queryParams, options) {
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
    initRequestOptions(queryParams, method, options) {
        if (typeof method === "string") {
            method = method;
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
exports.BaseSdkApi = BaseSdkApi;
