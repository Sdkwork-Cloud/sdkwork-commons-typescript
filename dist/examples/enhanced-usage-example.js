"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSdkClient_1 = require("../http/BaseSdkClient");
/**
 * Enhanced example usage of the SDK with the new BaseSdkClient methods
 */
// Custom client extending BaseSdkClient
class CustomSdkClient extends BaseSdkClient_1.BaseSdkClient {
    constructor(options) {
        super(options);
    }
    /**
     * Override prepareOptions to add custom headers
     */
    async prepareOptions(options) {
        // Add a custom user agent header
        options.headers = {
            ...options.headers,
            'User-Agent': 'Enhanced-SDK/1.0'
        };
        // Add a timestamp header
        options.headers = {
            ...options.headers,
            'X-Timestamp': Date.now().toString()
        };
    }
    /**
     * Override prepareRequest for additional customization
     */
    async prepareRequest(request, { url, options }) {
        // Log requests for debugging
        console.log(`Making ${options.method.toUpperCase()} request to ${url}`);
    }
}
// Client configuration
const options = {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    timeout: 5000
};
// Create enhanced client instance
const client = new CustomSdkClient(options);
// Example GET request using the new method
async function getUsers() {
    try {
        const response = await client.get('/users');
        console.log('Users count:', response.data.length);
    }
    catch (error) {
        console.error('Error fetching users:', error);
    }
}
// Example POST request using the new method
async function createPost() {
    try {
        const newPost = {
            title: 'New Post',
            body: 'This is a new post',
            userId: 1
        };
        const requestOptions = {
            url: '/posts',
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await client.post('/posts', requestOptions);
        console.log('Created post ID:', response.data.id);
    }
    catch (error) {
        console.error('Error creating post:', error);
    }
}
// Example with APIPromise
function getUsersAsPromise() {
    return client.get('/users');
}
// Using the APIPromise
getUsersAsPromise()
    .then((response) => {
    console.log('Fetched users with APIPromise:', response.data.length);
})
    .catch((error) => {
    console.error('Error with APIPromise:', error);
});
// Run examples
getUsers();
createPost();
