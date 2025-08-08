import { SdkRequestOptions } from "../types";
import { SdkResponse } from "../types";
export declare class HttpTool {
    static request<T>(options: SdkRequestOptions): Promise<SdkResponse<T>>;
}
