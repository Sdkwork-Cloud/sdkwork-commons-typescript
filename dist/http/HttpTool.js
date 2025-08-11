"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpTool = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpTool {
    static async request(options) {
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
}
exports.HttpTool = HttpTool;
