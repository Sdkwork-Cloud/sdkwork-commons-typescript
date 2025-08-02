import { BaseSdkClient } from "../http";
import { EntityId, IExtendedRepository, IPaginatedResult, IQueryOptions } from "./Repository";
/**
 * Abstract base class for all repository implementations
 * Provides common functionality and enforces the repository interface
 */
export declare abstract class BaseSdkRepository<T, ID extends EntityId = string> implements IExtendedRepository<T, ID> {
    protected _client: BaseSdkClient;
    constructor(client: BaseSdkClient);
    /**
     * Find an entity by its identifier
     * @param id - The unique identifier of the entity
     * @returns The entity if found, otherwise null
     */
    abstract findById(id: ID): Promise<T | null>;
    /**
     * Find all entities
     * @returns An array of all entities
     */
    abstract findAll(): Promise<T[]>;
    /**
     * Save or update an entity
     * @param entity - The entity to save
     * @returns The saved entity
     */
    abstract save(entity: T): Promise<T>;
    /**
     * Delete an entity by its identifier
     * @param id - The unique identifier of the entity to delete
     * @returns True if deletion was successful, otherwise false
     */
    abstract delete(id: ID): Promise<boolean>;
    /**
     * Check if an entity exists by its identifier
     * @param id - The unique identifier to check
     * @returns True if the entity exists, otherwise false
     */
    abstract exists(id: ID): Promise<boolean>;
    /**
     * Find entities with pagination
     * @param options - Query options for pagination and filtering
     * @returns Paginated result with entities and metadata
     */
    abstract findWithPagination(options: IQueryOptions): Promise<IPaginatedResult<T>>;
    /**
     * Find entities based on criteria
     * @param criteria - Search criteria
     * @returns Array of entities matching the criteria
     */
    abstract findByCriteria(criteria: Partial<T>): Promise<T[]>;
    /**
     * Find one entity based on criteria
     * @param criteria - Search criteria
     * @returns The first entity matching the criteria, or null if none found
     */
    abstract findOneByCriteria(criteria: Partial<T>): Promise<T | null>;
    /**
     * Count entities
     * @returns Total number of entities
     */
    abstract count(): Promise<number>;
    /**
     * Count entities matching criteria
     * @param criteria - Search criteria
     * @returns Number of entities matching the criteria
     */
    abstract countByCriteria(criteria: Partial<T>): Promise<number>;
    /**
     * Update an entity partially by its identifier
     * @param id - The unique identifier of the entity
     * @param updates - The partial updates to apply
     * @returns The updated entity
     */
    abstract update(id: ID, updates: Partial<T>): Promise<T | null>;
    /**
     * Delete entities matching criteria
     * @param criteria - Search criteria
     * @returns Number of deleted entities
     */
    abstract deleteByCriteria(criteria: Partial<T>): Promise<number>;
}
