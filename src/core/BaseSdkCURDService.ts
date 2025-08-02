import { BaseSdkClient } from '../http';
import { Logger } from '../shared';
import { EntityId, IExtendedRepository, IQueryOptions, IPaginatedResult } from './Repository';
import { IExtendedCURDService } from './Service';

export abstract class BaseSdkCURDService<T = any, ID extends EntityId = string>
  implements IExtendedCURDService<T, ID>
{
  protected _client: BaseSdkClient;
  _repository: IExtendedRepository<T, ID>;
  protected logger: typeof Logger;

  constructor(client: BaseSdkClient, repository: IExtendedRepository<T, ID>) {
    this._client = client;
    this._repository = repository;
    this.logger = Logger;
  } 

  handleServiceError(error: any, context: string): never {
    this.logger.error(`Error in ${context}:`, error);
    throw error;
  }

  /**
   * Find an entity by its identifier
   * @param id - The unique identifier of the entity
   * @returns The entity if found, otherwise null
   */
  async findById(id: ID): Promise<T | null> {
    try {
      return await this._repository.findById(id);
    } catch (error) {
      this.handleServiceError(error, `findById(${id})`);
    }
  }

  /**
   * Find all entities
   * @returns An array of all entities
   */
  async findAll(): Promise<T[]> {
    try {
      return await this._repository.findAll();
    } catch (error) {
      this.handleServiceError(error, 'findAll');
    }
  }

  /**
   * Save or update an entity
   * @param entity - The entity to save
   * @returns The saved entity
   */
  async save(entity: T): Promise<T> {
    try {
      return await this._repository.save(entity);
    } catch (error) {
      this.handleServiceError(error, 'save');
    }
  }

  /**
   * Delete an entity by its identifier
   * @param id - The unique identifier of the entity to delete
   * @returns True if deletion was successful, otherwise false
   */
  async delete(id: ID): Promise<boolean> {
    try {
      return await this._repository.delete(id);
    } catch (error) {
      this.handleServiceError(error, `delete(${id})`);
    }
  }

  /**
   * Check if an entity exists by its identifier
   * @param id - The unique identifier to check
   * @returns True if the entity exists, otherwise false
   */
  async exists(id: ID): Promise<boolean> {
    try {
      return await this._repository.exists(id);
    } catch (error) {
      this.handleServiceError(error, `exists(${id})`);
    }
  }

  /**
   * Find entities with pagination
   * @param options - Query options for pagination and filtering
   * @returns Paginated result with entities and metadata
   */
  async findWithPagination(options: IQueryOptions): Promise<IPaginatedResult<T>> {
    try {
      return await this._repository.findWithPagination(options);
    } catch (error) {
      this.handleServiceError(error, 'findWithPagination');
    }
  }

  /**
   * Find entities based on criteria
   * @param criteria - Search criteria
   * @returns Array of entities matching the criteria
   */
  async findByCriteria(criteria: Partial<T>): Promise<T[]> {
    try {
      return await this._repository.findByCriteria(criteria);
    } catch (error) {
      this.handleServiceError(error, 'findByCriteria');
    }
  }

  /**
   * Find one entity based on criteria
   * @param criteria - Search criteria
   * @returns The first entity matching the criteria, or null if none found
   */
  async findOneByCriteria(criteria: Partial<T>): Promise<T | null> {
    try {
      return await this._repository.findOneByCriteria(criteria);
    } catch (error) {
      this.handleServiceError(error, 'findOneByCriteria');
    }
  }

  /**
   * Count entities
   * @returns Total number of entities
   */
  async count(): Promise<number> {
    try {
      return await this._repository.count();
    } catch (error) {
      this.handleServiceError(error, 'count');
    }
  }

  /**
   * Count entities matching criteria
   * @param criteria - Search criteria
   * @returns Number of entities matching the criteria
   */
  async countByCriteria(criteria: Partial<T>): Promise<number> {
    try {
      return await this._repository.countByCriteria(criteria);
    } catch (error) {
      this.handleServiceError(error, 'countByCriteria');
    }
  }

  /**
   * Update an entity partially by its identifier
   * @param id - The unique identifier of the entity
   * @param updates - The partial updates to apply
   * @returns The updated entity
   */
  async update(id: ID, updates: Partial<T>): Promise<T | null> {
    try {
      return await this._repository.update(id, updates);
    } catch (error) {
      this.handleServiceError(error, `update(${id})`);
    }
  }

  /**
   * Delete entities matching criteria
   * @param criteria - Search criteria
   * @returns Number of deleted entities
   */
  async deleteByCriteria(criteria: Partial<T>): Promise<number> {
    try {
      return await this._repository.deleteByCriteria(criteria);
    } catch (error) {
      this.handleServiceError(error, 'deleteByCriteria');
    }
  }
}