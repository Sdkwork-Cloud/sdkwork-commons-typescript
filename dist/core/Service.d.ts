import { EntityId } from "./Repository";
export interface IService {
}
/**
 * Generic interface for all service implementations
 * Defines the basic operations that all services should support
 */
export interface ICURDService<T, ID extends EntityId = string> extends IService {
}
/**
 * Extended service interface with additional querying capabilities
 */
export interface IExtendedCURDService<T, ID extends EntityId = string> extends ICURDService<T, ID> {
}
