# 基础示例

本章提供 NucleusX 的基础使用示例，帮助您快速理解框架的核心概念。

## 项目初始化示例

### 完整的项目初始化代码

```typescript
import { createRuntime, type IKit, type IPlatformBridge } from '@nucleusx/core';
import { ConsoleTransport, StorageTransport } from '@nucleusx/core';

// 1. 定义平台桥接器
const platformBridge: IPlatformBridge = {
  // 消息提示
  showToast: (options) => wx.showToast(options),
  showLoading: (options) => wx.showLoading(options),
  hideLoading: () => wx.hideLoading(),
  showModal: (options) => wx.showModal(options),
  
  // 存储
  getStorageSync: (key) => wx.getStorageSync(key),
  setStorageSync: (key, data) => wx.setStorageSync(key, data),
  removeStorageSync: (key) => wx.removeStorageSync(key),
  clearStorageSync: () => wx.clearStorageSync(),
  
  // 系统信息
  getSystemInfo: () => wx.getSystemInfoSync(),
  
  // 导航
  navigateTo: (options) => wx.navigateTo(options),
  redirectTo: (options) => wx.redirectTo(options),
  navigateBack: (options) => wx.navigateBack(options),
};

// 2. 定义请求适配器
const requestAdapter = {
  request: (config) => {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.url,
        method: config.method || 'GET',
        data: config.data,
        header: config.headers,
        success: (res) => resolve(res),
        fail: (err) => reject(err)
      });
    });
  }
};

// 3. 定义状态管理引擎（这里使用简化的示例）
const storeEngine = {
  define: (id, options) => {
    // 实际项目中会桥接到 Pinia 或 MobX
    return {
      ...options.state(),
      ...options.actions,
      // 添加计算属性
      ...Object.entries(options.getters || {}).reduce((acc, [key, getter]) => {
        acc[key] = getter;
        return acc;
      }, {})
    };
  }
};

// 4. 创建 Kit 配置
const kit: IKit = {
  platformBridge,
  storeEngine,
  request: {
    baseUrl: 'https://api.example.com',
    adapter: requestAdapter,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  },
  router: {
    mode: 'auto',
    pagesFetcher: () => fetchPagesConfig(),
    userPermissionsProvider: () => getUserPermissions(),
    appConfig: { startPage: 'home' },
  },
  logger: {
    level: 'info',
    transports: [
      new ConsoleTransport(),
      new StorageTransport({ maxEntries: 1000 })
    ],
  },
  appInfo: {
    appId: 'wx123456',
    name: 'My Application',
    version: '1.0.0',
  }
};

// 5. 初始化运行时
async function initializeApp() {
  try {
    const runtime = await createRuntime(kit);
    console.log('NucleusX Runtime initialized successfully');
    
    // 将运行时实例保存到全局，供其他模块使用
    (globalThis as any).__NUCLEUS_RUNTIME__ = runtime;
    
    return runtime;
  } catch (error) {
    console.error('Failed to initialize NucleusX Runtime:', error);
    throw error;
  }
}

// 辅助函数
async function fetchPagesConfig() {
  // 实际项目中从服务器获取页面配置
  return [
    { path: '/home', name: 'home', component: 'pages/Home' },
    { path: '/profile', name: 'profile', component: 'pages/Profile' },
    { path: '/settings', name: 'settings', component: 'pages/Settings' }
  ];
}

function getUserPermissions() {
  // 实际项目中从存储或服务器获取用户权限
  return ['view_home', 'view_profile'];
}

// 启动应用
initializeApp().then(runtime => {
  // 应用启动后的逻辑
  console.log('App is ready to use NucleusX features');
}).catch(error => {
  console.error('App initialization failed:', error);
});
```

## 简单的 Store 示例

### 定义一个计数器 Store

```typescript
import { defineStore } from '@nucleusx/core';

// 定义计数器 Store
export const useCounterStore = defineStore('counter', {
  // 状态
  state: () => ({
    count: 0,
    lastChangedAt: null as string | null
  }),
  
  // 计算属性
  getters: {
    doubleCount(): number {
      return this.count * 2;
    },
    
    isEven(): boolean {
      return this.count % 2 === 0;
    }
  },
  
  // 动作方法
  actions: {
    increment() {
      this.count++;
      this.lastChangedAt = new Date().toISOString();
    },
    
    decrement() {
      this.count--;
      this.lastChangedAt = new Date().toISOString();
    },
    
    reset() {
      this.count = 0;
      this.lastChangedAt = null;
    },
    
    async incrementAsync(delay: number = 1000) {
      await new Promise(resolve => setTimeout(resolve, delay));
      this.increment();
    }
  }
});

// 使用示例
const counterStore = useCounterStore();
console.log('Initial count:', counterStore.count); // 0

counterStore.increment();
console.log('After increment:', counterStore.count); // 1
console.log('Double count:', counterStore.doubleCount); // 2
```

## 路由使用示例

### 基础路由操作

```typescript
import { getLog } from '@nucleusx/core';

// 从运行时获取路由实例
const { router } = (globalThis as any).__NUCLEUS_RUNTIME__;

// 路由日志记录器
const routerLog = getLog('RouterExample');

// 页面跳转
const navigateToDetail = (itemId: string) => {
  routerLog.info('Navigating to detail page', { itemId });
  
  router.to({
    url: 'detail',
    param: { id: itemId }
  }).then(() => {
    routerLog.info('Navigation to detail successful', { itemId });
  }).catch(error => {
    routerLog.error('Navigation to detail failed', { 
      itemId, 
      error: error.message 
    });
  });
};

// 返回上一页
const goBack = () => {
  routerLog.info('Going back');
  router.back();
};

// 重定向
const redirectToLogin = () => {
  routerLog.info('Redirecting to login page');
  router.redirect({ url: 'login' });
};

// 监听路由变化
router.beforeEach((to, from) => {
  routerLog.info('Route change started', {
    from: from.path,
    to: to.path,
    timestamp: new Date().toISOString()
  });
});

router.afterEach((to, from) => {
  routerLog.info('Route change completed', {
    from: from.path,
    to: to.path,
    timestamp: new Date().toISOString()
  });
});
```

## 请求使用示例

### 基础请求操作

```typescript
import { getLog } from '@nucleusx/core';

// 从运行时获取请求实例
const { request } = (globalThis as any).__NUCLEUS_RUNTIME__;

// API 服务日志记录器
const apiLog = getLog('ApiExample');

// 用户相关的 API 请求
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

## 日志使用示例

### 不同场景下的日志记录

```typescript
import { getLog } from '@nucleusx/core';

// 不同模块的记录器
const appLog = getLog('App');
const authLog = getLog('Auth');
const networkLog = getLog('Network');

// 应用启动日志
appLog.info('Application starting', {
  version: '1.0.0',
  platform: 'weapp',
  timestamp: new Date().toISOString()
});

// 认证相关日志
class AuthService {
  private log = getLog('AuthService');
  
  async login(credentials: { username: string; password: string }) {
    this.log.info('Login attempt', { 
      username: credentials.username 
    });
    
    try {
      // 模拟登录请求
      const response = await this.performLogin(credentials);
      
      this.log.info('Login successful', { 
        userId: response.userId,
        timestamp: new Date().toISOString()
      });
      
      return response;
    } catch (error) {
      this.log.error('Login failed', { 
        username: credentials.username,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }
  
  private async performLogin(credentials: any) {
    // 实际的登录逻辑
    return { userId: 'user123', token: 'fake-token' };
  }
}

// 网络请求日志
const networkLogger = {
  onRequest: (config: any) => {
    networkLog.debug('Request initiated', {
      url: config.url,
      method: config.method,
      timestamp: new Date().toISOString()
    });
  },
  
  onResponse: (response: any) => {
    networkLog.debug('Response received', {
      statusCode: response.statusCode,
      url: response.config.url,
      duration: response.duration
    });
  },
  
  onError: (error: any) => {
    networkLog.error('Network error', {
      error: error.message,
      url: error.config?.url,
      timestamp: new Date().toISOString()
    });
  }
};
```

## 综合使用示例

### 一个简单的业务场景

```typescript
import { defineStore, getLog } from '@nucleusx/core';
import { useCounterStore } from './stores/counter';

// 用户状态 Store
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as any,
    isLoggedIn: false,
    loginAttempts: 0
  }),
  
  getters: {
    displayName(): string {
      return this.currentUser?.name || 'Guest';
    },
    
    canAccessPremium(): boolean {
      return this.isLoggedIn && this.currentUser?.isPremium;
    }
  },
  
  actions: {
    async login(credentials: { username: string; password: string }) {
      const log = getLog('UserStore');
      
      log.info('Login initiated', { 
        username: credentials.username 
      });
      
      this.loginAttempts++;
      
      try {
        // 模拟 API 调用
        const userData = await this.performLogin(credentials);
        
        this.currentUser = userData;
        this.isLoggedIn = true;
        this.loginAttempts = 0;
        
        log.info('Login successful', { 
          userId: userData.id,
          timestamp: new Date().toISOString()
        });
        
        // 登录成功后的一些操作
        const counter = useCounterStore();
        counter.increment(); // 记录登录次数
        
      } catch (error) {
        log.error('Login failed', { 
          username: credentials.username,
          error: error.message,
          attemptNumber: this.loginAttempts
        });
        
        throw error;
      }
    },
    
    logout() {
      const log = getLog('UserStore');
      
      log.info('Logout initiated', { 
        userId: this.currentUser?.id 
      });
      
      this.currentUser = null;
      this.isLoggedIn = false;
      
      log.info('Logout completed');
    },
    
    private async performLogin(credentials: any) {
      // 这里应该是真实的 API 调用
      return {
        id: 'user123',
        name: credentials.username,
        email: `${credentials.username}@example.com`,
        isPremium: false
      };
    }
  }
});

// 使用示例
const userStore = useUserStore();

// 登录
userStore.login({
  username: 'john_doe',
  password: 'secure_password'
}).then(() => {
  console.log('Login successful!');
  console.log('Current user:', userStore.displayName);
}).catch(error => {
  console.error('Login failed:', error);
});

// 检查权限
if (userStore.canAccessPremium) {
  console.log('User can access premium features');
} else {
  console.log('User has standard access');
}
```

这些基础示例展示了如何使用 NucleusX 的核心功能。通过这些示例，您可以开始构建自己的应用，并逐步深入了解框架的高级功能。