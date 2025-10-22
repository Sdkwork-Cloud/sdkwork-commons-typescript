import { BaseSdkClient } from '../http';
import { ApiResult, Page, Pageable, SdkRequestOptions } from '../types';
import { IManager } from './Manager';
import { QueryListParam } from './Param';
export declare abstract class BaseSdkManager<T extends BaseSdkClient> {
    protected _client: T;
    constructor(client: T);
    protected buildOptions(options?: SdkRequestOptions): void;
}
/**
 * 基础Manager实现类
 * @template TClient - 客户端类型
 * @template TParam - 参数类型
 * @template TResponse - 返回值类型
 * @template TID - ID类型
 */
export declare abstract class BaseManager<TClient extends BaseSdkClient, TParam, TResponse, TID = number | string> extends BaseSdkManager<TClient> implements IManager<TParam, TResponse, TID> {
    constructor(client: TClient);
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
