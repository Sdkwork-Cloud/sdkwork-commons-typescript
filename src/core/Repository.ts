/**
 * Generic interface for all repository implementations
 * Defines the basic CRUD operations that all repositories should support
 */

/**
 * Generic type for entity identifiers
 */
export type EntityId = string | number;

/**
 * Generic interface for all repository implementations
 */
export interface IRepository<T, ID extends EntityId = string> {
  /**
   * Find an entity by its identifier
   * @param id - The unique identifier of the entity
   * @returns The entity if found, otherwise null
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Find an entity by its identifier
   * Synchronous version
   * @param id - The unique identifier of the entity
   * @returns The entity if found, otherwise null
   */
  findByIdSync?(id: ID): T | null;

  /**
   * Find all entities
   * @returns An array of all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Find all entities
   * Synchronous version
   * @returns An array of all entities
   */
  findAllSync?(): T[];

  /**
   * Save or update an entity
   * @param entity - The entity to save
   * @returns The saved entity
   */
  save(entity: T): Promise<T>;

  /**
   * Save or update an entity
   * Synchronous version
   * @param entity - The entity to save
   * @returns The saved entity
   */
  saveSync?(entity: T): T;

  /**
   * Delete an entity by its identifier
   * @param id - The unique identifier of the entity to delete
   * @returns True if deletion was successful, otherwise false
   */
  delete(id: ID): Promise<boolean>;

  /**
   * Delete an entity by its identifier
   * Synchronous version
   * @param id - The unique identifier of the entity to delete
   * @returns True if deletion was successful, otherwise false
   */
  deleteSync?(id: ID): boolean;

  /**
   * Check if an entity exists by its identifier
   * @param id - The unique identifier to check
   * @returns True if the entity exists, otherwise false
   */
  exists(id: ID): Promise<boolean>;

  /**
   * Check if an entity exists by its identifier
   * Synchronous version
   * @param id - The unique identifier to check
   * @returns True if the entity exists, otherwise false
   */
  existsSync?(id: ID): boolean;
}

/**
 * Result interface for paginated queries
 */
export interface IPaginatedResult<T> {
  /**
   * The data for the current page
   */
  data: T[];

  /**
   * The total number of records
   */
  total: number;

  /**
   * The current page number (1-based)
   */
  page: number;

  /**
   * The number of items per page
   */
  pageSize: number;

  /**
   * The total number of pages
   */
  totalPages: number;
}

/**
 * Options for querying with pagination and filtering
 */
export interface IQueryOptions {
  /**
   * The page number (1-based)
   */
  page?: number;

  /**
   * The number of items per page
   */
  pageSize?: number;

  /**
   * The field to sort by
   */
  sortBy?: string;

  /**
   * The sort order
   */
  sortOrder?: 'asc' | 'desc';

  /**
   * Filters to apply to the query
   */
  filters?: Record<string, any>;

  /**
   * Search term for text-based searches
   */
  search?: string;

  /**
   * Fields to include in the results
   */
  select?: string[];

  /**
   * Related entities to populate
   */
  populate?: string[];
}

/**
 * Extended repository interface with additional querying capabilities
 */
export interface IExtendedRepository<T, ID extends EntityId = string> extends IRepository<T, ID> {
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

/**
 * Generic interface for all service implementations
 * Defines the basic operations that all services should support
 */
export interface IService<T, ID extends EntityId = string> {
  /**
   * Handle service errors
   * @param error - The error to handle
   * @param context - The context in which the error occurred
   */
  handleServiceError(error: any, context: string): never;
}

/**
 * Extended service interface with additional capabilities
 */
export interface IExtendedService<T, ID extends EntityId = string> extends IService<T, ID> {
  /**
   * The repository instance used by the service
   */
  _repository: IExtendedRepository<T, ID>;

  /**
   * Perform a complex business operation
   * @param data - The data required for the operation
   * @returns The result of the operation
   */
  performComplexOperation(data: any): Promise<any>;
}
