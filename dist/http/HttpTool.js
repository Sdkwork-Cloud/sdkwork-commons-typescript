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
                    return data;
                },
            ],
        };
        try {
            let exceptionHandler = options.exceptionHandler;
            let responseHandler = options.responseHandler;
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
            const sdkResponse = {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };
            return sdkResponse;
        }
        catch (error) {
            // Handle axios errors
            if (axios_1.default.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with error status
                    const sdkResponse = {
                        data: error.response.data,
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
