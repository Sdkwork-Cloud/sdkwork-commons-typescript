import { ApiResult, Page, Pageable, SdkRequestOptions } from "../types";
import { QueryListParam } from "./Param";
import { EntityId } from "./Repository";
/**
 * 通用Manager接口定义
 * 基于AccountManager的通用模式抽象
 */
/**
 * 通用CRUD Manager接口
 * @template TParam - 创建/更新参数类型
 * @template TResponse - 返回值类型
 * @template TID - ID类型（number | string）
 */
export interface IManager<TParam, TResponse, TID = number | string> {
    /**
     * 创建新实体
     */
    create(data: TParam, options?: SdkRequestOptions): Promise<ApiResult<TResponse>>;
    /**
     * 更新现有实体
     */
    update(data: TParam, options?: SdkRequestOptions): Promise<ApiResult<TResponse>>;
    /**
     * 根据ID获取实体
     */
    retrieve(id: TID, options?: SdkRequestOptions): Promise<ApiResult<TResponse>>;
    /**
     * 删除实体
     */
    delete(id: TID, options?: SdkRequestOptions): Promise<ApiResult<Boolean>>;
    /**
     * 分页获取实体列表
     */
    listByPage(data: QueryListParam, pageableParams?: {} & Pageable, options?: SdkRequestOptions): Promise<ApiResult<Page<TResponse>>>;
    /**
     * 获取所有实体列表
     */
    listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ApiResult<TResponse[]>>;
}
/**
 * Generic interface for all service implementations
 * Defines the basic operations that all services should support
 */
export interface ICURDManager<T, ID extends EntityId = string> extends IManager<unknown, T, ID> {
}
/**
 * Extended service interface with additional querying capabilities
 */
export interface IExtendedCURDManager<T, ID extends EntityId = string> extends ICURDManager<T, ID> {
}
/**
 * Manager工厂函数类型
 */
export type ManagerFactory<TManager> = (client: any) => TManager;
/**
 * Manager注册器接口
 */
export interface ManagerRegistry {
    register<TManager>(managerName: string, factory: ManagerFactory<TManager>): void;
    get<TManager>(managerName: string): TManager;
    has(managerName: string): boolean;
}
