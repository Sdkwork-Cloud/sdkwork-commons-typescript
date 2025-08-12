export type ServerSentEvent = {
    event: string | null;
    data: string;
    raw: string[];
};
export declare function ReadableStreamToAsyncIterable<T>(stream: any): AsyncIterableIterator<T>;
export declare function _iterSSEMessages(response: Response, controller: AbortController): AsyncGenerator<ServerSentEvent, void, unknown>;
export declare class SdkStream<Item> implements AsyncIterable<Item> {
    private iterator;
    controller: AbortController;
    _client: any | undefined;
    constructor(iterator: () => AsyncIterator<Item>, controller: AbortController, client?: any);
    [Symbol.asyncIterator](): AsyncIterator<Item, any, undefined>;
    static fromSSEResponse<Item>(response: Response, controller: AbortController, client?: any): SdkStream<Item>;
    /**
     * Generates a Stream from a newline-separated ReadableStream
     * where each item is a JSON value.
     */
    static fromReadableStream<Item>(readableStream: ReadableStream, controller: AbortController, client?: any): SdkStream<Item>;
    /**
     * Executes a streaming request using fetch API and returns a SdkStream
     * @param url The URL to send the request to
     * @param options Fetch request options
     * @param client Optional client instance
     * @returns SdkStream instance with the response data
     */
    static streamRequest<Item>(url: string, options?: RequestInit, client?: any): Promise<SdkStream<Item>>;
}
