import { BaseSdkClient } from '../http'; 
import { ApiResult, Page, Pageable, SdkRequestOptions } from '../types';
import { IManager } from './Manager';
import { QueryListParam } from './Param';

export abstract class BaseSdkManager<T extends BaseSdkClient> {
  protected _client: T;

  constructor(client: T) {
    this._client = client;
  } 
  protected buildOptions(options?: SdkRequestOptions){
    
  }
}


/**
 * 基础Manager实现类
 * @template TClient - 客户端类型
 * @template TParam - 参数类型
 * @template TResponse - 返回值类型
 * @template TID - ID类型
 */
export abstract class BaseManager<TClient extends BaseSdkClient, TParam, TResponse, TID = number | string> extends BaseSdkManager<TClient> implements IManager<TParam, TResponse, TID> { 
  constructor(client: TClient) {
    super(client); 
  }

  /**
   * 创建新实体
   */
  async create(data: TParam, options?: SdkRequestOptions): Promise<ApiResult<TResponse>> {
    try {
      options = (this._client as any).buildRequestOptions(options);
      const response = await (this._client as any).create(data, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as ApiResult<TResponse>;
    } catch (error) {
      console.error('create 请求失败:', error);
      throw error instanceof Error ? error : new Error('create 请求发生错误');
    }
  }

  /**
   * 更新现有实体
   */
  async update(data: TParam, options?: SdkRequestOptions): Promise<ApiResult<TResponse>> {
    try {
      options = (this._client as any).buildRequestOptions(options);
      const response = await (this._client as any).update(data, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as ApiResult<TResponse>;
    } catch (error) {
      console.error('update 请求失败:', error);
      throw error instanceof Error ? error : new Error('update 请求发生错误');
    }
  }

  /**
   * 根据ID获取实体
   */
  async retrieve(id: TID, options?: SdkRequestOptions): Promise<ApiResult<TResponse>> {
    try {
      options = (this._client as any).buildRequestOptions(options);
      const response = await (this._client as any).retrieve(id, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as ApiResult<TResponse>;
    } catch (error) {
      console.error('retrieve 请求失败:', error);
      throw error instanceof Error ? error : new Error('retrieve 请求发生错误');
    }
  }

  /**
   * 删除实体
   */
  async delete(id: TID, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
    try {
      options = (this._client as any).buildRequestOptions(options);
      const response = await (this._client as any).delete(id, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as ApiResult<Boolean>;
    } catch (error) {
      console.error('delete 请求失败:', error);
      throw error instanceof Error ? error : new Error('delete 请求发生错误');
    }
  }

  /**
   * 分页获取实体列表
   */
  async listByPage(data: QueryListParam, pageableParams?: {} & Pageable, options?: SdkRequestOptions): Promise<ApiResult<Page<TResponse>>> {
    try {
      options = (this._client as any).buildRequestOptions(options);
      const response = await (this._client as any).listByPage(data, pageableParams, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as ApiResult<Page<TResponse>>;
    } catch (error) {
      console.error('listByPage 请求失败:', error);
      throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
    }
  }

  /**
   * 获取所有实体列表
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ApiResult<TResponse[]>> {
    try {
      options = (this._client as any).buildRequestOptions(options);
      const response = await (this._client as any).listAllEntities(data, options);
      if (response == null || response.data == null) {
        return Promise.reject(new Error("data error!"));
      }
      return response.data as ApiResult<TResponse[]>;
    } catch (error) {
      console.error('listAllEntities 请求失败:', error);
      throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
    }
  }
}