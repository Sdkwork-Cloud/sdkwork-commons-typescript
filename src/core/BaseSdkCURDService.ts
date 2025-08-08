import { BaseSdkClient } from '../http';
import { Logger } from '../shared';
import { EntityId, IExtendedRepository, IQueryOptions, IPaginatedResult } from './Repository';
import { IExtendedCURDService } from './Service';

export abstract class BaseSdkCURDService<T = any, ID extends EntityId = string>
  implements IExtendedCURDService<T, ID>
{
  protected _client: BaseSdkClient; 
  protected logger: typeof Logger;

  constructor(client: BaseSdkClient, repository: IExtendedRepository<T, ID>) {
    this._client = client; 
    this.logger = Logger;
  } 

  handleServiceError(error: any, context: string): never {
    this.logger.error(`Error in ${context}:`, error);
    throw error;
  } 
}