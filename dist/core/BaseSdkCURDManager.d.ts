import { BaseSdkClient } from '../http';
import { Logger } from '../shared';
import { EntityId, IExtendedRepository } from './Repository';
import { IExtendedCURDManager } from './Manager';
export declare abstract class BaseSdkCURDManager<T = any, ID extends EntityId = string> implements IExtendedCURDManager<T, ID> {
    protected _client: BaseSdkClient;
    protected logger: typeof Logger;
    constructor(client: BaseSdkClient, repository: IExtendedRepository<T, ID>);
    handleManagerError(error: any, context: string): never;
}
