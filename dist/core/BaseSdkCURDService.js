"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSdkCURDService = void 0;
const shared_1 = require("../shared");
class BaseSdkCURDService {
    constructor(client, repository) {
        this._client = client;
        this.logger = shared_1.Logger;
    }
    handleServiceError(error, context) {
        this.logger.error(`Error in ${context}:`, error);
        throw error;
    }
}
exports.BaseSdkCURDService = BaseSdkCURDService;
