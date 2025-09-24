import { EntityId } from "./Repository";
export interface IManager {
}
/**
 * Generic interface for all service implementations
 * Defines the basic operations that all services should support
 */
export interface ICURDManager<T, ID extends EntityId = string> extends IManager {
}
/**
 * Extended service interface with additional querying capabilities
 */
export interface IExtendedCURDManager<T, ID extends EntityId = string> extends ICURDManager<T, ID> {
}
