"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseManager = exports.BaseSdkManager = void 0;
class BaseSdkManager {
    constructor(client) {
        this._client = client;
    }
    buildOptions(options) {
    }
}
exports.BaseSdkManager = BaseSdkManager;
/**
 * 基础Manager实现类
 * @template TClient - 客户端类型
 * @template TParam - 参数类型
 * @template TResponse - 返回值类型
 * @template TID - ID类型
 */
class BaseManager extends BaseSdkManager {
    constructor(client) {
        super(client);
    }
    /**
     * 创建新实体
     */
    async create(data, options) {
        try {
            options = this._client.buildRequestOptions(options);
            const response = await this._client.create(data, options);
            if (response == null || response.data == null) {
                return Promise.reject(new Error("data error!"));
            }
            return response.data;
        }
        catch (error) {
            console.error('create 请求失败:', error);
            throw error instanceof Error ? error : new Error('create 请求发生错误');
        }
    }
    /**
     * 更新现有实体
     */
    async update(data, options) {
        try {
            options = this._client.buildRequestOptions(options);
            const response = await this._client.update(data, options);
            if (response == null || response.data == null) {
                return Promise.reject(new Error("data error!"));
            }
            return response.data;
        }
        catch (error) {
            console.error('update 请求失败:', error);
            throw error instanceof Error ? error : new Error('update 请求发生错误');
        }
    }
    /**
     * 根据ID获取实体
     */
    async retrieve(id, options) {
        try {
            options = this._client.buildRequestOptions(options);
            const response = await this._client.retrieve(id, options);
            if (response == null || response.data == null) {
                return Promise.reject(new Error("data error!"));
            }
            return response.data;
        }
        catch (error) {
            console.error('retrieve 请求失败:', error);
            throw error instanceof Error ? error : new Error('retrieve 请求发生错误');
        }
    }
    /**
     * 删除实体
     */
    async delete(id, options) {
        try {
            options = this._client.buildRequestOptions(options);
            const response = await this._client.delete(id, options);
            if (response == null || response.data == null) {
                return Promise.reject(new Error("data error!"));
            }
            return response.data;
        }
        catch (error) {
            console.error('delete 请求失败:', error);
            throw error instanceof Error ? error : new Error('delete 请求发生错误');
        }
    }
    /**
     * 分页获取实体列表
     */
    async listByPage(data, pageableParams, options) {
        try {
            options = this._client.buildRequestOptions(options);
            const response = await this._client.listByPage(data, pageableParams, options);
            if (response == null || response.data == null) {
                return Promise.reject(new Error("data error!"));
            }
            return response.data;
        }
        catch (error) {
            console.error('listByPage 请求失败:', error);
            throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
        }
    }
    /**
     * 获取所有实体列表
     */
    async listAllEntities(data, options) {
        try {
            options = this._client.buildRequestOptions(options);
            const response = await this._client.listAllEntities(data, options);
            if (response == null || response.data == null) {
                return Promise.reject(new Error("data error!"));
            }
            return response.data;
        }
        catch (error) {
            console.error('listAllEntities 请求失败:', error);
            throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
        }
    }
}
exports.BaseManager = BaseManager;
