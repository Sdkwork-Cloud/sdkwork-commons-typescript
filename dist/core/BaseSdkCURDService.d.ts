import { BaseSdkClient } from '../http';
import { Logger } from '../shared';
import { EntityId, IExtendedRepository, IQueryOptions, IPaginatedResult } from './Repository';
import { IExtendedCURDService } from './Service';
export declare abstract class BaseSdkCURDService<T = any, ID extends EntityId = string> implements IExtendedCURDService<T, ID> {
    protected _client: BaseSdkClient;
    _repository: IExtendedRepository<T, ID>;
    protected logger: typeof Logger;
    constructor(client: BaseSdkClient, repository: IExtendedRepository<T, ID>);
    handleServiceError(error: any, context: string): never;
    /**
     * Find an entity by its identifier
     * @param id - The unique identifier of the entity
     * @returns The entity if found, otherwise null
     */
    findById(id: ID): Promise<T | null>;
    /**
     * Find all entities
     * @returns An array of all entities
     */
    findAll(): Promise<T[]>;
    /**
     * Save or update an entity
     * @param entity - The entity to save
     * @returns The saved entity
     */
    save(entity: T): Promise<T>;
    /**
     * Delete an entity by its identifier
     * @param id - The unique identifier of the entity to delete
     * @returns True if deletion was successful, otherwise false
     */
    delete(id: ID): Promise<boolean>;
    /**
     * Check if an entity exists by its identifier
     * @param id - The unique identifier to check
     * @returns True if the entity exists, otherwise false
     */
    exists(id: ID): Promise<boolean>;
    /**
     * Find entities with pagination
     * @param options - Query options for pagination and filtering
     * @returns Paginated result with entities and metadata
     */
    findWithPagination(options: IQueryOptions): Promise<IPaginatedResult<T>>;
    /**
     * Find entities based on criteria
     * @param criteria - Search criteria
     * @returns Array of entities matching the criteria
     */
    findByCriteria(criteria: Partial<T>): Promise<T[]>;
    /**
     * Find one entity based on criteria
     * @param criteria - Search criteria
     * @returns The first entity matching the criteria, or null if none found
     */
    findOneByCriteria(criteria: Partial<T>): Promise<T | null>;
    /**
     * Count entities
     * @returns Total number of entities
     */
    count(): Promise<number>;
    /**
     * Count entities matching criteria
     * @param criteria - Search criteria
     * @returns Number of entities matching the criteria
     */
    countByCriteria(criteria: Partial<T>): Promise<number>;
    /**
     * Update an entity partially by its identifier
     * @param id - The unique identifier of the entity
     * @param updates - The partial updates to apply
     * @returns The updated entity
     */
    update(id: ID, updates: Partial<T>): Promise<T | null>;
    /**
     * Delete entities matching criteria
     * @param criteria - Search criteria
     * @returns Number of deleted entities
     */
    deleteByCriteria(criteria: Partial<T>): Promise<number>;
}
