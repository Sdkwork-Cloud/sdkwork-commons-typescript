import { SdkRequestOptions, SdkStream } from "../types";
import { SdkResponse } from "../types";
export declare class HttpTool {
    static request<T>(options: SdkRequestOptions, client: any): Promise<SdkResponse<T> | SdkStream<T>>;
    static noneStreamRequest<T>(options: SdkRequestOptions, client: any): Promise<SdkResponse<T>>;
    /**
     * 使用fetch实现SSE或stream请求
     */
    static streamRequest<T>(options: SdkRequestOptions, client: any): Promise<SdkResponse<T> | SdkStream<T>>;
}
