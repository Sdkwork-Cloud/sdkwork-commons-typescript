import { BaseSdkClient } from '../http/BaseSdkClient';
import { SdkClientOptions } from '../types';
import { ExampleApi } from './ExampleApi';

/**
 * Example usage of the enhanced SDK with axios
 */

// Client configuration
const options: SdkClientOptions = {
  baseUrl: 'https://jsonplaceholder.typicode.com',
  timeout: 5000
};

// Create client instance
const client = new BaseSdkClient(options);

// Create API instance
const api = new ExampleApi(client);

// Example GET request
async function getUsers() {
  try {
    const response = await api.get<any[]>('/users');
    console.log('Status:', response.status);
    console.log('Users count:', response.data.length);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Example GET request with query parameters
async function getPosts() {
  try {
    const response = await api.get<any[]>('/posts', { userId: 1 });
    console.log('Status:', response.status);
    console.log('Posts count:', response.data.length);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// Example POST request
async function createPost() {
  try {
    const newPost = {
      title: 'New Post',
      body: 'This is a new post',
      userId: 1
    };

    const response = await api.post<any>('/posts', newPost);
    console.log('Status:', response.status);
    console.log('Created post ID:', response.data.id);
  } catch (error) {
    console.error('Error creating post:', error);
  }
}

// Run examples
getUsers();
getPosts();
createPost();