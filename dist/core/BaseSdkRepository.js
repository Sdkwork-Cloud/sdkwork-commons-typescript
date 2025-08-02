"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSdkRepository = void 0;
/**
 * Abstract base class for all repository implementations
 * Provides common functionality and enforces the repository interface
 */
class BaseSdkRepository {
    constructor(client) {
        this._client = client;
    }
}
exports.BaseSdkRepository = BaseSdkRepository;
