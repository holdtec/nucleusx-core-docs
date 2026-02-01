# 快速开始

本指南将帮助您快速上手使用 NucleusX-Core。

## 安装

```bash
npm install @nucleusx/core
```

> **注意**: 安装不代表获得商业授权。商业使用前请确保已取得合法授权。

## 基础使用

### 1. 定义平台 Kit

首先，您需要根据目标平台（如微信小程序、H5 等）定义一个 `Kit`。`Kit` 包含了该平台特有的驱动实现。

```typescript
import { createRuntime, type IKit } from '@nucleusx/core';

const myWxKit: IKit = {
  // 1. 注入平台桥接器（实现 IPlatformBridge 接口）
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
    navigateTo: (url) => wx.navigateTo({ url }),
    // ... 其他平台 API
  },
  // 2. 注入 Store 引擎（实现 StoreEngine 接口，如 MobX 或 Pinia）
  storeEngine: myMobxEngine,
  // 3. 请求配置
  request: {
    baseUrl: 'https://api.example.com',
    adapter: myWxAdapter, // 平台特定的请求适配器
  },
  // 4. 路由配置
  router: {
    pagesFetcher: () => fetchPagesConfig(),
    userPermissionsProvider: () => getMyPermissions(),
    appConfig: { startPage: 'home' },
  },
  // 5. 日志配置
  logger: {
    level: 'info',
    transports: [new ConsoleTransport()],
  },
  // 6. 可选的应用信息
  appInfo: {
    appId: 'wx123456',
    name: '我的应用',
    version: '1.0.0',
  }
};
```

### 2. 安装与启动运行时

在应用入口处（如 `app.ts` 的 `onLaunch`），通过 `createRuntime` 完成注入与启动。

```typescript
async function bootstrap() {
  try {
    const runtime = await createRuntime(myWxKit);
    
    // 现在可以安全地使用运行时实例了
    const { request, router } = runtime;
    
    // 也可以通过核心注册表获取（用于业务逻辑层解耦）
    // const request = coreRegistry.getRequest();
  } catch (err) {
    console.error('Runtime start failed:', err);
  }
}

bootstrap();
```

## 核心模块简介

### 路由器 (Router)

管理业务页面/流程的跳转与返回，支持 SPA、MPA、Auto 三种运行模式。

```typescript
const { router } = runtime;

// 跳转到详情页
router.to({ url: 'detail', param: { id: 1 } });

// 返回上一页
router.back();

// 重定向
router.redirect({ url: 'login' });
```

### 请求模块 (Request)

带有统一拦截能力的请求访问接口。

```typescript
const { request } = runtime;

// GET 请求
const user = await request.get('/api/user', { id: 1 });

// POST 请求
const result = await request.post('/api/order', { sku: '123' });
```

### 状态管理 (Store)

业务状态管理抽象（具体驱动由使用方决定）。

```typescript
// 定义 Store
const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++;
    }
  }
});

// 使用 Store
const counter = useCounterStore();
counter.increment();
```

### 日志系统 (Logger)

结构化日志接口，支持多种输出策略。

```typescript
const { logger } = runtime;

// 记录信息
logger.info('User logged in', { userId: '123' });

// 记录错误
logger.error('Login failed', { error: 'Invalid credentials' });
```

## 防御性校验

为了减少运行期随机崩溃，`Router` 会在初始化和导航前自动进行依赖检查：

- **`assertRuntimeReady`**: 检查 `Request` 和 `Logger` 是否已正确注入。
- **`assertMpaNavigationReady`**: 在执行 MPA 跳转前，检查 `PlatformBridge` 是否具备必要的物理导航能力。