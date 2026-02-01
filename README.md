# NucleusX-Core 文档项目

这是一个完整的 NucleusX-Core 运行时核心库文档网站项目。

## 项目概述

NucleusX-Core 是一套面向中大型、多端、长生命周期应用的运行时核心库，用于统一管理业务逻辑的运行、状态与跨端行为。

## 文档结构

### 指南 (Guide)
- [首页](./docs/README.md) - 项目介绍和快速开始
- [入门指南](./docs/guide/getting-started.md) - 快速上手
- [安装指南](./docs/guide/installation.md) - 安装和配置
- [配置指南](./docs/guide/configuration.md) - 详细配置说明
- [功能详解](./docs/guide/features/) - 核心功能详细介绍
- [许可证](./docs/guide/license.md) - 商业使用说明

### API 参考
- [核心模块](./docs/api/core.md) - 核心运行时与依赖注入
- [路由模块](./docs/api/router.md) - 虚拟路由引擎
- [状态管理](./docs/api/store.md) - 统一状态管理
- [请求模块](./docs/api/request.md) - 统一请求接口
- [日志系统](./docs/api/logger.md) - 日志记录和管理

### 示例代码
- [基础示例](./docs/examples/basic.md) - 基础使用方法
- [路由示例](./docs/examples/routing.md) - 路由功能应用
- [状态管理示例](./docs/examples/state-management.md) - 状态管理用法
- [请求处理示例](./docs/examples/requests.md) - 请求处理实践
- [日志示例](./docs/examples/logging.md) - 日志系统使用
- [综合示例](./docs/examples/comprehensive.md) - 综合应用示例

## 开发命令

```bash
# 启动开发服务器
npm run docs:dev

# 构建静态网站
npm run docs:build

# 本地预览构建结果
npm run docs:serve
```

## 商业使用

`@nucleusx/core` 并非免费商业软件。

- ✅ 允许：技术评估、内部验证、非商业试用
- ❌ 禁止：未授权的商业项目、生产环境使用
- 🔒 商业使用需获得正式授权

商业授权请联系：**contact@nucleusx.dev**

## 项目特点

- **统一运行时**: 提供统一的 API 访问接口
- **平台无关**: 业务逻辑与平台实现解耦
- **虚拟路由**: 支持 SPA/MPA 混合导航模式
- **状态管理**: 支持多种状态管理引擎
- **中间件机制**: 灵活的请求和路由中间件
- **企业级治理**: 适合长期维护的企业级项目

## 技术栈

- VuePress v2
- Vue 3
- TypeScript
- SCSS

## 部署

构建后的静态文件位于 `.vuepress/dist` 目录，可部署到任意静态服务器或 CDN。

GitHub Actions 部署配置位于 `.github/workflows/deploy.yml`。