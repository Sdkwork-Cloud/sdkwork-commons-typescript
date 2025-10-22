import { Page, Pageable, SdkRequestOptions } from "../types";
import { QueryListParam } from "./Param";
/**
 * 通用CRUD服务接口
 * @template TParam - 创建/更新参数类型
 * @template TVO - 返回值类型
 * @template TID - ID类型（number | string）
 */
export interface CURDService<TParam, TVO, TID = number | string> {
    /**
     * 创建新实体
     */
    create(data: TParam, options?: SdkRequestOptions): Promise<TVO>;
    /**
     * 更新现有实体
     */
    update(data: TParam, options?: SdkRequestOptions): Promise<TVO>;
    /**
     * 根据ID获取实体
     */
    retrieve(id: TID, options?: SdkRequestOptions): Promise<TVO>;
    /**
     * 删除实体
     */
    delete(id: TID, options?: SdkRequestOptions): Promise<Boolean>;
    /**
     * 分页获取实体列表
     */
    listByPage(data: QueryListParam, pageableParams?: {} & Pageable, options?: SdkRequestOptions): Promise<Page<TVO>>;
    /**
     * 获取所有实体列表
     */
    listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<TVO[]>;
}
/**
 * 服务工厂函数类型
 */
export type ServiceFactory<TService> = () => TService;
/**
 * 服务注册器接口
 */
export interface ServiceRegistry {
    register<TService>(serviceName: string, factory: ServiceFactory<TService>): void;
    get<TService>(serviceName: string): TService;
    has(serviceName: string): boolean;
}
