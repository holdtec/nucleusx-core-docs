# 架构详解

本章深入探讨 NucleusX-Core 的架构设计和实现原理。

## 整体架构

NucleusX-Core 采用分层架构设计，各层职责明确，松耦合高内聚。

```
┌─────────────────┐
│   Business      │  ← 业务逻辑层
│   Logic         │
├─────────────────┤
│   Core API      │  ← 统一核心接口
├─────────────────┤
│   Abstraction   │  ← 抽象层（Kit模式）
│   Layer         │
├─────────────────┤
│   Platform      │  ← 平台适配层
│   Adapters      │
├─────────────────┤
│   Native APIs   │  ← 原生平台API
└─────────────────┘
```

## 核心模块架构

### 1. 运行时管理模块

运行时管理模块是整个框架的入口和核心协调者。

#### 架构组成

- **Runtime Context**: 统一的运行时上下文
- **Dependency Injector**: 依赖注入管理器
- **Lifecycle Manager**: 生命周期管理器
- **Configuration Loader**: 配置加载器

#### 实现原理

```typescript
class RuntimeManager {
  private registry: CoreRegistry;
  private kit: IKit;
  
  async initialize(kit: IKit): Promise<IRuntime> {
    this.kit = kit;
    
    // 1. 注册平台桥接器
    this.registry.setPlatformBridge(kit.platformBridge);
    
    // 2. 注册状态管理引擎
    this.registry.setStoreEngine(kit.storeEngine);
    
    // 3. 初始化请求模块
    const request = createRequest(kit.request);
    this.registry.setRequest(request);
    
    // 4. 初始化路由模块
    const router = createRouter(kit.router);
    await router.init(); // 初始化路由
    this.registry.setRouter(router);
    
    // 5. 初始化日志模块
    const logger = createLogger(kit.logger);
    this.registry.setLogger(logger);
    
    // 6. 返回运行时实例
    return {
      request,
      router,
      logger,
      kit
    };
  }
}
```

### 2. 虚拟路由引擎架构

虚拟路由引擎是 NucleusX 的核心技术之一，实现了 SPA 和 MPA 的无缝融合。

#### 双栈架构

```typescript
interface IRouterStore {
  stacks: Route[];        // 虚拟历史栈
  renderStack: Route[];   // 渲染栈（双缓冲）
}
```

- **Virtual Stack**: 维护逻辑上的页面历史
- **Render Stack**: 控制实际渲染的页面

#### 三种运行模式

| 模式 | 特点 | 适用场景 |
|------|------|----------|
| SPA | 纯虚拟栈，无限制 | 需要突破原生栈限制 |
| MPA | 纯物理跳转 | 保持原生导航行为 |
| Auto | 自动判定 | 混合场景 |

#### 模式切换逻辑

```typescript
class ModeResolver {
  resolve(targetRoute: Route, currentMode: RouterMode): NavigationMode {
    if (currentMode !== 'auto') {
      return currentMode; // 固定模式
    }
    
    // 自动判定逻辑
    if (this.isSPAFriendly(targetRoute)) {
      return 'spa';
    } else {
      return 'mpa';
    }
  }
}
```

### 3. 请求引擎架构

请求引擎采用洋葱模型中间件架构，支持灵活的请求/响应处理流程。

#### 中间件链

```
Request → [Auth Middleware] → [Logging Middleware] → [Adapter] → Response
   ↓                           ↓                        ↓              ↓
[Pre-processing]         [Pre-processing]        [Execution]  [Post-processing]
```

#### 执行流程

```typescript
class RequestEngine {
  private middlewareChain: Middleware[] = [];
  
  async execute(context: RequestContext): Promise<ResponseContext> {
    let index = 0;
    
    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;
      
      let fn = this.middlewareChain[i];
      if (i === this.middlewareChain.length) {
        fn = this.executeAdapter; // 最终执行适配器
      }
      
      if (!fn) return;
      
      await fn(context, () => dispatch(i + 1));
    };
    
    await dispatch(0);
    return context.response;
  }
}
```

### 4. 状态管理适配层

状态管理适配层实现了不同状态管理库的统一接口。

#### 适配器模式

```typescript
interface StoreEngine {
  define<T>(id: string, options: StoreOptions<T>): StoreInstance<T>;
}

class PiniaEngine implements StoreEngine {
  define<T>(id: string, options: StoreOptions<T>): StoreInstance<T> {
    return definePiniaStore(id, options);
  }
}

class MobXEngine implements StoreEngine {
  define<T>(id: string, options: StoreOptions<T>): StoreInstance<T> {
    return defineMobXStore(id, options);
  }
}
```

## 依赖注入系统

NucleusX-Core 的依赖注入系统确保了各模块之间的松耦合。

### 核心注册表

```typescript
class CoreRegistry {
  private static instance: CoreRegistry;
  private dependencies: Map<string, any> = new Map();
  
  static getInstance(): CoreRegistry {
    if (!CoreRegistry.instance) {
      CoreRegistry.instance = new CoreRegistry();
    }
    return CoreRegistry.instance;
  }
  
  set<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance);
  }
  
  get<T>(key: string): T | undefined {
    return this.dependencies.get(key) as T;
  }
  
  // 便捷方法
  setPlatformBridge(bridge: IPlatformBridge): void {
    this.set('platformBridge', bridge);
  }
  
  getPlatformBridge(): IPlatformBridge | undefined {
    return this.get('platformBridge');
  }
  
  // ... 其他便捷方法
}
```

## 平台适配机制

NucleusX-Core 通过平台适配机制实现跨平台支持。

### 适配器接口

```typescript
interface IPlatformBridge {
  // 消息提示
  showToast(options: ToastOptions): void;
  showLoading(options: LoadingOptions): void;
  hideLoading(): void;
  showModal(options: ModalOptions): void;
  
  // 存储
  getStorageSync(key: string): any;
  setStorageSync(key: string, data: any): void;
  removeStorageSync(key: string): void;
  clearStorageSync(): void;
  
  // 系统信息
  getSystemInfo(): SystemInfo;
  
  // 导航
  navigateTo(options: NavigateOptions): void;
  redirectTo(options: NavigateOptions): void;
  navigateBack(options?: BackOptions): void;
}
```

### 适配器实现

不同平台提供相应的适配器实现：

- **WeChat Mini Program**: `WxPlatformBridge`
- **Alipay Mini Program**: `AlipayPlatformBridge`
- **H5**: `H5PlatformBridge`
- **React Native**: `RNPlatformBridge`

## 安全与防护机制

NucleusX-Core 内置了多层安全防护机制。

### Fail-Fast 防护

```typescript
class Guard {
  static assertRuntimeReady(): void {
    const request = coreRegistry.getRequest();
    const logger = coreRegistry.getLogger();
    
    if (!request) {
      throw new Error('Request not injected. Please call createRuntime() first.');
    }
    
    if (!logger) {
      throw new Error('Logger not injected. Please call createRuntime() first.');
    }
  }
  
  static assertMpaNavigationReady(): void {
    const bridge = coreRegistry.getPlatformBridge();
    
    if (!bridge?.navigateTo) {
      throw new Error('PlatformBridge does not support navigateTo. MPA navigation unavailable.');
    }
  }
}
```

### 类型安全

通过 TypeScript 的强类型系统确保类型安全：

```typescript
interface IRuntime {
  request: IRequest;
  router: IRouter;
  logger: ILogger;
  kit: IKit;
}

// 严格类型约束
function useRuntime(): IRuntime {
  const runtime = coreRegistry.getRuntime();
  if (!runtime) {
    throw new Error('Runtime not initialized');
  }
  return runtime;
}
```

## 性能优化策略

### 路由性能优化

- **路径解析缓存**: 缓存路径解析结果，避免重复计算
- **页面预加载**: 根据用户行为预测可能的导航路径
- **虚拟DOM优化**: 减少不必要的重新渲染

### 请求性能优化

- **请求缓存**: 支持响应缓存，减少重复请求
- **并发控制**: 限制并发请求数量，避免服务器压力
- **连接复用**: 复用底层网络连接，提高效率

### 状态管理优化

- **按需加载**: 支持 Store 的懒加载
- **批量更新**: 批量处理状态变更，减少渲染次数
- **内存管理**: 及时清理未使用的 Store 实例

## 扩展性设计

NucleusX-Core 通过多个扩展点支持功能扩展。

### 钩子系统

```typescript
interface IRouterHooks {
  beforeEach?: (to: Route, from: Route) => boolean | void;
  afterEach?: (to: Route, from: Route) => void;
  onError?: (error: Error) => void;
}
```

### 插件机制

支持插件机制，允许第三方扩展框架功能：

```typescript
interface IPlugin {
  install(runtime: IRuntime): void;
  uninstall?(runtime: IRuntime): void;
}
```

这种架构设计确保了 NucleusX-Core 既能满足当前需求，又具备良好的扩展性和维护性。