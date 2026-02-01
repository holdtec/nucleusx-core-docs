# 请求处理

本章详细介绍 NucleusX 请求引擎的功能和使用方法。

## 请求引擎概述

NucleusX Request Engine 是一个基于**适配器模式**和**洋葱模型中间件**构建的请求库。它不仅抹平了 `wx.request` 和 `fetch` 的差异，更内置了一套金融/SaaS 级别的网络治理策略。

### 核心特性

- **多端适配**：通过注入 `RequestAdapter`，一套代码同时支持小程序、H5、React Native
- **洋葱模型中间件**：支持灵活的请求/响应处理流程
- **高度可扩展**：通过配置和中间件机制，支持自定义业务逻辑

### 架构原理

请求引擎采用 **Core + Middleware + Adapter** 三层架构：

1. **Core**：负责组装配置、执行中间件链、处理 Promise 状态
2. **Middleware**：
   - `Chain`: Request -> [Encryption] -> [Token] -> [Logger] -> [Adapter] -> [Response]
   - 每个中间件都可以中断请求或修改配置
3. **Adapter**：最底层的 IO 执行者（如 `wx.request`）

## 请求配置

### 基础配置

```typescript
import { createRequest } from '@nucleusx/core';

const request = createRequest({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  adapter: wxAdapter,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Type': 'mini-program'
  }
});
```

### 扩展配置

```typescript
const advancedRequest = createRequest({
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  adapter: wxAdapter,
  headers: {
    'Content-Type': 'application/json',
  },
  // 自定义业务成功判断
  isBizSuccess: (response) => {
    // 默认实现：statusCode === 200 && data.code === 200
    return response.statusCode === 200 && 
           response.data && 
           response.data.code === 200;
  },
  // 错误处理模式
  errorMode: 'wrapped' as const, // 'legacy' | 'wrapped'
  // 请求拦截器
  interceptors: {
    request: (config) => {
      // 请求发送前的处理
      config.headers['X-Request-Time'] = Date.now().toString();
      return config;
    },
    response: (response) => {
      // 响应处理
      console.log('Response received:', response);
      return response;
    }
  }
});
```

## 配置扩展机制

### 合并配置

合并配置（推荐：用于运行时动态调整）：

```typescript
// 动态添加头部信息
request.mergeConfig({
  headers: {
    'X-Custom-Header': 'value',
    'Authorization': `Bearer ${getToken()}`
  }
});

// 动态修改超时时间
request.mergeConfig({
  timeout: 15000
});
```

### 覆盖配置

覆盖配置（需要提供完整配置，包含 adapter）：

```typescript
// 完全覆盖配置
request.setConfig({
  baseUrl: 'https://api.new-domain.com',
  timeout: 10000,
  adapter: newAdapter,
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

## 请求方法

### 基础请求方法

```typescript
// GET 请求
const user = await request.get('/api/user', { id: 1 });

// POST 请求
const result = await request.post('/api/order', { sku: '123' });

// PUT 请求
const updated = await request.put('/api/user/123', { name: 'New Name' });

// DELETE 请求
const deleted = await request.delete('/api/user/123');

// PATCH 请求
const patched = await request.patch('/api/user/123', { status: 'active' });
```

### 通用请求方法

```typescript
// 通用请求方法
const response = await request({
  url: '/api/data',
  method: 'POST',
  data: { key: 'value' },
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000
});
```

## 中间件机制

### 中间件概念

请求引擎支持洋葱模型中间件，中间件可以拦截请求和响应：

```typescript
// 中间件类型定义
type Middleware = (context: RequestContext, next: () => Promise<void>) => Promise<void>;

interface RequestContext {
  request: RequestConfig;
  response?: Response;
  error?: Error;
}
```

### 创建中间件

```typescript
// Token刷新中间件示例
const tokenMiddleware: Middleware = async (context, next) => {
  // 在请求前添加Token
  context.request.headers = {
    ...context.request.headers,
    'Authorization': `Bearer ${getToken()}`
  };
  
  await next();
  
  // 响应后处理
  if (context.response?.statusCode === 401) {
    // Token过期处理逻辑
    await refreshToken();
    // 可以选择重试请求
  }
};

// 使用中间件
request.use(tokenMiddleware);
```

### 常用中间件示例

#### 1. 日志中间件

```typescript
const loggerMiddleware: Middleware = async (context, next) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  console.log(`[Request ${requestId}] ${context.request.method} ${context.request.url}`);
  
  await next();
  
  const duration = Date.now() - startTime;
  console.log(`[Response ${requestId}] ${duration}ms, Status: ${context.response?.statusCode}`);
};
```

#### 2. 错误重试中间件

```typescript
const retryMiddleware: Middleware = async (context, next) => {
  const maxRetries = 3;
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      await next();
      // 如果请求成功，跳出循环
      if (context.response && context.response.statusCode < 500) {
        break;
      }
    } catch (error) {
      attempts++;
      if (attempts >= maxRetries) {
        throw error;
      }
      // 等待后重试
      await sleep(1000 * attempts);
    }
  }
};
```

#### 3. 加密中间件

```typescript
const encryptionMiddleware: Middleware = async (context, next) => {
  if (context.request.data && isEncryptionEnabled()) {
    // 对请求数据进行加密
    context.request.data = await encryptData(context.request.data);
  }
  
  await next();
  
  if (context.response && context.response.data && isEncryptionEnabled()) {
    // 对响应数据进行解密
    context.response.data = await decryptData(context.response.data);
  }
};
```

#### 4. 缓存中间件

```typescript
const cacheMiddleware: Middleware = async (context, next) => {
  const cacheKey = generateCacheKey(context.request);
  
  // 检查缓存
  const cached = getFromCache(cacheKey);
  if (cached && !isExpired(cached)) {
    context.response = cached.response;
    return; // 直接返回缓存结果
  }
  
  // 执行后续中间件
  await next();
  
  // 缓存响应
  if (context.response) {
    addToCache(cacheKey, {
      response: context.response,
      timestamp: Date.now()
    });
  }
};
```

## 错误处理

### 错误模式

NucleusX 请求引擎支持两种错误处理模式：

#### Legacy 模式（默认）

- 网络/适配器错误：reject(Error)
- 业务失败（由 `isBizSuccess` 判断）：reject(response.data)

```typescript
try {
  await request.get('/api/risky');
} catch (error) {
  // error 可能是 Error 对象或响应数据
  console.error('Request failed:', error);
}
```

#### Wrapped 模式

启用结构化错误处理：

```typescript
const request = createRequest({
  baseUrl: 'https://api.example.com',
  adapter: wxAdapter,
  errorMode: 'wrapped' as const
});

try {
  await request.get('/api/risky');
} catch (error) {
  if (error instanceof RequestError) {
    // 结构化错误处理
    console.log('Error type:', error.type); // 'NETWORK_ERROR', 'BUSINESS_ERROR', etc.
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
  }
}
```

### RequestError 接口

结构化错误处理接口：

```typescript
interface RequestError extends Error {
  type: 'NETWORK_ERROR' | 'BUSINESS_ERROR' | 'VALIDATION_ERROR' | 'TIMEOUT_ERROR';
  code?: string;
  statusCode?: number;
  response?: Response;
  request?: RequestConfig;
  originalError?: Error;
}
```

## 请求适配器

### 适配器接口

```typescript
interface RequestAdapter {
  request(config: RequestConfig): Promise<Response>;
}

interface RequestConfig {
  url: string;
  method: string;
  data?: any;
  headers: Record<string, string>;
  timeout?: number;
  [key: string]: any;
}

interface Response {
  statusCode: number;
  data: any;
  headers: Record<string, string>;
  config: RequestConfig;
}
```

### 小程序适配器

```typescript
const wxAdapter: RequestAdapter = {
  request: (config) => {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.url,
        method: config.method || 'GET',
        data: config.data,
        header: config.headers,
        timeout: config.timeout,
        success: (res) => {
          resolve({
            statusCode: res.statusCode,
            data: res.data,
            headers: res.header,
            config
          });
        },
        fail: (err) => {
          reject(new Error(`Request failed: ${err.errMsg}`));
        }
      });
    });
  }
};
```

### H5 适配器

```typescript
const fetchAdapter: RequestAdapter = {
  request: async (config) => {
    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.method !== 'GET' && config.data ? 
              JSON.stringify(config.data) : undefined,
        signal: config.timeout ? 
               AbortSignal.timeout(config.timeout) : undefined
      });
      
      const data = await response.json();
      
      return {
        statusCode: response.status,
        data,
        headers: Object.fromEntries(response.headers.entries()),
        config
      };
    } catch (error) {
      throw error;
    }
  }
};
```

## 高级功能

### 请求取消

```typescript
// 使用 AbortController 取消请求
const controller = new AbortController();

const requestWithCancel = createRequest({
  baseUrl: 'https://api.example.com',
  adapter: {
    request: (config) => {
      return new Promise((resolve, reject) => {
        // 在适配器中支持取消信号
        fetch(config.url, {
          ...config,
          signal: controller.signal
        }).then(resolve).catch(reject);
      });
    }
  }
});

// 发起请求
const promise = requestWithCancel.get('/api/long-operation');

// 在需要时取消请求
controller.abort();

try {
  await promise;
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled');
  }
}
```

### 请求缓存

```typescript
// 配置请求缓存
const cachedRequest = createRequest({
  baseUrl: 'https://api.example.com',
  adapter: wxAdapter,
  cache: {
    enabled: true,
    maxAge: 5 * 60 * 1000, // 5分钟
    keyGenerator: (config) => `${config.method}:${config.url}:${JSON.stringify(config.params)}`
  }
});

// 带缓存的请求
const data = await cachedRequest.get('/api/data'); // 第一次请求
const data2 = await cachedRequest.get('/api/data'); // 从缓存获取
```

### 并发控制

```typescript
// 并发控制器
class ConcurrencyController {
  private queue: Array<() => Promise<any>> = [];
  private activeCount = 0;
  private maxConcurrent = 5;

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          this.activeCount++;
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeCount--;
          this.processNext();
        }
      });

      if (this.activeCount < this.maxConcurrent) {
        this.processNext();
      }
    });
  }

  private processNext() {
    if (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const task = this.queue.shift();
      if (task) {
        task();
      }
    }
  }
}

const concurrencyController = new ConcurrencyController();

// 使用并发控制
const requests = urls.map(url => 
  () => concurrencyController.add(() => request.get(url))
);
```

## 最佳实践

### 1. 优先使用中间件

通过中间件实现通用逻辑（如 Token 刷新、日志记录）：

```typescript
// 创建可复用的中间件
const authMiddleware = (tokenProvider: () => string): Middleware => {
  return async (context, next) => {
    context.request.headers = {
      ...context.request.headers,
      'Authorization': `Bearer ${tokenProvider()}`
    };
    await next();
  };
};

// 使用中间件
request.use(authMiddleware(getToken));
```

### 2. 合理配置超时

根据业务场景设置合适的超时时间：

```typescript
// 不同接口使用不同超时时间
const apiRequests = {
  quick: request.extend({ timeout: 3000 }),   // 快速接口
  standard: request,                          // 标准接口
  slow: request.extend({ timeout: 30000 })   // 慢接口
};
```

### 3. 自定义错误处理

使用 `isBizSuccess` 函数定义业务成功标准：

```typescript
const request = createRequest({
  baseUrl: 'https://api.example.com',
  adapter: wxAdapter,
  isBizSuccess: (response) => {
    // 根据实际业务 API 响应格式调整
    return response.statusCode === 200 && 
           response.data && 
           response.data.code === 0; // 假设 0 表示成功
  }
});
```

### 4. 避免直接使用平台API

使用 NucleusX 的统一接口而非 `wx.request` 等原生方法：

```typescript
// ✅ 推荐：使用 NucleusX 统一接口
const data = await request.get('/api/user');

// ❌ 避免：直接使用原生方法
// wx.request({ url: '/api/user' });
```

### 5. 实现完整的错误处理策略

```typescript
// 完整的错误处理示例
const handleRequestError = async (error: any) => {
  if (error.type === 'NETWORK_ERROR') {
    showNetworkError();
  } else if (error.type === 'BUSINESS_ERROR') {
    if (error.code === 'TOKEN_EXPIRED') {
      await refreshToken();
      // 重试请求
    } else {
      showBusinessError(error.message);
    }
  } else if (error.type === 'TIMEOUT_ERROR') {
    showTimeoutError();
  }
};

// 使用错误处理
try {
  const result = await request.get('/api/data');
} catch (error) {
  await handleRequestError(error);
}
```

通过合理使用 NucleusX 请求引擎的各项功能，您可以构建出健壮、高效、易维护的网络请求系统。