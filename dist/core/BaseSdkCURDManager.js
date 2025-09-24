"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSdkCURDManager = void 0;
const shared_1 = require("../shared");
class BaseSdkCURDManager {
    constructor(client, repository) {
        this._client = client;
        this.logger = shared_1.Logger;
    }
    handleManagerError(error, context) {
        this.logger.error(`Error in ${context}:`, error);
        throw error;
    }
}
exports.BaseSdkCURDManager = BaseSdkCURDManager;
