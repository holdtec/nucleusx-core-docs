# 路由示例

本章提供 NucleusX 虚拟路由引擎的实际应用示例。

## 基础路由示例

### 简单页面导航

```typescript
import { getLog } from '@nucleusx/core';

// 从运行时获取路由实例
const { router } = (globalThis as any).__NUCLEUS_RUNTIME__;
const routerLog = getLog('RoutingExample');

// 基础页面跳转
const navigateToPage = (pageName: string, params?: any) => {
  routerLog.info('Initiating navigation', { 
    target: pageName, 
    params 
  });
  
  router.to({
    url: pageName,
    param: params || {}
  }).then(() => {
    routerLog.info('Navigation successful', { target: pageName });
  }).catch(error => {
    routerLog.error('Navigation failed', { 
      target: pageName, 
      error: error.message 
    });
  });
};

// 使用示例
navigateToPage('product-detail', { 
  productId: '123', 
  category: 'electronics' 
});

navigateToPage('user-profile', { userId: '456' });
```

### 路由守卫示例

```typescript
// 全局前置守卫 - 权限检查
router.beforeEach((to, from) => {
  const routerLog = getLog('RouteGuard');
  routerLog.info('Route guard triggered', {
    from: from.path,
    to: to.path,
    timestamp: new Date().toISOString()
  });
  
  // 检查目标页面是否需要认证
  if (to.meta?.requiresAuth) {
    const isLoggedIn = checkUserAuthentication();
    
    if (!isLoggedIn) {
      routerLog.warn('Access denied - user not authenticated', {
        attemptedRoute: to.path
      });
      
      // 重定向到登录页
      router.redirect({ 
        url: 'login', 
        param: { redirect: to.path } 
      });
      
      return false; // 阻止原导航
    }
  }
  
  // 检查用户权限
  if (to.meta?.permission) {
    const hasPermission = checkUserPermission(to.meta.permission);
    
    if (!hasPermission) {
      routerLog.warn('Access denied - insufficient permissions', {
        userPermissions: getUserPermissions(),
        requiredPermission: to.meta.permission,
        attemptedRoute: to.path
      });
      
      // 重定向到无权限页面
      router.redirect({ url: 'unauthorized' });
      return false;
    }
  }
  
  routerLog.info('Route guard passed', { target: to.path });
  return true; // 允许导航
});

// 全局后置钩子 - 页面埋点
router.afterEach((to, from) => {
  const routerLog = getLog('RouteAnalytics');
  
  routerLog.info('Page view recorded', {
    from: from.path || 'unknown',
    to: to.path,
    timestamp: new Date().toISOString(),
    duration: calculateDuration(from.timestamp, Date.now())
  });
  
  // 发送页面浏览统计
  trackPageView({
    page: to.path,
    referrer: from.path,
    timestamp: new Date().toISOString()
  });
});
```

## 高级路由模式示例

### SPA 模式应用

```typescript
// SPA 模式配置
const spaRouter = createRouter({
  mode: 'spa', // 纯 SPA 模式
  pagesFetcher: () => fetchSpaPagesConfig(),
  userPermissionsProvider: () => getUserPermissions(),
  appConfig: { 
    startPage: 'dashboard',
    defaultTransition: 'slide'
  },
  animation: {
    duration: 300,
    easing: 'ease-in-out',
    enabled: true,
    type: 'slide' as const
  }
});

// SPA 特有功能示例
class SpaNavigationHelper {
  private router = spaRouter;
  private log = getLog('SpaNavigation');
  
  // 页面缓存管理
  async preloadPage(pageName: string) {
    this.log.info('Preloading page', { page: pageName });
    
    try {
      // 预加载页面数据
      const pageData = await this.fetchPageData(pageName);
      
      // 将数据缓存到 SPA 虚拟栈中
      this.router.preloadRouteData(pageName, pageData);
      
      this.log.info('Page preloaded successfully', { page: pageName });
    } catch (error) {
      this.log.error('Page preload failed', { 
        page: pageName, 
        error: error.message 
      });
    }
  }
  
  // 页面返回栈操作
  async navigateBack(steps: number = 1) {
    this.log.info('Executing back navigation', { steps });
    
    // 检查是否有足够的页面可以返回
    const currentStackDepth = this.router.getRouteStack().length;
    
    if (steps >= currentStackDepth) {
      this.log.warn('Insufficient route stack depth', {
        requestedSteps: steps,
        availableSteps: currentStackDepth - 1 // 减1因为不能返回到初始页
      });
      
      // 返回到首页
      return this.router.to({ url: 'home' });
    }
    
    return this.router.back({ delta: steps });
  }
  
  private async fetchPageData(pageName: string) {
    // 模拟页面数据获取
    return fetch(`/api/pages/${pageName}/data`).then(r => r.json());
  }
}

// 使用 SPA 导航助手
const spaHelper = new SpaNavigationHelper();

// 预加载常用页面
spaHelper.preloadPage('dashboard');
spaHelper.preloadPage('profile');
spaHelper.preloadPage('settings');
```

### MPA 模式应用

```typescript
// MPA 模式配置
const mpaRouter = createRouter({
  mode: 'mpa', // 纯 MPA 模式
  pagesFetcher: () => fetchMpaPagesConfig(),
  userPermissionsProvider: () => getUserPermissions(),
  appConfig: { 
    startPage: 'home' 
  }
});

// MPA 特有功能示例
class MpaNavigationHelper {
  private router = mpaRouter;
  private log = getLog('MpaNavigation');
  
  // 页面跳转前检查
  async safeNavigateTo(pageName: string, params?: any) {
    this.log.info('Initiating safe navigation', { 
      target: pageName, 
      params 
    });
    
    try {
      // 检查 MPA 导航能力
      this.assertMpaNavigationReady();
      
      // 检查目标页面是否存在
      const pageExists = await this.checkPageExists(pageName);
      if (!pageExists) {
        this.log.error('Target page does not exist', { page: pageName });
        throw new Error(`Page '${pageName}' not found`);
      }
      
      // 检查用户权限
      const hasPermission = await this.checkPagePermission(pageName);
      if (!hasPermission) {
        this.log.warn('Insufficient permissions for target page', { 
          page: pageName 
        });
        throw new Error(`Insufficient permissions for page '${pageName}'`);
      }
      
      // 执行导航
      await this.router.to({ url: pageName, param: params });
      
      this.log.info('MPA navigation completed', { target: pageName });
    } catch (error) {
      this.log.error('MPA navigation failed', { 
        target: pageName, 
        error: error.message 
      });
      throw error;
    }
  }
  
  // 断言 MPA 导航准备就绪
  private assertMpaNavigationReady() {
    const platformBridge = getPlatformBridge(); // 假设这是获取平台桥接器的方法
    
    if (!platformBridge?.navigateTo) {
      throw new Error('PlatformBridge does not support navigateTo. MPA navigation unavailable.');
    }
    
    if (!platformBridge?.redirectTo) {
      throw new Error('PlatformBridge does not support redirectTo. MPA navigation unavailable.');
    }
    
    this.log.debug('MPA navigation capability verified');
  }
  
  private async checkPageExists(pageName: string): Promise<boolean> {
    // 实际项目中应该从页面配置中检查
    const pagesConfig = await this.router.getPagesConfig();
    return pagesConfig.some(page => page.name === pageName);
  }
  
  private async checkPagePermission(pageName: string): Promise<boolean> {
    // 检查用户是否有访问该页面的权限
    const userPermissions = this.router.getUserPermissions();
    const pageConfig = await this.getPageConfig(pageName);
    
    if (!pageConfig.permission) {
      return true; // 无权限要求，允许访问
    }
    
    return userPermissions.includes(pageConfig.permission);
  }
  
  private async getPageConfig(pageName: string) {
    const pagesConfig = await this.router.getPagesConfig();
    return pagesConfig.find(page => page.name === pageName) || {};
  }
}
```

### Auto 模式智能导航

```typescript
// Auto 模式配置（默认模式）
const autoRouter = createRouter({
  mode: 'auto', // 自动模式
  pagesFetcher: () => fetchAutoPagesConfig(),
  userPermissionsProvider: () => getUserPermissions(),
  appConfig: { startPage: 'home' },
  // 根据路径特征自动选择 SPA/MPA
  pathAffinityRules: {
    spaPreferred: ['/dashboard', '/profile', '/settings'], // 这些路径倾向于使用 SPA
    mpaPreferred: ['/external', '/webview'] // 这些路径倾向于使用 MPA
  }
});

// 智能导航决策器
class SmartNavigator {
  private router = autoRouter;
  private log = getLog('SmartNavigator');
  
  async smartNavigate(destination: string, options: {
    params?: any;
    forceMode?: 'spa' | 'mpa';
    priority?: 'performance' | 'compatibility';
  } = {}) {
    const { params, forceMode, priority = 'performance' } = options;
    
    this.log.info('Smart navigation initiated', {
      destination,
      forceMode,
      priority,
      params
    });
    
    // 如果强制指定了模式，直接使用该模式
    if (forceMode) {
      this.log.debug(`Using forced mode: ${forceMode}`);
      return this.navigateInMode(destination, params, forceMode);
    }
    
    // 智能决策最佳导航模式
    const optimalMode = await this.decideOptimalMode(destination, priority);
    
    this.log.info('Optimal navigation mode decided', {
      destination,
      mode: optimalMode,
      reason: await this.getDecisionReason(destination, priority)
    });
    
    return this.navigateInMode(destination, params, optimalMode);
  }
  
  private async decideOptimalMode(destination: string, priority: 'performance' | 'compatibility'): Promise<'spa' | 'mpa'> {
    // 获取路径配置
    const pageConfig = await this.getPageConfig(destination);
    
    // 检查路径亲和性规则
    const affinityRules = this.router.getPathAffinityRules();
    
    if (affinityRules.spaPreferred?.includes(destination)) {
      return 'spa';
    }
    
    if (affinityRules.mpaPreferred?.includes(destination)) {
      return 'mpa';
    }
    
    // 根据优先级决策
    if (priority === 'performance') {
      // 性能优先：尽可能使用 SPA（更快的导航体验）
      return this.canUseSpa(destination) ? 'spa' : 'mpa';
    } else {
      // 兼容性优先：使用 MPA（更稳定的原生导航）
      return this.canUseMpa(destination) ? 'mpa' : 'spa';
    }
  }
  
  private async navigateInMode(destination: string, params: any, mode: 'spa' | 'mpa') {
    // 临时设置路由模式（实际实现可能需要不同的 API）
    const originalMode = this.router.getMode();
    
    try {
      // 设置目标模式
      this.router.setMode(mode);
      
      // 执行导航
      await this.router.to({ 
        url: destination, 
        param: params 
      });
      
      this.log.info('Navigation completed in mode', {
        destination,
        mode,
        originalMode
      });
    } finally {
      // 恢复原始模式
      this.router.setMode(originalMode);
    }
  }
  
  private async canUseSpa(destination: string): Promise<boolean> {
    // 检查是否可以使用 SPA 模式
    try {
      // 验证运行时准备就绪
      assertRuntimeReady();
      
      // 检查页面是否支持 SPA 模式
      const pageConfig = await this.getPageConfig(destination);
      return !pageConfig.meta?.disableSpa;
    } catch {
      return false;
    }
  }
  
  private async canUseMpa(destination: string): Promise<boolean> {
    // 检查是否可以使用 MPA 模式
    try {
      // 验证 MPA 导航能力
      assertMpaNavigationReady();
      
      // 检查页面是否存在
      return await this.checkPageExists(destination);
    } catch {
      return false;
    }
  }
  
  private async getPageConfig(destination: string) {
    const pagesConfig = await this.router.getPagesConfig();
    return pagesConfig.find(page => page.name === destination) || {};
  }
  
  private async checkPageExists(destination: string): Promise<boolean> {
    const pageConfig = await this.getPageConfig(destination);
    return !!pageConfig.path;
  }
  
  private async getDecisionReason(destination: string, priority: string) {
    if (priority === 'performance') {
      return 'Performance priority: attempting SPA for better UX';
    } else {
      return 'Compatibility priority: using MPA for stability';
    }
  }
}

// 使用智能导航器
const smartNav = new SmartNavigator();

// 智能导航到仪表板（性能优先）
smartNav.smartNavigate('dashboard', { 
  priority: 'performance' 
});

// 智能导航到外部链接（兼容性优先）
smartNav.smartNavigate('external-link', { 
  params: { url: 'https://example.com' },
  priority: 'compatibility' 
});
```

## 路由参数传递示例

### 查询参数传递

```typescript
// 传递复杂参数
const navigateWithComplexParams = () => {
  const complexData = {
    user: { 
      id: 123, 
      name: 'John Doe', 
      preferences: { theme: 'dark', lang: 'en' } 
    },
    settings: {
      notifications: true,
      autoSave: false
    },
    metadata: {
      source: 'dashboard',
      timestamp: Date.now(),
      sessionId: generateSessionId()
    }
  };
  
  router.to({
    url: 'user-settings',
    param: {
      // 基础类型直接传递
      userId: '123',
      tab: 'preferences',
      
      // 复杂对象需要序列化
      data: JSON.stringify(complexData),
      
      // 数组参数
      tags: ['important', 'settings', 'user'],
      
      // 标志位
      isNewUser: true,
      showTutorial: false
    }
  });
};

// 在目标页面接收参数
const getCurrentPageParams = () => {
  const currentRoute = router.getCurrentRoute();
  const params = currentRoute.query;
  
  // 解析复杂参数
  const userData = params.data ? JSON.parse(params.data) : null;
  const tags = params.tags ? params.tags.split(',') : [];
  
  return {
    userId: params.userId,
    tab: params.tab,
    userData,
    tags,
    flags: {
      isNewUser: params.isNewUser === 'true',
      showTutorial: params.showTutorial !== 'false'
    }
  };
};
```

### 路由状态管理

```typescript
// 路由状态管理器
class RouteStateManager {
  private log = getLog('RouteState');
  
  // 保存路由状态
  saveRouteState(routeName: string, state: any) {
    const stateKey = `route_state_${routeName}_${Date.now()}`;
    
    wx.setStorageSync(stateKey, {
      ...state,
      savedAt: new Date().toISOString(),
      routeName
    });
    
    this.log.info('Route state saved', { 
      route: routeName, 
      stateKey 
    });
    
    // 维护状态列表
    this.addToStateHistory(stateKey);
  }
  
  // 恢复路由状态
  restoreRouteState(routeName: string): any | null {
    const stateKeys = this.getStateHistory();
    const latestStateKey = stateKeys
      .filter(key => key.includes(routeName))
      .sort()
      .pop();
    
    if (!latestStateKey) {
      this.log.debug('No saved state found', { route: routeName });
      return null;
    }
    
    const savedState = wx.getStorageSync(latestStateKey);
    
    this.log.info('Route state restored', { 
      route: routeName, 
      stateKey: latestStateKey 
    });
    
    return savedState;
  }
  
  // 清理过期状态
  cleanupOldStates(maxAgeMinutes: number = 30) {
    const now = Date.now();
    const stateKeys = this.getStateHistory();
    
    const expiredKeys = stateKeys.filter(key => {
      const timestamp = parseInt(key.split('_').pop() || '0');
      return (now - timestamp) > (maxAgeMinutes * 60 * 1000);
    });
    
    expiredKeys.forEach(key => {
      wx.removeStorageSync(key);
      this.removeFromStateHistory(key);
    });
    
    this.log.info('Cleaned up expired route states', { 
      cleanedCount: expiredKeys.length 
    });
  }
  
  private addToStateHistory(stateKey: string) {
    const history = this.getStateHistory();
    if (!history.includes(stateKey)) {
      history.push(stateKey);
      wx.setStorageSync('route_state_history', history);
    }
  }
  
  private removeFromStateHistory(stateKey: string) {
    let history = this.getStateHistory();
    history = history.filter(key => key !== stateKey);
    wx.setStorageSync('route_state_history', history);
  }
  
  private getStateHistory(): string[] {
    return wx.getStorageSync('route_state_history') || [];
  }
}

// 使用路由状态管理器
const routeStateManager = new RouteStateManager();

// 在页面离开时保存状态
router.beforeEach((to, from) => {
  if (from.meta?.saveState) {
    const currentPageState = getCurrentPageState();
    routeStateManager.saveRouteState(from.name, currentPageState);
  }
});

// 在页面进入时恢复状态
router.afterEach((to, from) => {
  if (to.meta?.restoreState) {
    const savedState = routeStateManager.restoreRouteState(to.name);
    if (savedState) {
      restorePageState(savedState);
    }
  }
});
```

## 动画效果示例

### 自定义路由动画

```typescript
// 动画配置
const animationConfig = {
  // 内置动画类型
  types: {
    'slide': 'slide-left-to-right',
    'fade': 'fade-in-out',
    'zoom': 'scale-up-down',
    'flip': 'flip-horizontal'
  },
  
  // 自定义动画类
  customAnimations: {
    'slide-left-to-right': {
      enter: 'slide-in-left',
      leave: 'slide-out-right',
      duration: 300
    },
    'fade-in-out': {
      enter: 'fade-in',
      leave: 'fade-out',
      duration: 200
    }
  }
};

// 动画管理器
class RouteAnimationManager {
  private log = getLog('RouteAnimation');
  
  async applyAnimation(animationType: string, direction: 'enter' | 'leave') {
    this.log.debug('Applying route animation', {
      type: animationType,
      direction,
      timestamp: new Date().toISOString()
    });
    
    const animation = animationConfig.customAnimations[animationType];
    if (!animation) {
      this.log.warn('Unknown animation type', { type: animationType });
      return;
    }
    
    const className = animation[direction];
    const duration = animation.duration;
    
    // 应用动画类
    this.applyCssClass(className);
    
    // 等待动画完成
    await this.waitForDuration(duration);
    
    // 移除动画类
    this.removeCssClass(className);
  }
  
  private applyCssClass(className: string) {
    // 在实际项目中，这里会操作 DOM 或使用框架的动画 API
    console.log(`Applying CSS class: ${className}`);
  }
  
  private removeCssClass(className: string) {
    // 移除 CSS 类
    console.log(`Removing CSS class: ${className}`);
  }
  
  private waitForDuration(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 在路由守卫中应用动画
router.beforeEach((to, from) => {
  const animationManager = new RouteAnimationManager();
  const animationType = to.meta?.animation || 'slide';
  
  // 应用离开动画
  animationManager.applyAnimation(animationType, 'leave');
});

router.afterEach((to, from) => {
  const animationManager = new RouteAnimationManager();
  const animationType = to.meta?.animation || 'slide';
  
  // 应用进入动画
  animationManager.applyAnimation(animationType, 'enter');
});
```

这些路由示例展示了 NucleusX 路由引擎的强大功能，包括不同模式的使用、参数传递、状态管理以及动画效果。通过这些示例，您可以构建出用户体验优秀的导航系统。