import { BaseSdkClient } from '../http/BaseSdkClient';
import { SdkClientOptions, APIPromise, FinalRequestOptions, SdkRequestOptions, SdkResponse, HTTPMethod } from '../types';

/**
 * Enhanced example usage of the SDK with the new BaseSdkClient methods
 */

// Custom client extending BaseSdkClient
class CustomSdkClient extends BaseSdkClient {
  constructor(options: SdkClientOptions) {
    super(options);
  }

  /**
   * Override prepareOptions to add custom headers
   */
  protected async prepareOptions(options: FinalRequestOptions): Promise<void> {
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
  protected async prepareRequest(
    request: RequestInit,
    { url, options }: { url: string; options: FinalRequestOptions }
  ): Promise<void> {
    // Log requests for debugging
    console.log(`Making ${options.method.toUpperCase()} request to ${url}`);
  }
}

// Client configuration
const options: SdkClientOptions = {
  baseUrl: 'https://jsonplaceholder.typicode.com',
  timeout: 5000
};

// Create enhanced client instance
const client = new CustomSdkClient(options);

// Example GET request using the new method
async function getUsers(): Promise<void> {
  try {
    const response = await client.get<any[]>('/users');
    console.log('Users count:', response.data.length);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Example POST request using the new method
async function createPost(): Promise<void> {
  try {
    const newPost = {
      title: 'New Post',
      body: 'This is a new post',
      userId: 1
    };

    const requestOptions: SdkRequestOptions = {
      url: '/posts',
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await client.post<any>('/posts', requestOptions);
    console.log('Created post ID:', response.data.id);
  } catch (error) {
    console.error('Error creating post:', error);
  }
}

// Example with APIPromise
function getUsersAsPromise(): APIPromise<any[]> {
  return client.get<any[]>('/users');
}

// Using the APIPromise
getUsersAsPromise()
  .then((response: SdkResponse<any[]>) => {
    console.log('Fetched users with APIPromise:', response.data.length);
  })
  .catch((error: any) => {
    console.error('Error with APIPromise:', error);
  });

// Run examples
getUsers();
createPost();