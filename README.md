# SDKWORK TypeScript Commons

A comprehensive TypeScript library for building SDKs with common utilities and base classes.

## Overview

This library provides a foundation for building consistent and robust SDKs in TypeScript. It includes base classes, HTTP utilities, type definitions, and examples to help you quickly create your own SDKs.

## Features

- **Base SDK Classes**: Foundation classes for building consistent SDKs
- **HTTP Client**: Configurable HTTP client with retry logic and middleware support
- **Type Safety**: Comprehensive TypeScript type definitions
- **Extensible Design**: Hook system for customizing request behavior
- **Promise Wrapper**: Enhanced promise handling with additional utility methods

## Project Structure

```
src/
├── core/              # Core SDK classes
│   ├── BaseSdkApi.ts  # Base API class
│   └── index.ts       # Core module exports
├── http/              # HTTP-related functionality
│   ├── BaseSdkClient.ts  # Base SDK client with HTTP methods
│   ├── HttpTool.ts       # HTTP utility functions
│   └── index.ts          # HTTP module exports
├── types/             # Type definitions
│   └── index.ts       # All type definitions
├── examples/          # Example implementations
│   ├── ExampleApi.ts  # Example API implementation
│   ├── enhanced-usage-example.ts  # Enhanced usage examples
│   ├── usage-example.ts           # Basic usage examples
│   └── index.ts       # Examples module exports
└── index.ts           # Main entry point
```

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

This will compile the TypeScript code into JavaScript in the `dist/` directory.

## Usage

### Basic Client Setup

```typescript
import { BaseSdkClient } from 'sdkwork-typescript-commons';

const client = new BaseSdkClient({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
  timeout: 5000
});
```

### Making Requests

The client provides convenient methods for all HTTP verbs:

```typescript
// GET request
const users = await client.get('/users');

// POST request
const newUser = await client.post('/users', {
  body: JSON.stringify({ name: 'John Doe' })
});

// PUT request
const updatedUser = await client.put('/users/1', {
  body: JSON.stringify({ name: 'Jane Doe' })
});

// DELETE request
await client.delete('/users/1');
```

### Advanced Usage with Hooks

Extend the BaseSdkClient to add custom behavior:

```typescript
class CustomSdkClient extends BaseSdkClient {
  protected async prepareOptions(options) {
    // Add custom headers
    options.headers = {
      ...options.headers,
      'X-Custom-Header': 'custom-value'
    };
  }

  protected async prepareRequest(request, { url, options }) {
    // Log requests
    console.log(`Making ${options.method} request to ${url}`);
  }
}
```

## API

### BaseSdkClient

The main client class with the following methods:

- `get(path, opts?)` - Make a GET request
- `post(path, opts?)` - Make a POST request
- `put(path, opts?)` - Make a PUT request
- `patch(path, opts?)` - Make a PATCH request
- `delete(path, opts?)` - Make a DELETE request
- `request(options, remainingRetries?)` - Generic request method
- `sendRequest(requestOptions)` - Send a request with full options

### Hooks

- `prepareOptions(options)` - Called before each request to modify options
- `prepareRequest(request, { url, options })` - Called before each request to modify the RequestInit object

## Types

The library provides comprehensive type definitions:

- `SdkClientOptions` - Client configuration options
- `SdkRequestOptions` - Request configuration options
- `SdkResponse<T>` - Response structure
- `HTTPMethod` - Type for HTTP methods
- `FinalRequestOptions` - Internal request options
- `APIPromise<T>` - Enhanced promise with additional methods

## Examples

See the [examples](./src/examples/) directory for detailed usage examples:

1. [Basic Usage](./src/examples/usage-example.ts)
2. [Enhanced Usage with Hooks](./src/examples/enhanced-usage-example.ts)
3. [Custom API Implementation](./src/examples/ExampleApi.ts)

## Development

### Prerequisites

- Node.js (v12 or higher)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Building

```bash
npm run build
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT