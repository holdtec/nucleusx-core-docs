# 请求模块 API

## createRequest

创建请求引擎实例的核心函数。

### 语法

```typescript
import { createRequest } from '@nucleusx/core';

const request = createRequest(config: IRequestConfig);
```

### 参数

- `config` (IRequestConfig): 请求配置对象

### 返回值

- `IRequest`: 请求实例，提供各种 HTTP 方法

### 示例

```typescript
const request = createRequest({
  baseUrl: 'https://api.example.com',
  adapter: wxAdapter,
  timeout: 5000
});
```

## IRequestConfig 接口

请求配置接口。

### 属性

- `baseUrl`: string - 基础 URL
- `adapter`: RequestAdapter - 请求适配器
- `timeout?`: number - 超时时间（毫秒）
- `headers?`: Object - 默认请求头
- `isBizSuccess?`: (response) => boolean - 业务成功判断函数
- `errorMode?`: 'legacy' | 'wrapped' - 错误处理模式

## 请求方法

### GET 请求

```typescript
const data = await request.get('/api/user', { id: 1 });
```

### POST 请求

```typescript
const result = await request.post('/api/order', { sku: '123' });
```

### 其他 HTTP 方法

- `request.post(url, data, config)`
- `request.put(url, data, config)`
- `request.delete(url, config)`
- `request.patch(url, data, config)`

## 配置扩展

### mergeConfig

合并配置（推荐用于运行时动态调整）：

```typescript
request.mergeConfig({
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

### setConfig

覆盖配置（需要提供完整配置）：

```typescript
request.setConfig({
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  adapter: wxAdapter
});
```

## 中间件机制

请求引擎支持洋葱模型中间件：

```typescript
// 自定义中间件示例：Token刷新
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
  }
};

request.use(tokenMiddleware);
```

## 错误处理

### 错误模式

- `legacy` (默认): 保持向后兼容
- `wrapped`: 启用结构化错误处理

### RequestError 接口

结构化错误处理接口，支持错误分类和追踪。

## RequestAdapter 接口

请求适配器接口，用于适配不同平台的网络请求 API。

### 方法

- `request(config)`: 发起请求的方法

## 最佳实践

1. **优先使用中间件**: 通过中间件实现通用逻辑（如 Token 刷新、日志记录）
2. **合理配置超时**: 根据业务场景设置合适的超时时间
3. **自定义错误处理**: 使用 `isBizSuccess` 函数定义业务成功标准
4. **避免直接使用平台API**: 使用 NucleusX 的统一接口而非 wx.request 等原生方法