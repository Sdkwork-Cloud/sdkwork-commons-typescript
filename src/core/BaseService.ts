import { Page, Pageable, SdkRequestOptions } from "../types";
import { QueryListParam } from "./Param";
import { CURDService } from "./Service";

/**
 * 基础服务实现类
 * @template TManager - 管理器类型
 * @template TParam - 参数类型
 * @template TVO - 返回值类型
 * @template TID - ID类型
 */
export abstract class BaseService<TManager, TParam, TVO, TID = number | string> implements CURDService<TParam, TVO, TID> {
    protected manager: TManager;
  
    constructor(manager: TManager) {
      this.manager = manager;
    }
  
    /**
     * 创建新实体
     */
    async create(data: TParam, options?: SdkRequestOptions): Promise<TVO> {
      const response = await (this.manager as any).create(data, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as TVO;
    }
  
    /**
     * 更新现有实体
     */
    async update(data: TParam, options?: SdkRequestOptions): Promise<TVO> {
      const response = await (this.manager as any).update(data, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as TVO;
    }
  
    /**
     * 根据ID获取实体
     */
    async retrieve(id: TID, options?: SdkRequestOptions): Promise<TVO> {
      const response = await (this.manager as any).retrieve(id, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as TVO;
    }
  
    /**
     * 删除实体
     */
    async delete(id: TID, options?: SdkRequestOptions): Promise<Boolean> {
      const response = await (this.manager as any).delete(id, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as Boolean;
    }
  
    /**
     * 分页获取实体列表
     */
    async listByPage(data: QueryListParam, pageableParams?: {} & Pageable, options?: SdkRequestOptions): Promise<Page<TVO>> {
      const response = await (this.manager as any).listByPage(data, pageableParams, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as Page<TVO>;
    }
  
    /**
     * 获取所有实体列表
     */
    async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<TVO[]> {
      const response = await (this.manager as any).listAllEntities(data, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as TVO[];
    }
  }
  