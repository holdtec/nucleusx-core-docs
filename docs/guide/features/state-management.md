# 状态管理

本章详细介绍 NucleusX 状态管理引擎的功能和使用方法。

## 状态管理概述

NucleusX Store Engine 是一个**状态管理适配层**。它定义了一套标准的 `defineStore` 接口，允许你在业务代码中编写**平台无关**的 Store，而在运行时自动桥接到 Pinia (Vue) 或 MobX (原生小程序)。

### 核心特性

- **Write Once, Run Anywhere**：业务逻辑只需要写一次，在不同平台自动适配
- **Pinia 风格 API**：采用最流行的 Pinia 语法风格，降低学习成本
- **依赖注入 (DI)**：通过 `storeRegistry.setEngine()` 动态注入底层引擎，实现真正的架构解耦

### 架构原理

状态管理引擎采用分层架构：

1. **Interface层**：定义了 `StoreEngine` 接口，规范了 `define` 方法的签名
2. **Adapter层**：将标准接口适配到底层状态管理库
   - `PiniaEngine`: 将规范转换为 `definePiniaStore` 调用
   - `MobXEngine`: 将规范转换为 `mobx-miniprogram` 的 `observable`
3. **Business层**：业务代码只依赖 Interface 层，完全不感知 Adapter

## Store 定义

### 基础 Store 定义

使用 `defineStore` 定义状态存储：

```typescript
import { defineStore } from '@nucleusx/core';

// 定义计数器 Store
export const useCounterStore = defineStore('counter', {
  // 1. State: 必须是函数，返回初始状态
  state: () => ({
    count: 0,
    name: 'Eduardo',
    isAdmin: true
  }),

  // 2. Getters: 计算属性，类似 Vue 的 computed
  getters: {
    // 自动推导 this 类型
    doubleCount(): number {
      return this.count * 2;
    },

    // 带参数的 getter
    doublePlusOne(): number {
      return this.doubleCount + 1;
    },

    // 使用其他 getter
    isAdminUser(): boolean {
      return this.isAdmin && this.name === 'Admin';
    }
  },

  // 3. Actions: 业务逻辑方法
  actions: {
    // 同步方法
    increment() {
      this.count++;
    },

    // 异步方法
    async fetchData() {
      try {
        const response = await api.getData();
        this.updateData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    },

    // 提交状态变更
    updateData(data: any) {
      this.count = data.count || this.count;
      this.name = data.name || this.name;
    },

    // 重置状态
    reset() {
      this.$reset();
    }
  }
});
```

### Store 配置选项

```typescript
export interface StoreOptions<T> {
  // 状态定义函数
  state: () => T;
  
  // 计算属性
  getters?: {
    [K: string]: (this: T & _StoreWithGetters<any>) => any;
  };
  
  // 动作方法
  actions?: {
    [K: string]: (this: T & _StoreWithActions<any>, ...args: any[]) => any;
  };
  
  // 持久化配置（可选）
  persist?: {
    enabled: boolean;
    key?: string;
    paths?: string[];
  };
}
```

## Store 使用

### 在组件中使用

```typescript
// 在 Vue 组件中
import { useCounterStore } from '@/stores/counter';

export default {
  setup() {
    const counter = useCounterStore();
    
    return {
      counter,
      doubleCount: computed(() => counter.doubleCount)
    };
  },
  
  methods: {
    handleClick() {
      this.counter.increment();
    }
  }
};
```

### 在业务逻辑中使用

```typescript
// 在业务逻辑文件中
import { useCounterStore } from '@/stores/counter';

class UserService {
  async login(username: string, password: string) {
    const counter = useCounterStore();
    
    try {
      // 登录前增加尝试次数
      counter.increment();
      
      const response = await api.login(username, password);
      
      if (response.success) {
        // 登录成功，重置计数
        counter.reset();
        return response;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
}
```

## 高级特性

### Store 组合

可以组合多个 Store：

```typescript
import { defineStore } from '@nucleusx/core';
import { useUserStore } from './user';
import { useCartStore } from './cart';

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    isProcessing: false,
    orderId: null as string | null
  }),

  getters: {
    // 组合其他 Store 的状态
    canCheckout(): boolean {
      const user = useUserStore();
      const cart = useCartStore();
      
      return user.isAuthenticated && 
             cart.items.length > 0 && 
             !this.isProcessing;
    },

    checkoutSummary(): any {
      const user = useUserStore();
      const cart = useCartStore();
      
      return {
        user: user.profile,
        items: cart.items,
        total: cart.totalPrice,
        processing: this.isProcessing
      };
    }
  },

  actions: {
    async processCheckout() {
      if (!this.canCheckout) {
        throw new Error('Cannot proceed with checkout');
      }

      this.isProcessing = true;
      
      try {
        const user = useUserStore();
        const cart = useCartStore();
        
        const order = await api.createOrder({
          userId: user.id,
          items: cart.items,
          total: cart.totalPrice
        });

        this.orderId = order.id;
        
        // 清空购物车
        cart.clear();
        
        return order;
      } finally {
        this.isProcessing = false;
      }
    }
  }
});
```

### 模块化 Store

可以创建模块化的 Store 结构：

```typescript
// stores/modules/user.ts
import { defineStore } from '@nucleusx/core';

export const useUserModule = defineStore('user', {
  state: () => ({
    profile: null as any,
    isAuthenticated: false,
    permissions: [] as string[]
  }),

  getters: {
    hasPermission: (state) => (permission: string) => {
      return state.permissions.includes(permission);
    },
    
    isAdmin: (state) => {
      return state.permissions.includes('admin');
    }
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const response = await api.authenticate(credentials);
        this.profile = response.user;
        this.isAuthenticated = true;
        this.permissions = response.permissions;
      } catch (error) {
        throw new Error('Authentication failed');
      }
    },

    logout() {
      this.profile = null;
      this.isAuthenticated = false;
      this.permissions = [];
    },

    async updateProfile(updates: Partial<any>) {
      if (!this.isAuthenticated) {
        throw new Error('Not authenticated');
      }

      try {
        const response = await api.updateProfile(updates);
        this.profile = { ...this.profile, ...updates };
        return response;
      } catch (error) {
        throw new Error('Failed to update profile');
      }
    }
  }
});
```

### Store 持久化

支持状态持久化：

```typescript
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    language: 'zh-CN',
    notifications: true,
    fontSize: 14
  }),

  // 持久化配置
  persist: {
    enabled: true,
    key: 'app-settings',                    // 存储键名
    paths: ['theme', 'language', 'fontSize'] // 只持久化指定字段
  },

  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme;
    },

    setLanguage(lang: string) {
      this.language = lang;
    },

    toggleNotifications() {
      this.notifications = !this.notifications;
    }
  }
});
```

## 异步状态管理

### 异步 Action

```typescript
export const useDataStore = defineStore('data', {
  state: () => ({
    items: [] as any[],
    loading: false,
    error: null as string | null,
    lastUpdated: null as number | null
  }),

  getters: {
    itemsCount(): number {
      return this.items.length;
    },

    hasError(): boolean {
      return this.error !== null;
    },

    isLoading(): boolean {
      return this.loading;
    }
  },

  actions: {
    async fetchItems(force = false) {
      // 如果已有数据且不是强制刷新，则跳过
      if (this.items.length > 0 && !force) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await api.getItems();
        this.items = response.data;
        this.lastUpdated = Date.now();
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch items';
        console.error('Fetch items error:', error);
      } finally {
        this.loading = false;
      }
    },

    async addItem(item: any) {
      try {
        this.loading = true;
        const response = await api.addItem(item);
        this.items.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.message || 'Failed to add item';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateItem(id: string, updates: any) {
      try {
        this.loading = true;
        const response = await api.updateItem(id, updates);
        
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...updates };
        }
        
        return response.data;
      } catch (error: any) {
        this.error = error.message || 'Failed to update item';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(id: string) {
      try {
        this.loading = true;
        await api.deleteItem(id);
        
        this.items = this.items.filter(item => item.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Failed to delete item';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
```

## Store 监听与响应

### 监听状态变化

```typescript
import { watch } from 'vue';
import { useCounterStore } from '@/stores/counter';

// 在组件中监听 Store 变化
export default {
  setup() {
    const counter = useCounterStore();
    
    // 监听特定状态变化
    watch(
      () => counter.count,
      (newCount, oldCount) => {
        console.log(`Count changed from ${oldCount} to ${newCount}`);
        
        // 可以触发其他逻辑
        if (newCount % 10 === 0) {
          console.log('Count reached a milestone!');
        }
      }
    );
    
    // 监听整个 Store 变化
    watch(
      counter,
      (newState, oldState) => {
        console.log('Store state changed:', newState);
      },
      { deep: true }
    );
    
    return { counter };
  }
};
```

### Store 内部监听

```typescript
export const useWatchStore = defineStore('watch', {
  state: () => ({
    count: 0,
    name: '',
    lastAction: ''
  }),

  actions: {
    increment() {
      this.count++;
      this.lastAction = 'increment';
    },

    setName(name: string) {
      this.name = name;
      this.lastAction = 'setName';
    }
  },

  // Store 内部的副作用
  $subscribe: (mutation, state) => {
    // 每次状态变化都会触发
    console.log('State mutation:', mutation);
    console.log('New state:', state);
    
    // 可以在这里执行副作用，如发送分析数据
    analytics.track(mutation.type, {
      value: mutation.payload,
      timestamp: Date.now()
    });
  }
});
```

## 底层引擎适配

### Pinia 适配器

在 Vue 环境中，引擎会自动适配为 Pinia：

```typescript
// 内部实现（开发者无需关心）
class PiniaEngine implements StoreEngine {
  define<T>(id: string, options: StoreOptions<T>) {
    return definePiniaStore(id, {
      ...options,
      // 将 NucleusX 的配置转换为 Pinia 格式
    });
  }
}
```

### MobX 适配器

在小程序环境中，引擎会自动适配为 MobX：

```typescript
// 内部实现（开发者无需关心）
class MobXEngine implements StoreEngine {
  define<T>(id: string, options: StoreOptions<T>) {
    // 将标准接口转换为 MobX observable
    const store = observable({
      ...options.state(),
      ...options.actions
    });
    
    // 添加计算属性
    if (options.getters) {
      Object.entries(options.getters).forEach(([name, getter]) => {
        Object.defineProperty(store, name, {
          get: () => getter.call(store),
          enumerable: true,
          configurable: true
        });
      });
    }
    
    return store;
  }
}
```

## 最佳实践

### 1. 不要在 Store 中导入特定库

```typescript
// ❌ 错误：直接导入 Pinia
import { defineStore } from 'pinia';

// ✅ 正确：从 NucleusX 导入
import { defineStore } from '@nucleusx/core';
```

### 2. 保持 State 纯净

State 中只存放数据，不要存放 DOM 节点或复杂的类实例（除非非响应式）：

```typescript
// ❌ 错误：在 State 中存放复杂对象
state: () => ({
  domElement: document.getElementById('my-element'), // 不要这样做
  complexObject: new ComplexClass() // 不要这样做
})

// ✅ 正确：只存放简单数据
state: () => ({
  elementId: 'my-element',
  simpleData: {
    id: 1,
    name: 'example'
  }
})
```

### 3. Actions 是逻辑中心

所有的业务逻辑都应该封装在 Actions 中，View 层只负责调用：

```typescript
// ✅ 正确：在 Actions 中处理业务逻辑
actions: {
  async processUserData(userData: any) {
    // 验证数据
    if (!userData.name) {
      throw new Error('Name is required');
    }
    
    // 处理数据
    const processedData = {
      ...userData,
      createdAt: new Date().toISOString(),
      status: 'processed'
    };
    
    // 更新状态
    this.userData = processedData;
    
    // 保存到服务器
    await api.saveUserData(processedData);
  }
}
```

### 4. 使用计算属性

复杂的派生数据应该使用 getters 计算：

```typescript
getters: {
  // 简单计算
  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  },
  
  // 复杂计算
  filteredItems(): any[] {
    return this.items.filter(item => 
      item.status === 'active' && 
      item.priority >= this.minPriority
    );
  },
  
  // 带参数的 getter
  getItemById: (state) => (id: string) => {
    return state.items.find(item => item.id === id);
  }
}
```

通过合理使用 NucleusX 状态管理引擎，您可以构建出跨平台、高性能、易维护的状态管理系统。