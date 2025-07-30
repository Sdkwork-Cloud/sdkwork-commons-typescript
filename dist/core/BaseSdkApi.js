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
}
exports.BaseSdkApi = BaseSdkApi;
