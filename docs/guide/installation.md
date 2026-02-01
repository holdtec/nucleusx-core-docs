# 安装指南

本指南将详细介绍如何在您的项目中安装和配置 NucleusX-Core。

## 系统要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0
- TypeScript >= 5.0.0 (推荐)

## 安装

### 使用 npm

```bash
npm install @nucleusx/core
```

### 使用 yarn

```bash
yarn add @nucleusx/core
```

## 项目配置

### TypeScript 配置

确保您的 `tsconfig.json` 包含以下配置：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 构建工具配置

根据您使用的构建工具进行相应配置：

#### Webpack

如果您的项目使用 Webpack，请确保配置支持 ES 模块：

```javascript
module.exports = {
  // ...其他配置
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

#### Vite

对于 Vite 项目，通常无需额外配置即可使用。

## 平台适配

NucleusX-Core 是平台无关的，但需要您提供平台特定的适配器。

### 小程序适配

```typescript
// 小程序平台桥接器示例
const miniProgramBridge: IPlatformBridge = {
  showToast: (options) => wx.showToast(options),
  showLoading: (options) => wx.showLoading(options),
  hideLoading: () => wx.hideLoading(),
  showModal: (options) => wx.showModal(options),
  getStorageSync: (key) => wx.getStorageSync(key),
  setStorageSync: (key, data) => wx.setStorageSync(key, data),
  // ... 其他 API
};
```

### H5 适配

```typescript
// H5 平台桥接器示例
const h5Bridge: IPlatformBridge = {
  showToast: (options) => {
    // H5 实现
    alert(options.title || options.content);
  },
  showLoading: (options) => {
    // H5 加载实现
  },
  // ... 其他 API
};
```

## 状态管理引擎

您需要选择并配置一个状态管理引擎：

### MobX

```bash
npm install mobx mobx-miniprogram
```

```typescript
import { createRuntime } from '@nucleusx/core';
import { mobxEngine } from './engines/mobx-engine'; // 您的自定义适配器

const kit = {
  storeEngine: mobxEngine,
  // ... 其他配置
};
```

### Pinia (Vue 项目)

```bash
npm install pinia
```

```typescript
import { createRuntime } from '@nucleusx/core';
import { piniaEngine } from './engines/pinia-engine'; // 您的自定义适配器

const kit = {
  storeEngine: piniaEngine,
  // ... 其他配置
};
```

## 请求适配器

您需要为您的平台提供请求适配器：

### 微信小程序适配器

```typescript
import { RequestAdapter } from '@nucleusx/core';

const wxAdapter: RequestAdapter = {
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
```

## 完整初始化示例

```typescript
import { createRuntime, type IKit } from '@nucleusx/core';
import { wxAdapter } from './adapters/wx-adapter';
import { mobxEngine } from './engines/mobx-engine';
import { ConsoleTransport, StorageTransport } from './transports';

async function initializeRuntime() {
  const kit: IKit = {
    platformBridge: {
      // 平台桥接器实现
    },
    storeEngine: mobxEngine,
    request: {
      baseUrl: 'https://api.example.com',
      adapter: wxAdapter,
    },
    router: {
      pagesFetcher: () => fetchPagesConfig(),
      userPermissionsProvider: () => getMyPermissions(),
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
      name: '我的应用',
      version: '1.0.0',
    }
  };

  try {
    const runtime = await createRuntime(kit);
    console.log('Runtime initialized successfully');
    return runtime;
  } catch (error) {
    console.error('Failed to initialize runtime:', error);
    throw error;
  }
}

// 启动应用
initializeRuntime().then(runtime => {
  // 应用启动逻辑
}).catch(error => {
  // 错误处理
});
```

## 验证安装

安装完成后，您可以创建一个简单的测试来验证安装是否成功：

```typescript
// test-installation.ts
import { createRuntime } from '@nucleusx/core';

console.log('NucleusX-Core imported successfully');
console.log('Version:', require('@nucleusx/core/package.json').version);

// 更多测试代码...
```

## 故障排除

### 常见问题

1. **模块找不到**: 确保正确安装了 `@nucleusx/core` 包
2. **类型错误**: 检查 TypeScript 版本是否满足要求
3. **平台 API 错误**: 确保提供了正确的平台桥接器实现

### 调试技巧

- 启用 DEBUG 级别日志以获取更多信息
- 检查 Kit 配置是否完整
- 确认平台适配器是否正确实现所需接口