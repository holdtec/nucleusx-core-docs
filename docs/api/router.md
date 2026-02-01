# 路由模块 API

## createRouter

创建虚拟路由引擎实例。

### 语法

```typescript
import { createRouter } from '@nucleusx/core';

const router = createRouter(config: IRouterConfig);
```

### 参数

- `config` (IRouterConfig): 路由配置对象

### 返回值

- `IRouter`: 路由实例，提供导航方法

### 示例

```typescript
const router = createRouter({
  mode: 'auto', // 'spa' | 'mpa' | 'auto'
  pagesFetcher: () => api.getPages(),
  userPermissionsProvider: () => user.permissions,
  appConfig: { startPage: 'home' },
});
```

## IRouterConfig 接口

路由配置接口。

### 属性

- `mode`: RouterMode - 路由模式 ('spa' | 'mpa' | 'auto')
- `pagesFetcher`: () => Promise<PageRoute[]> - 页面配置获取函数
- `userPermissionsProvider`: () => UserPermission[] - 用户权限提供函数
- `appConfig`: AppConfig - 应用配置
- `animation?`: AnimationConfig - 动画配置（可选）

## Router 模式

### spa 模式

纯 SPA 模式，所有跳转使用虚拟页面栈，不触发物理跳转。

- 优势：无页面栈限制，支持页面缓存，支持动画
- 适用：需要突破原生页面栈限制的场景

### mpa 模式

纯 MPA 模式，所有跳转调用平台原生导航 API。

- 优势：保持原生导航行为
- 限制：受原生页面栈限制（通常10层）

### auto 模式

自动模式（默认），根据路径亲和性自动判定 SPA/MPA。

- 优势：混合场景下最优选择
- 行为：根据路径特征自动选择合适的导航模式

## 导航方法

### router.to()

跳转到指定页面。

```typescript
router.to({
  url: 'detail',
  param: { id: 1 }
});
```

### router.redirect()

重定向到指定页面。

```typescript
router.redirect({ url: 'login' });
```

### router.back()

返回上一页。

```typescript
router.back();
```

### router.switchTab()

切换标签页。

```typescript
router.switchTab({ url: 'tab-home' });
```

## 动画配置

路由内置了强大的动画配置能力：

```typescript
animation: {
  duration: 500, // 动画时长 (ms)
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // 缓动函数
  enabled: true, // 全局开关
  type: 'perspective', // 动画类型: perspective | slide | fade | none
}
```

### 内置动画类型

- `perspective` (默认): 3D 缩放转场
- `slide`: 经典左右滑动
- `fade`: 渐隐渐现
- `none`: 无动画