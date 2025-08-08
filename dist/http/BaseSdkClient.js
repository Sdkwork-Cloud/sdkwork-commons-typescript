"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSdkClient = void 0;
const HttpTool_1 = require("./HttpTool");
const types_1 = require("../types");
class BaseSdkClient {
    constructor(options) {
        this.options = options;
    }
    /**
     * Used as a callback for mutating the given `SdkRequestOptions` object.
     */
    async prepareOptions(requestOptions) {
        if (!requestOptions?.headers) {
            requestOptions.headers = {};
        }
        if (this.options.apiKey) {
            requestOptions.headers["Authorization"] = `Bearer ${this.options.apiKey}`;
        }
        const tokenManager = this.options.tokenManager;
        const accessToken = this.options.accessToken || tokenManager?.getAccessToken();
        if (accessToken) {
            requestOptions.headers["Access-Token"] = `${accessToken}`;
        }
        const authToken = tokenManager?.getAuthToken();
        if (authToken) {
            requestOptions.headers["Authorization"] = `Bearer ${authToken}`;
        }
    }
    /**
     * Used as a callback for mutating the given `RequestInit` object.
     *
     * This is useful for cases where you want to add certain headers based off of
     * the request properties, e.g. `method` or `url`.
     */
    async prepareRequest(requestOptions) {
        if (!requestOptions.exceptionHandler) {
            requestOptions.exceptionHandler = this.options.exceptionHandler;
        }
        if (!requestOptions.responseHandler) {
            requestOptions.responseHandler = this.options.responseHandler;
        }
    }
    get(path, opts) {
        return this.methodRequest("GET", path, opts);
    }
    post(path, opts) {
        return this.methodRequest("POST", path, opts);
    }
    patch(path, opts) {
        return this.methodRequest("PATCH", path, opts);
    }
    put(path, opts) {
        return this.methodRequest("PUT", path, opts);
    }
    delete(path, opts) {
        return this.methodRequest("DELETE", path, opts);
    }
    methodRequest(method, path, opts) {
        return this.request(Promise.resolve(opts).then((opts) => {
            this.prepareOptions(opts ?? {});
            // Create the final options object without spreading to avoid type conflicts
            const finalOptions = {
                ...opts,
                method,
                path,
                url: path,
                headers: opts?.headers,
                body: opts?.body,
                timeout: opts?.timeout,
                queryParams: opts?.queryParams,
            };
            return finalOptions;
        }));
    }
    request(options, remainingRetries = null) {
        return new types_1.APIPromise(this, this.makeRequest(options, remainingRetries));
    }
    async makeRequest(options, remainingRetries) {
        const opts = await Promise.resolve(options);
        // Call prepareOptions hook
        await this.prepareOptions(opts);
        // Build URL
        const url = this.buildUrl(opts.path);
        this.prepareRequest(opts);
        // Merge client options with request options
        const mergedOptions = {
            ...opts,
            method: opts.method,
            url: url,
            headers: {
                ...this.options.headers,
                ...opts.headers,
            },
            timeout: opts.timeout || this.options.timeout,
            body: opts.body,
            queryParams: opts.queryParams,
            responseHandler: opts.responseHandler,
            exceptionHandler: opts.exceptionHandler,
        };
        // Add API key to headers if provided
        if (this.options.apiKey) {
            mergedOptions.headers = {
                ...mergedOptions.headers,
                Authorization: `Bearer ${this.options.apiKey}`,
            };
        }
        return await HttpTool_1.HttpTool.request(mergedOptions);
    }
    async sendRequest(requestOptions) {
        // Merge client options with request options
        const mergedOptions = {
            ...requestOptions,
            url: this.buildUrl(requestOptions.url),
            headers: {
                ...this.options.headers,
                ...requestOptions.headers,
            },
            timeout: requestOptions.timeout || this.options.timeout,
        };
        // Add API key to headers if provided
        if (this.options.apiKey) {
            mergedOptions.headers = {
                ...mergedOptions.headers,
                Authorization: `Bearer ${this.options.apiKey}`,
            };
        }
        this.prepareRequest(mergedOptions);
        return await HttpTool_1.HttpTool.request(mergedOptions);
    }
    buildUrl(path) {
        // If path is already an absolute URL, return as is
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        // Ensure baseUrl doesn't end with a slash and path doesn't start with one
        const baseUrl = this.options.baseUrl.replace(/\/$/, "");
        const normalizedPath = path.startsWith("/") ? path : "/" + path;
        return baseUrl + normalizedPath;
    }
    getBasePath(requestOptions) {
        return this.options.baseUrl;
    }
}
exports.BaseSdkClient = BaseSdkClient;
