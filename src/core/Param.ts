export interface BaseParam {
    id?: string | number;
}
export interface BaseResponse {
    updatedAt?: string;
    createdAt?: string;
}
export interface BaseObject {
}
export interface QueryParam extends BaseParam {
    id?: string | number;
}
export interface QueryListParam extends QueryParam {
    createdAtTo?: string;
    createdAtFrom?: string;
}
