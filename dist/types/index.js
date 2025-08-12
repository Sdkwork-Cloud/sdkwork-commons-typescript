"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResult = exports.APIPromise = void 0;
__exportStar(require("./stream"), exports);
class APIPromise {
    constructor(client, promise) {
        this.client = client;
        this[_a] = "APIPromise";
        this.promise = promise;
    }
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.promise.catch(onrejected);
    }
    finally(onfinally) {
        return this.promise.finally(onfinally);
    }
    // Additional methods to make it compatible with the extended functionality
    asResponse() {
        return this.promise;
    }
}
exports.APIPromise = APIPromise;
_a = Symbol.toStringTag;
/**
 * ApiResult - 表示API响应结果的类
 * @template T 数据类型
 */
class ApiResult {
    constructor(init = {}) {
        this.data = init.data ?? {};
        this.code = init.code ?? "";
        this.msg = init.msg ?? "";
        this.requestId = init.requestId ?? "";
        this.ip = init.ip ?? "";
        this.hostname = init.hostname ?? "";
        this.errorMsg = init.errorMsg ?? "";
        this.errorName = init.errorName ?? "";
        this.channelErrorCode = init.channelErrorCode ?? "";
        this.channelErrorMsg = init.channelErrorMsg ?? "";
        this.sign = init.sign ?? "";
        this.signType = init.signType ?? "";
        this.encryptType = init.encryptType ?? "";
        this.encryptedText = init.encryptedText ?? "";
    }
    /**
     * 判断API请求是否成功
     * @returns 当状态码为"200"时返回true，否则返回false
     */
    isSuccess() {
        return this.code === "200" || this.code === "2000";
    }
    /**
     * 获取错误信息摘要
     * @returns 错误信息摘要（包含errorName、errorMsg和channelErrorMsg）
     */
    getErrorSummary() {
        const parts = [];
        if (this.errorName)
            parts.push(`[${this.errorName}]`);
        if (this.errorMsg)
            parts.push(this.errorMsg);
        if (this.channelErrorMsg)
            parts.push(`(渠道错误: ${this.channelErrorMsg})`);
        return parts.length > 0 ? parts.join(" ") : "Unknown error";
    }
}
exports.ApiResult = ApiResult;
