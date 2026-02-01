# 配置指南

本指南将详细介绍如何配置 NucleusX-Core 的各个模块。

## Kit 配置

Kit 是 NucleusX-Core 的核心配置对象，它集成了所有平台特定的实现。

### 基础 Kit 配置

```typescript
import { createRuntime, type IKit } from '@nucleusx/core';

const myKit: IKit = {
  platformBridge: {
    // 平台桥接器配置
  },
  storeEngine: myStoreEngine,
  request: {
    // 请求配置
  },
  router: {
    // 路由配置
  },
  logger: {
    // 日志配置
  },
  appInfo: {
    // 应用信息
  }
};
```

## 平台桥接器 (PlatformBridge)

平台桥接器是连接 NucleusX-Core 与具体平台的桥梁。

### 核心接口

```typescript
interface IPlatformBridge {
  // 消息提示
  showToast: (options: ToastOptions) => void;
  showLoading: (options: LoadingOptions) => void;
  hideLoading: () => void;
  showModal: (options: ModalOptions) => void;
  
  // 存储
  getStorageSync: (key: string) => any;
  setStorageSync: (key: string, data: any) => void;
  removeStorageSync: (key: string) => void;
  clearStorageSync: () => void;
  
  // 系统信息
  getSystemInfo: () => SystemInfo;
  
  // 导航
  navigateTo: (options: NavigateOptions) => void;
  redirectTo: (options: NavigateOptions) => void;
  navigateBack: (options?: BackOptions) => void;
  
  // 其他平台 API...
}
```

### 小程序平台桥接器示例

```typescript
const miniProgramBridge: IPlatformBridge = {
  showToast: (options) => wx.showToast(options),
  showLoading: (options) => wx.showLoading(options),
  hideLoading: () => wx.hideLoading(),
  showModal: (options) => wx.showModal(options),
  getStorageSync: (key) => wx.getStorageSync(key),
  setStorageSync: (key, data) => wx.setStorageSync(key, data),
  removeStorageSync: (key) => wx.removeStorageSync(key),
  clearStorageSync: () => wx.clearStorageSync(),
  getSystemInfo: () => wx.getSystemInfoSync(),
  navigateTo: (options) => wx.navigateTo(options),
  redirectTo: (options) => wx.redirectTo(options),
  navigateBack: (options) => wx.navigateBack(options),
};
```

## 请求模块配置

请求模块提供了统一的网络请求接口。

### 基础配置

```typescript
const requestConfig = {
  baseUrl: 'https://api.example.com',
  adapter: myAdapter,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  errorMode: 'wrapped' as const, // 'legacy' | 'wrapped'
  isBizSuccess: (response) => {
    // 自定义业务成功判断逻辑
    return response.statusCode === 200 && 
           response.data && 
           response.data.code === 200;
  }
};
```

### 请求适配器配置

```typescript
const myAdapter: RequestAdapter = {
  request: (config) => {
    // 实现平台特定的请求逻辑
    return platformSpecificRequest(config);
  }
};
```

### 中间件配置

```typescript
const request = createRequest(requestConfig);

// 添加自定义中间件
request.use(async (context, next) => {
  // 请求前处理
  context.request.headers = {
    ...context.request.headers,
    'X-Request-ID': generateRequestId()
  };
  
  await next();
  
  // 响应后处理
  if (context.response?.statusCode === 401) {
    // 处理认证失败
    await handleTokenRefresh();
  }
});
```

## 路由模块配置

路由模块支持三种运行模式。

### 模式配置

```typescript
const routerConfig = {
  mode: 'auto' as const, // 'spa' | 'mpa' | 'auto'
  pagesFetcher: () => fetchPagesConfig(),
  userPermissionsProvider: () => getMyPermissions(),
  appConfig: { 
    startPage: 'home',
    defaultTransition: 'slide'
  },
  animation: {
    duration: 500,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    enabled: true,
    type: 'perspective' as const // 'perspective' | 'slide' | 'fade' | 'none'
  }
};
```

### SPA 模式

纯 SPA 模式，所有跳转使用虚拟页面栈：

```typescript
const spaConfig = {
  ...routerConfig,
  mode: 'spa' as const
};
```

### MPA 模式

纯 MPA 模式，所有跳转调用平台原生导航 API：

```typescript
const mpaConfig = {
  ...routerConfig,
  mode: 'mpa' as const
};
```

### Auto 模式（默认）

自动模式，根据路径亲和性自动判定 SPA/MPA：

```typescript
const autoConfig = {
  ...routerConfig,
  mode: 'auto' as const // 默认值
};
```

## 日志模块配置

日志模块支持多通道输出。

### 基础配置

```typescript
const loggerConfig = {
  level: 'info' as const, // 'trace' | 'debug' | 'info' | 'warn' | 'error'
  transports: [
    new ConsoleTransport(),
    new StorageTransport({ maxEntries: 1000 })
  ],
  defaultContext: 'App'
};
```

### 输出通道配置

```typescript
// 控制台输出（开发环境）
const consoleTransport = new ConsoleTransport({
  format: (entry) => `[${entry.level}] ${entry.context}: ${entry.message}`
});

// 本地存储（生产环境）
const storageTransport = new StorageTransport({
  maxEntries: 1000,
  storageKey: 'app_logs'
});

// HTTP 传输（上报服务）
const httpTransport = new HttpTransport({
  endpoint: 'https://logs.example.com/api/logs',
  batchSize: 10
});
```

## 状态管理配置

状态管理模块需要配置底层引擎。

### 引擎配置

```typescript
const storeConfig = {
  // 使用预配置的引擎
  engine: myStoreEngine
};
```

### 自定义引擎实现

```typescript
class MyStoreEngine implements StoreEngine {
  define(id: string, options: StoreOptions) {
    // 实现引擎逻辑
    return createPlatformSpecificStore(id, options);
  }
}
```

## 完整配置示例

```typescript
import { createRuntime, type IKit } from '@nucleusx/core';
import { ConsoleTransport, StorageTransport } from './transports';
import { myWxAdapter } from './adapters';
import { mobxEngine } from './engines';

const completeKit: IKit = {
  platformBridge: {
    showToast: (options) => wx.showToast(options),
    showLoading: (options) => wx.showLoading(options),
    hideLoading: () => wx.hideLoading(),
    showModal: (options) => wx.showModal(options),
    getStorageSync: (key) => wx.getStorageSync(key),
    setStorageSync: (key, data) => wx.setStorageSync(key, data),
    removeStorageSync: (key) => wx.removeStorageSync(key),
    clearStorageSync: () => wx.clearStorageSync(),
    getSystemInfo: () => wx.getSystemInfoSync(),
    navigateTo: (options) => wx.navigateTo(options),
    redirectTo: (options) => wx.redirectTo(options),
    navigateBack: (options) => wx.navigateBack(options),
  },
  storeEngine: mobxEngine,
  request: {
    baseUrl: 'https://api.example.com',
    adapter: myWxAdapter,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'X-App-Version': '1.0.0'
    },
    isBizSuccess: (response) => {
      return response.statusCode === 200 && 
             response.data?.code === 0;
    },
    errorMode: 'wrapped' as const
  },
  router: {
    mode: 'auto' as const,
    pagesFetcher: () => fetchPagesConfig(),
    userPermissionsProvider: () => getUserPermissions(),
    appConfig: { 
      startPage: 'home',
      defaultTransition: 'slide'
    },
    animation: {
      duration: 300,
      easing: 'ease-in-out',
      enabled: true,
      type: 'slide' as const
    }
  },
  logger: {
    level: 'info' as const,
    transports: [
      new ConsoleTransport(),
      new StorageTransport({ maxEntries: 2000 })
    ],
    defaultContext: 'MyApp'
  },
  appInfo: {
    appId: 'wx123456',
    name: 'My Application',
    version: '1.0.0',
  }
};

// 使用完整配置初始化运行时
const runtime = await createRuntime(completeKit);
```

## 环境特定配置

您可以根据环境变量创建不同的配置：

```typescript
const getConfigByEnvironment = (): IKit => {
  const commonConfig = {
    // 通用配置
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        ...commonConfig,
        logger: {
          level: 'debug' as const,
          transports: [new ConsoleTransport()]
        },
        request: {
          ...commonConfig.request,
          baseUrl: 'https://dev-api.example.com'
        }
      };
    
    case 'production':
      return {
        ...commonConfig,
        logger: {
          level: 'warn' as const,
          transports: [
            new StorageTransport({ maxEntries: 1000 }),
            new HttpTransport({ endpoint: 'https://logs.example.com/api' })
          ]
        },
        request: {
          ...commonConfig.request,
          baseUrl: 'https://api.example.com'
        }
      };
    
    default:
      return commonConfig;
  }
};
```

## 配置验证

在生产环境中，建议添加配置验证：

```typescript
const validateKit = (kit: IKit): boolean => {
  // 验证必需字段
  if (!kit.platformBridge || !kit.storeEngine) {
    console.error('Kit configuration is incomplete');
    return false;
  }

  // 验证请求配置
  if (!kit.request?.adapter || !kit.request?.baseUrl) {
    console.error('Request configuration is incomplete');
    return false;
  }

  // 验证路由配置
  if (!kit.router?.pagesFetcher || !kit.router?.userPermissionsProvider) {
    console.error('Router configuration is incomplete');
    return false;
  }

  return true;
};

// 在初始化前验证配置
const kit = getConfigByEnvironment();
if (validateKit(kit)) {
  const runtime = await createRuntime(kit);
} else {
  throw new Error('Invalid Kit configuration');
}
```