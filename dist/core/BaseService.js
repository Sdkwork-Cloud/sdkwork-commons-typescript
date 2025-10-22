"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
/**
 * 基础服务实现类
 * @template TManager - 管理器类型
 * @template TParam - 参数类型
 * @template TVO - 返回值类型
 * @template TID - ID类型
 */
class BaseService {
    constructor(manager) {
        this.manager = manager;
    }
    /**
     * 创建新实体
     */
    async create(data, options) {
        const response = await this.manager.create(data, options);
        if (response == null || response.data == null) {
            return Promise.reject(new Error("data error!"));
        }
        return response.data;
    }
    /**
     * 更新现有实体
     */
    async update(data, options) {
        const response = await this.manager.update(data, options);
        if (response == null || response.data == null) {
            return Promise.reject(new Error("data error!"));
        }
        return response.data;
    }
    /**
     * 根据ID获取实体
     */
    async retrieve(id, options) {
        const response = await this.manager.retrieve(id, options);
        if (response == null || response.data == null) {
            return Promise.reject(new Error("data error!"));
        }
        return response.data;
    }
    /**
     * 删除实体
     */
    async delete(id, options) {
        const response = await this.manager.delete(id, options);
        if (response == null || response.data == null) {
            return Promise.reject(new Error("data error!"));
        }
        return response.data;
    }
    /**
     * 分页获取实体列表
     */
    async listByPage(data, pageableParams, options) {
        const response = await this.manager.listByPage(data, pageableParams, options);
        if (response == null || response.data == null) {
            return Promise.reject(new Error("data error!"));
        }
        return response.data;
    }
    /**
     * 获取所有实体列表
     */
    async listAllEntities(data, options) {
        const response = await this.manager.listAllEntities(data, options);
        if (response == null || response.data == null) {
            return Promise.reject(new Error("data error!"));
        }
        return response.data;
    }
}
exports.BaseService = BaseService;
