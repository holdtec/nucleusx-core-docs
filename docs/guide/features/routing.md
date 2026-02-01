# 路由管理

本章详细介绍 NucleusX 虚拟路由引擎的功能和使用方法。

## 路由引擎概述

NucleusX 虚拟路由引擎是一个**平台无关**、**配置驱动**的路由管理模块。它在 Taro/小程序之上构建了一层虚拟路由栈，接管了原生的导航行为，从而实现了更高级的路由治理能力。

### 核心特性

- **SPA 架构**: 在单页面内实现无限层级的路由跳转，突破原生 10 层栈限制
- **动态装配**: 路由表支持通过 `pagesFetcher` 异步拉取，完美支持 SaaS 场景下的千人千面配置
- **统一治理**: 提供全局守卫和 RBAC 权限控制
- **平台解耦**: 业务代码只调用 `router.to()`，底层自动适配不同平台的导航 API

### 架构原理

路由引擎采用了 **"状态机 + 驱动器 + 渲染器"** 的解耦架构：

1. **RouterStore (状态机)**：维护虚拟的 `stacks` (历史栈) 和 `renderStack` (渲染栈)，采用双缓冲机制
2. **Router (核心逻辑层)**：提供标准 API 并负责计算页面深度、判定动画方向
3. **Bridge (驱动层)**：调用注入的 `PlatformBridge` 执行物理层操作
4. **RouterView (渲染层)**：平台无关的视图容器，通过监听 `renderStack` 动态渲染组件

## 路由模式详解

NucleusX Router 支持三种运行模式，可根据项目需求灵活选择。

### 模式说明

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `spa` | 纯 SPA 模式，所有跳转使用虚拟页面栈，不触发物理跳转 | 需要突破原生页面栈限制（10层）、支持页面缓存 |
| `mpa` | 纯 MPA 模式，所有跳转调用平台原生导航 API | 传统小程序项目、需要完整原生导航行为 |
| `auto` | 自动模式（默认），根据路径亲和性自动判定 SPA/MPA | 混合场景、部分页面 SPA、部分页面 MPA |

### 配置方式

```typescript
import { createRouter } from '@nucleusx/core';

// 纯 SPA 模式
const spaRouter = createRouter({
  mode: 'spa',
  pagesFetcher: () => api.getPages(),
  userPermissionsProvider: () => user.permissions,
  appConfig: { startPage: 'home' },
});

// 纯 MPA 模式
const mpaRouter = createRouter({
  mode: 'mpa',
  pagesFetcher: () => api.getPages(),
  userPermissionsProvider: () => user.permissions,
  appConfig: { startPage: 'home' },
});

// 自动模式（默认）
const autoRouter = createRouter({
  mode: 'auto', // 可不配置，默认即为 auto
  pagesFetcher: () => api.getPages(),
  userPermissionsProvider: () => user.permissions,
  appConfig: { startPage: 'home' },
});
```

### 模式差异对比

| 特性 | SPA 模式 | MPA 模式 | Auto 模式 |
|------|----------|----------|-----------|
| 页面栈管理 | 虚拟栈，无限制 | 原生栈，10层限制 | 自动判定 |
| 页面缓存 | 支持 | 不支持 | 同 SPA |
| 物理跳转 | 不触发 | 触发 | 根据路径判定 |
| 动画效果 | 支持 | 不支持 | 同 SPA |
| 中间件支持 | ✅ 支持 | ✅ 支持 | 同 SPA |

> **注意**：MPA 模式下中间件（权限校验、日志记录等）仍会正常执行，但虚拟栈更新会被跳过。

## 路由配置详解

### 基础配置

```typescript
const routerConfig = {
  mode: 'auto' as const,
  pagesFetcher: () => fetchPagesConfig(),      // 异步获取页面配置
  userPermissionsProvider: () => getPermissions(), // 获取用户权限
  appConfig: { 
    startPage: 'home',                        // 起始页面
    defaultTransition: 'slide'                // 默认过渡效果
  },
  animation: {
    duration: 500,                            // 动画时长 (ms)
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // 缓动函数
    enabled: true,                            // 全局开关
    type: 'perspective' as const              // 动画类型
  }
};
```

### 页面配置结构

```typescript
interface PageRoute {
  path: string;                               // 页面路径
  name: string;                               // 页面名称
  component: string;                          // 组件路径
  permission?: string;                        // 权限标识
  meta?: Record<string, any>;                 // 页面元数据
  layout?: string;                            // 布局配置
}
```

### 权限配置

```typescript
// 用户权限提供函数
const userPermissionsProvider = (): UserPermission[] => {
  // 从存储或 API 获取用户权限
  return wx.getStorageSync('user_permissions') || [];
};

// 页面权限配置示例
const pagesConfig = [
  {
    path: '/home',
    name: 'home',
    component: 'pages/Home',
    permission: 'view_home'                   // 需要 view_home 权限
  },
  {
    path: '/admin',
    name: 'admin',
    component: 'pages/Admin',
    permission: 'manage_admin'                // 需要 manage_admin 权限
  }
];
```

## 路由 API 详解

### 导航 API

#### router.to()

跳转到指定页面。

```typescript
// 基础跳转
router.to({ url: 'detail', param: { id: 1 } });

// 带查询参数跳转
router.to({ 
  url: 'product', 
  param: { 
    id: '123', 
    category: 'electronics',
    ref: 'homepage'
  } 
});

// 使用完整路径
router.to({ url: '/pages/detail/index', param: { id: 1 } });
```

#### router.redirect()

重定向到指定页面（替换当前页面）。

```typescript
// 重定向到登录页
router.redirect({ url: 'login' });

// 重定向前清理数据
beforeRedirect(() => {
  // 清理临时数据
  clearTempData();
});
```

#### router.back()

返回上一页。

```typescript
// 简单返回
router.back();

// 返回指定层级
router.back({ delta: 2 });  // 返回两层

// 返回到指定页面
router.back({ url: 'home' }); // 返回到首页
```

#### router.switchTab()

切换标签页。

```typescript
// 切换到标签页
router.switchTab({ url: 'tab-home' });

// 切换时传参
router.switchTab({ 
  url: 'tab-profile', 
  param: { refresh: true } 
});
```

### 路由信息获取

#### getCurrentRoute()

获取当前路由信息。

```typescript
const currentRoute = router.getCurrentRoute();
console.log('Current page:', currentRoute.name);
console.log('Query params:', currentRoute.query);
```

#### getRouteStack()

获取路由栈信息。

```typescript
const routeStack = router.getRouteStack();
console.log('Route depth:', routeStack.length);
console.log('Previous page:', routeStack[routeStack.length - 2]);
```

## 动画系统

路由内置了强大的动画配置能力，支持在全局配置文件中动态调整。

### 动画配置

```typescript
animation: {
  duration: 500,                              // 动画时长 (ms)
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',  // 缓动函数
  enabled: true,                              // 全局开关
  type: 'perspective' as const,               // 动画类型
}
```

### 内置动画类型

- **`perspective` (默认)**: 3D 缩放转场。新页放大淡入，旧页缩小模糊退场，具有极佳的视觉空间感
- **`slide`**: 经典左右滑动。符合 iOS/Android 原生交互习惯
- **`fade`**: 渐隐渐现。适用于简单的页面切换或 Replace 模式
- **`none`**: 无动画

### 动画逻辑判定

- **Push**: 前进动画 (如 `perspective-enter`, `slide-enter`)
- **Back**: 后退动画 (如 `perspective-enter-reverse`, `slide-enter-reverse`)
- **Tab**: 直接显隐切换，不触发滑动动画
- **Replace**: 默认采用 `fade` 动画进行瞬间替换

### 自定义扩展

如果需要实现完全自定义的动画，可以通过 `enterClass` 和 `leaveClass` 直接指定 CSS 类名：

```typescript
// 自定义动画类名
const customAnimation = {
  enterClass: 'my-custom-enter',
  leaveClass: 'my-custom-leave',
  duration: 600
};
```

## 路由守卫

### 全局前置守卫

```typescript
// 添加全局前置守卫
router.beforeEach((to, from) => {
  // 权限检查
  if (to.meta?.requiresAuth && !isAuthenticated()) {
    // 重定向到登录页
    router.redirect({ url: 'login' });
    return false; // 阻止导航
  }
  
  // 记录导航日志
  logger.info('Navigation', {
    from: from.path,
    to: to.path,
    timestamp: Date.now()
  });
  
  return true; // 允许导航
});
```

### 全局后置钩子

```typescript
// 添加全局后置钩子
router.afterEach((to, from) => {
  // 页面埋点
  trackPageView(to.path);
  
  // 更新页面标题
  updatePageTitle(to.meta?.title || to.name);
  
  // 清理上一页面资源
  cleanupPreviousPage(from.path);
});
```

## 中间件机制

路由支持中间件机制，用于处理导航前后的逻辑。

```typescript
// 权限中间件
const permissionMiddleware: RouterMiddleware = async (context, next) => {
  const { to, from, nextRoute } = context;
  
  // 检查目标页面权限
  if (to.permission) {
    const hasPermission = checkUserPermission(to.permission);
    if (!hasPermission) {
      // 权限不足，跳转到无权限页面
      nextRoute({ url: 'no-permission', param: { target: to.path } });
      return;
    }
  }
  
  // 继续执行下一个中间件
  await next();
};

// 使用中间件
router.use(permissionMiddleware);
```

## 错误处理

### 防御性校验

为了减少运行期随机崩溃，Router 会在初始化和导航前自动进行依赖检查：

```typescript
// 检查运行时是否准备就绪
assertRuntimeReady(); // 检查 Request 和 Logger 是否已正确注入

// 检查 MPA 导航能力
assertMpaNavigationReady(); // 检查 PlatformBridge 是否具备必要的物理导航能力
```

### 404/错误页面处理

```typescript
// 配置错误页面
const pagesConfig = [
  // ... 正常页面
  {
    path: '/404',
    name: 'not-found',
    component: 'pages/NotFound',
    meta: { 
      hideNavbar: true,
      title: '页面不存在'
    }
  },
  {
    path: '/500',
    name: 'error',
    component: 'pages/Error',
    meta: { 
      hideNavbar: true,
      title: '系统错误'
    }
  }
];

// 全局错误处理
router.onError((error) => {
  console.error('Router error:', error);
  
  // 根据错误类型跳转到相应错误页面
  if (error.type === 'ROUTE_NOT_FOUND') {
    router.to({ url: 'not-found' });
  } else {
    router.to({ url: 'error' });
  }
});
```

## 高级功能

### 路由参数传递

```typescript
// 传递复杂参数
router.to({
  url: 'detail',
  param: {
    // 基础类型
    id: 123,
    name: 'product',
    
    // 对象参数（会被序列化）
    data: JSON.stringify({
      user: { id: 1, name: 'John' },
      settings: { theme: 'dark' }
    }),
    
    // 数组参数
    tags: ['tag1', 'tag2', 'tag3']
  }
});

// 在目标页面获取参数
const routeParams = router.getCurrentRoute().query;
const data = JSON.parse(routeParams.data || '{}');
```

### 页面生命周期管理

```typescript
// 页面进入时
router.beforeEach((to, from) => {
  // 暂停上一页面的定时器
  pausePageTimers(from.path);
  
  // 恢复当前页面的定时器
  resumePageTimers(to.path);
});

// 页面离开时
router.afterEach((to, from) => {
  // 记录页面停留时间
  recordPageDuration(from.path);
});
```

### 路由缓存机制

```typescript
// 启用页面缓存
const routerConfig = {
  // ... 其他配置
  cache: {
    enabled: true,                           // 启用缓存
    maxSize: 10,                            // 最大缓存页面数
    strategy: 'LRU' as const,               // 缓存策略：LRU, FIFO, CUSTOM
    exclude: ['login', 'register']           // 排除缓存的页面
  }
};
```

## 最佳实践

### 1. 优先使用 router.to

务必绕过原生 API，确保权限校验和日志打点生效。

```typescript
// ✅ 推荐：使用 NucleusX 路由
router.to({ url: 'detail', param: { id: 1 } });

// ❌ 避免：直接使用原生 API
wx.navigateTo({ url: '/pages/detail/index?id=1' });
```

### 2. 合理使用状态保持

充分利用 SPA 架构下的状态保持特性，减少页面重复加载。

```typescript
// 在路由配置中启用页面保持
const spaConfig = {
  mode: 'spa',
  keepAlive: {
    enabled: true,
    max: 5,                                 // 最多保持 5 个页面
    exclude: ['temp-page']                   // 排除临时页面
  }
};
```

### 3. 配置权限兜底

配置 `401` 或 `404` 页面，确保在权限不足或路由丢失时有良好的用户引导。

```typescript
// 在页面配置中添加错误页面
const pages = [
  // ... 正常页面
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: 'pages/Unauthorized',
    meta: { 
      title: '无权限访问',
      hideNavbar: true 
    }
  }
];
```

通过合理使用 NucleusX 路由引擎的各项功能，您可以构建出用户体验优秀、功能强大的多端应用。