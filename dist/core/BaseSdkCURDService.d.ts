import { BaseSdkClient } from '../http';
import { Logger } from '../shared';
import { EntityId, IExtendedRepository } from './Repository';
import { IExtendedCURDService } from './Service';
export declare abstract class BaseSdkCURDService<T = any, ID extends EntityId = string> implements IExtendedCURDService<T, ID> {
    protected _client: BaseSdkClient;
    protected logger: typeof Logger;
    constructor(client: BaseSdkClient, repository: IExtendedRepository<T, ID>);
    handleServiceError(error: any, context: string): never;
}
