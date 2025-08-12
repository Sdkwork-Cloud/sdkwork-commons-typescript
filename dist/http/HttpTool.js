"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpTool = void 0;
const axios_1 = __importDefault(require("axios"));
const types_1 = require("../types");
class HttpTool {
    static async request(options, client) {
        if (options.stream) {
            return HttpTool.streamRequest(options, client);
        }
        return HttpTool.noneStreamRequest(options, client);
    }
    static async noneStreamRequest(options, client) {
        // Build URL with query parameters
        let url = options.url || '';
        console.info('the request options', options);
        if (options.queryParams) {
            const queryParams = new URLSearchParams();
            Object.keys(options.queryParams).forEach((key) => {
                queryParams.append(key, String(options.queryParams[key]));
            });
            const queryString = queryParams.toString();
            if (queryString) {
                url += (url.includes("?") ? "&" : "?") + queryString;
            }
        }
        // Prepare axios request config
        const config = {
            url,
            method: options.method,
            headers: options.headers,
            timeout: options.timeout,
            data: options.body,
            withCredentials: true,
            transformRequest: [
                (data, headers) => {
                    // 如果数据是对象类型或数组类型，将其转换为JSON字符串
                    if (data && (typeof data === 'object' || Array.isArray(data))) {
                        headers && (headers['Content-Type'] = 'application/json');
                        return JSON.stringify(data);
                    }
                    return data;
                },
            ],
        };
        try {
            let exceptionHandler = options.exceptionHandler;
            let responseHandler = options.responseHandler;
            console.info('request config=====================', config);
            const response = await axios_1.default.request(config);
            console.error("response from server=", response);
            if (response.status === 401) {
                if (exceptionHandler) {
                    return exceptionHandler.onUnauthorized(response);
                }
            }
            if (response.status === 403) {
                if (exceptionHandler) {
                    return exceptionHandler.onAccessDenied(response);
                }
            }
            if (response.status >= 400) {
                if (exceptionHandler) {
                    return exceptionHandler.onException(response);
                }
            }
            if (responseHandler) {
                let result = responseHandler.handle(response);
                if (result) {
                    return result;
                }
                else {
                    return Promise.reject();
                }
            }
            // Convert axios response to our SdkResponse format
            // 确保返回的数据类型正确转换为T类型，包括数组类型
            let responseData;
            try {
                // 检查响应数据是否为对象或数组
                if (typeof response.data === 'object' || Array.isArray(response.data)) {
                    // 对象或数组类型直接转换
                    responseData = response.data;
                }
                else {
                    // 非对象类型通过JSON序列化和反序列化进行转换
                    responseData = JSON.parse(JSON.stringify(response.data));
                }
            }
            catch (e) {
                // 如果转换失败，则使用原始数据
                responseData = response.data;
            }
            const sdkResponse = {
                data: responseData,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };
            console.error('sdk response==============', sdkResponse);
            return sdkResponse;
        }
        catch (error) {
            console.error("response error from server=", error);
            // Handle axios errors
            if (axios_1.default.isAxiosError(error)) {
                let errResponse = error.response;
                let exceptionHandler = options.exceptionHandler;
                let responseHandler = options.responseHandler;
                if (errResponse && errResponse.status === 401) {
                    if (exceptionHandler) {
                        return exceptionHandler.onUnauthorized(errResponse);
                    }
                }
                if (errResponse && errResponse.status === 403) {
                    if (exceptionHandler) {
                        return exceptionHandler.onAccessDenied(errResponse);
                    }
                }
                if (errResponse && errResponse.status >= 400) {
                    if (exceptionHandler) {
                        return exceptionHandler.onException(errResponse);
                    }
                }
                if (error.response) {
                    // Server responded with error status
                    // 确保错误响应的数据类型正确转换为T类型，包括数组类型
                    let errorResponseData;
                    try {
                        // 检查错误响应数据是否为对象或数组
                        if (typeof error.response.data === 'object' || Array.isArray(error.response.data)) {
                            // 对象或数组类型直接转换
                            errorResponseData = error.response.data;
                        }
                        else {
                            // 非对象类型通过JSON序列化和反序列化进行转换
                            errorResponseData = JSON.parse(JSON.stringify(error.response.data));
                        }
                    }
                    catch (e) {
                        // 如果转换失败，则使用原始数据
                        errorResponseData = error.response.data;
                    }
                    const sdkResponse = {
                        data: errorResponseData,
                        status: error.response.status,
                        statusText: error.response.statusText,
                        headers: error.response.headers,
                    };
                    return sdkResponse;
                }
                else if (error.request) {
                    // Request was made but no response received
                    throw new Error("No response received from server");
                }
                else {
                    // Something else happened
                    throw new Error(error.message);
                }
            }
            else {
                // Non-axios error
                throw error;
            }
        }
    }
    /**
     * 使用fetch实现SSE或stream请求
     */
    static async streamRequest(options, client) {
        // 构建URL和查询参数
        let url = options.url || '';
        if (options.queryParams) {
            const queryParams = new URLSearchParams();
            Object.keys(options.queryParams).forEach((key) => {
                queryParams.append(key, String(options.queryParams[key]));
            });
            const queryString = queryParams.toString();
            if (queryString) {
                url += (url.includes("?") ? "&" : "?") + queryString;
            }
        }
        // 准备fetch请求配置
        const controller = new AbortController();
        const fetchOptions = {
            method: options.method,
            headers: options.headers,
            signal: controller.signal,
            credentials: 'include', // 相当于withCredentials: true
        };
        // 处理请求体
        if (options.body) {
            if (typeof options.body === 'object' || Array.isArray(options.body)) {
                fetchOptions.headers = {
                    ...fetchOptions.headers,
                    'Content-Type': 'application/json'
                };
                fetchOptions.body = JSON.stringify(options.body);
            }
            else {
                fetchOptions.body = options.body;
            }
        }
        try {
            console.info('stream request config=====================', { url, fetchOptions });
            const response = await fetch(url, fetchOptions);
            // 处理错误状态码
            if (!response.ok) {
                const exceptionHandler = options.exceptionHandler;
                if (response.status === 401 && exceptionHandler) {
                    return exceptionHandler.onUnauthorized(response);
                }
                if (response.status === 403 && exceptionHandler) {
                    return exceptionHandler.onAccessDenied(response);
                }
                if (response.status >= 400 && exceptionHandler) {
                    return exceptionHandler.onException(response);
                }
                // 如果没有异常处理器，则抛出错误
                const errorText = await response.text();
                throw new Error(`HTTP error ${response.status}: ${errorText}`);
            }
            // 检查响应是否为SSE格式
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/event-stream')) {
                return types_1.SdkStream.fromSSEResponse(response, controller, client);
            }
            else {
                // 处理为常规JSON流
                return types_1.SdkStream.fromReadableStream(response.body, controller, client);
            }
        }
        catch (error) {
            controller.abort();
            console.error("stream request error:", error);
            throw error;
        }
    }
}
exports.HttpTool = HttpTool;
