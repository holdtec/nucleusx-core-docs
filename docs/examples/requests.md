# 请求处理示例

本章提供 NucleusX 请求引擎的实际应用示例。

## 基础请求示例

### 简单的 API 调用

```typescript
import { getLog } from '@nucleusx/core';

// 从运行时获取请求实例
const { request } = (globalThis as any).__NUCLEUS_RUNTIME__;
const apiLog = getLog('ApiExample');

// 用户服务类
class UserService {
  // 获取用户信息
  async getUser(userId: string) {
    apiLog.info('Fetching user data', { userId });
    
    try {
      const response = await request.get(`/api/users/${userId}`);
      
      apiLog.info('User data fetched successfully', { 
        userId, 
        hasData: !!response.data 
      });
      
      return response.data;
    } catch (error) {
      apiLog.error('Failed to fetch user data', { 
        userId, 
        error: error.message 
      });
      
      throw error;
    }
  }
  
  // 创建用户
  async createUser(userData: any) {
    apiLog.info('Creating new user', { 
      userData: { name: userData.name, email: userData.email } 
    });
    
    try {
      const response = await request.post('/api/users', userData);
      
      apiLog.info('User created successfully', { 
        userId: response.data.id 
      });
      
      return response.data;
    } catch (error) {
      apiLog.error('Failed to create user', { 
        error: error.message,
        userData 
      });
      
      throw error;
    }
  }
  
  // 更新用户
  async updateUser(userId: string, updates: any) {
    apiLog.info('Updating user', { 
      userId, 
      updates: Object.keys(updates) 
    });
    
    try {
      const response = await request.put(`/api/users/${userId}`, updates);
      
      apiLog.info('User updated successfully', { userId });
      
      return response.data;
    } catch (error) {
      apiLog.error('Failed to update user', { 
        userId, 
        error: error.message,
        updates 
      });
      
      throw error;
    }
  }
}

// 使用示例
const userService = new UserService();

// 获取用户
userService.getUser('123').then(user => {
  console.log('User:', user);
}).catch(error => {
  console.error('Error:', error);
});

// 创建用户
userService.createUser({
  name: 'John Doe',
  email: 'john@example.com'
}).then(newUser => {
  console.log('New user:', newUser);
}).catch(error => {
  console.error('Error:', error);
});
```

## 中间件使用示例

### 认证中间件

```typescript
// Token刷新中间件
const tokenMiddleware: Middleware = async (context, next) => {
  // 在请求前添加Token
  const token = getTokenFromStorage();
  
  context.request.headers = {
    ...context.request.headers,
    'Authorization': `Bearer ${token}`
  };
  
  await next();
  
  // 响应后处理
  if (context.response?.statusCode === 401) {
    // Token过期处理逻辑
    apiLog.warn('Token expired, refreshing...', { 
      url: context.request.url,
      method: context.request.method
    });
    
    try {
      await refreshToken();
      
      // 重新发起原始请求
      const retryResponse = await request(context.request);
      context.response = retryResponse;
    } catch (refreshError) {
      apiLog.error('Token refresh failed', { error: refreshError.message });
      throw refreshError;
    }
  }
};

// 使用中间件
request.use(tokenMiddleware);
```

### 日志中间件

```typescript
// 详细的请求日志中间件
const detailedLoggingMiddleware: Middleware = async (context, next) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  apiLog.info('Request initiated', {
    requestId,
    method: context.request.method,
    url: context.request.url,
    params: context.request.params,
    timestamp: startTime
  });
  
  await next();
  
  const duration = Date.now() - startTime;
  
  if (context.response) {
    api FIXME: 修复这里的错误
    apiLog.info('Request completed', {
      requestId,
      statusCode: context.response.statusCode,
      duration,
      timestamp: Date.now()
    });
  } else if (context.error) {
    apiLog.error('Request failed', {
      requestId,
      error: context.error.message,
      duration,
      timestamp: Date.now()
    });
  }
};

// 使用日志中间件
request.use(detailedLoggingMiddleware);
```

## 高级请求示例

### 文件上传

```typescript
// 文件上传服务
class FileUploadService {
  async uploadFile(file: File, options: {
    onProgress?: (progress: number) => void;
    onUpload?: (result: any) => void;
  } = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await request({
        url: '/api/upload',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          options.onProgress?.(progress);
        }
      });
      
      options.onUpload?.(response.data);
      return response.data;
    } catch (error) {
      apiLog.error('File upload failed', {
        fileName: file.name,
        fileSize: file.size,
        error: error.message
      });
      throw error;
    }
  }
}
```

### 批量请求

```typescript
// 批量请求处理器
class BatchRequestHandler {
  async batchRequest(requests: Array<{
    url: string;
    method: string;
    data?: any;
  }>, options: {
    concurrency?: number;  // 并发数
    timeout?: number;      // 超时时间
  } = {}) {
    const { concurrency = 5, timeout = 10000 } = options;
    
    apiLog.info('Starting batch request', {
      requestCount: requests.length,
      concurrency,
      timeout
    });
    
    // 分批处理请求
    const chunks = this.chunkArray(requests, concurrency);
    const results = [];
    
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(req => 
        this.makeRequestWithTimeout(req, timeout)
      );
      
      try {
        const chunkResults = await Promise.allSettled(chunkPromises);
        results.push(...chunkResults);
        
        apiLog.debug('Batch chunk completed', {
          chunkSize: chunk.length,
          results: chunkResults.map(r => r.status).join(', ')
        });
      } catch (error) {
        apiLog.error('Batch chunk failed', { error: error.message });
      }
    }
    
    return results;
  }
  
  private async makeRequestWithTimeout(req: any, timeout: number) {
    // 实现带超时的请求
    return Promise.race([
      request({ ...req, timeout }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }
  
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// 使用批量请求
const batchHandler = new BatchRequestHandler();

const requests = [
  { url: '/api/users/1', method: 'GET' },
  { url: '/api/users/2', method: 'GET' },
  { url: '/api/users/3', method: 'GET' },
  { url: '/api/settings', method: 'GET' }
];

batchHandler.batchRequest(requests, { concurrency: 2 }).then(results => {
  console.log('Batch results:', results);
});
```

## 错误处理示例

### 统一错误处理

```typescript
// 错误处理服务
class ErrorHandler {
  static async handleRequestWithErrorHandling<T>(
    requestFn: () => Promise<T>,
    options: {
      retries?: number;
      onError?: (error: Error) => void;
      onSuccess?: (data: T) => void;
    } = {}
  ): Promise<T> {
    const { retries = 3, onError, onSuccess } = options;
    let lastError: Error;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await requestFn();
        
        onSuccess?.(result);
        return result;
      } catch (error) {
        lastError = error;
        
        apiLog.warn('Request attempt failed', {
          attempt,
          maxRetries: retries,
          error: error.message
        });
        
        onError?.(error);
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000; // 指数退避
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // 所有重试都失败
    apiLog.error('All request attempts failed', {
      retries,
      finalError: lastError?.message
    });
    
    throw lastError!;
  }
}

// 使用统一错误处理
const safeUserFetch = () => 
  request.get('/api/users/123');

ErrorHandler.handleRequestWithErrorHandling(safeUserFetch, {
  retries: 3,
  onError: (error) => {
    console.error('User fetch error:', error.message);
  },
  onSuccess: (userData) => {
    console.log('User fetched successfully:', userData);
  }
}).then(userData => {
  // 处理成功的数据
  console.log('Final user data:', userData);
}).catch(error => {
  // 所有重试都失败的情况
  console.error('Final error after retries:', error);
});
```

## 配置管理示例

### 动态配置更新

```typescript
// API 配置管理器
class ApiConfigManager {
  private static instance: ApiConfigManager;
  private config: {
    baseUrl: string;
    timeout: number;
    headers: Record<string, string>;
  };
  
  private constructor() {
    this.config = {
      baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
      timeout: parseInt(process.env.API_TIMEOUT || '10000'),
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': process.env.CLIENT_VERSION || '1.0.0'
      }
    };
  }
  
  static getInstance(): ApiConfigManager {
    if (!ApiConfigManager.instance) {
      ApiConfigManager.instance = new ApiConfigManager();
    }
    return ApiConfigManager.instance;
  }
  
  // 动态更新配置
  updateConfig(updates: Partial<typeof this.config>) {
    this.config = { ...this.config, ...updates };
    
    // 同时更新请求实例的配置
    request.mergeConfig({
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: this.config.headers
    });
    
    apiLog.info('API configuration updated', { updates });
  }
  
  // 获取当前配置
  getConfig() {
    return { ...this.config };
  }
  
  // 环境切换
  switchEnvironment(env: 'development' | 'staging' | 'production') {
    const envConfigs = {
      development: {
        baseUrl: 'https://dev-api.example.com',
        timeout: 15000
      },
      staging: {
        baseUrl: 'https://staging-api.example.com',
        timeout: 10000
      },
      production: {
        baseUrl: 'https://api.example.com',
        timeout: 8000
      }
    };
    
    this.updateConfig(envConfigs[env]);
    apiLog.info('Environment switched', { environment: env });
  }
}

// 使用配置管理器
const configManager = ApiConfigManager.getInstance();

// 根据环境切换配置
configManager.switchEnvironment('development');

// 动态更新头部信息
configManager.updateConfig({
  headers: {
    ...configManager.getConfig().headers,
    'X-User-Token': getUserToken()
  }
});
```

这些请求处理示例展示了如何在实际项目中使用 NucleusX 请求引擎的各种功能，包括基础请求、中间件、错误处理和配置管理等。