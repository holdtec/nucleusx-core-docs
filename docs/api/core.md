# 核心模块 API

## createRuntime

创建 NucleusX 运行时实例的核心函数。

### 语法

```typescript
import { createRuntime } from '@nucleusx/core';

const runtime = await createRuntime(kit: IKit);
```

### 参数

- `kit` (IKit): 平台适配套件，包含所有平台特定的实现

### 返回值

- `Promise<IRuntime>`: 包含所有核心能力的运行时实例

### 示例

```typescript
const myWxKit: IKit = {
  platformBridge: {
    // 平台桥接器实现
  },
  storeEngine: myMobxEngine,
  request: {
    baseUrl: 'https://api.example.com',
    adapter: myWxAdapter
  },
  // ... 其他配置
};

const runtime = await createRuntime(myWxKit);
```

## IKit 接口

平台适配套件接口，定义了所有必需的平台实现。

### 属性

- `platformBridge`: IPlatformBridge - 平台桥接器
- `storeEngine`: StoreEngine - 状态管理引擎
- `request`: IRequestConfig - 请求配置
- `router`: IRouterConfig - 路由配置
- `logger`: ILoggerConfig - 日志配置
- `appInfo?`: IAppInfo - 应用信息（可选）

## IRuntime 接口

运行时实例接口，提供了访问所有核心能力的方法。

### 属性

- `request`: IRequest - 统一请求接口
- `router`: IRouter - 虚拟路由引擎
- `logger`: ILogger - 日志系统
- `kit`: IKit - 原始套件配置