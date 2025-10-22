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
export declare abstract class BaseService<TManager, TParam, TVO, TID = number | string> implements CURDService<TParam, TVO, TID> {
    protected manager: TManager;
    constructor(manager: TManager);
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
