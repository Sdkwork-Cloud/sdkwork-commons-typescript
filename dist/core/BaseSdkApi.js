"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSdkApi = void 0;
class BaseSdkApi {
    constructor(client) {
        this._client = client;
    }
    getBasePath() {
        return this._client.getBasePath();
    }
}
exports.BaseSdkApi = BaseSdkApi;
