# 状态管理 API

## defineStore

定义状态存储的核心函数，采用 Pinia 风格的语法。

### 语法

```typescript
import { defineStore } from '@nucleusx/core';

const useStore = defineStore(id, options);
```

### 参数

- `id` (string): Store 的唯一标识符
- `options` (StoreOptions): Store 配置选项

### 返回值

- `Function`: 返回一个 Store 工厂函数

### 示例

```typescript
// stores/counter.ts
import { defineStore } from '@nucleusx/core';

export const useCounterStore = defineStore('counter', {
  // 1. State: 必须是函数
  state: () => ({
    count: 0
  }),

  // 2. Getters: 计算属性
  getters: {
    doubleCount() {
      return this.count * 2;
    }
  },

  // 3. Actions: 业务逻辑
  actions: {
    increment() {
      this.count++;
    }
  }
});
```

## StoreOptions 接口

定义 Store 的配置选项。

### 属性

- `state`: () => Object - 状态定义函数
- `getters?`: Object - 计算属性集合（可选）
- `actions?`: Object - 动作方法集合（可选）

## 使用 Store

### 在组件中使用

```typescript
// 在业务逻辑中
const counter = useCounterStore();
console.log(counter.count);
counter.increment();
```

## StoreEngine 接口

状态管理引擎接口，定义了底层引擎的规范。

### 方法

- `define(id, options)`: 定义 Store 的方法

## 引擎适配

NucleusX Store Engine 是一个状态管理适配层，允许在不同平台使用不同的底层引擎：

- **Vue 环境**: 自动适配为 Pinia Store
- **原生小程序**: 自动适配为 MobX Observable
- **其他环境**: 可自定义适配器

## 最佳实践

1. **保持 State 纯净**: State 中只存放数据，不要存放 DOM 节点或复杂的类实例
2. **Actions 是逻辑中心**: 所有的业务逻辑都应该封装在 Actions 中
3. **使用计算属性**: 复杂的派生数据应该使用 getters 计算