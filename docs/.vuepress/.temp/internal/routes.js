export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"首页"} }],
  ["/api/", { loader: () => import(/* webpackChunkName: "api_index.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/index.html.js"), meta: {"title":"API 参考"} }],
  ["/api/core.html", { loader: () => import(/* webpackChunkName: "api_core.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/core.html.js"), meta: {"title":"核心模块 API"} }],
  ["/api/logger.html", { loader: () => import(/* webpackChunkName: "api_logger.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/logger.html.js"), meta: {"title":"日志系统 API"} }],
  ["/api/request.html", { loader: () => import(/* webpackChunkName: "api_request.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/request.html.js"), meta: {"title":"请求模块 API"} }],
  ["/api/router.html", { loader: () => import(/* webpackChunkName: "api_router.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/router.html.js"), meta: {"title":"路由模块 API"} }],
  ["/api/store.html", { loader: () => import(/* webpackChunkName: "api_store.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/store.html.js"), meta: {"title":"状态管理 API"} }],
  ["/guide/", { loader: () => import(/* webpackChunkName: "guide_index.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/index.html.js"), meta: {"title":"指南"} }],
  ["/guide/configuration.html", { loader: () => import(/* webpackChunkName: "guide_configuration.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/configuration.html.js"), meta: {"title":"配置指南"} }],
  ["/guide/getting-started.html", { loader: () => import(/* webpackChunkName: "guide_getting-started.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/getting-started.html.js"), meta: {"title":"快速开始"} }],
  ["/guide/installation.html", { loader: () => import(/* webpackChunkName: "guide_installation.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/installation.html.js"), meta: {"title":"安装指南"} }],
  ["/guide/license.html", { loader: () => import(/* webpackChunkName: "guide_license.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/license.html.js"), meta: {"title":"许可证与商业使用"} }],
  ["/examples/", { loader: () => import(/* webpackChunkName: "examples_index.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/index.html.js"), meta: {"title":"示例代码"} }],
  ["/examples/basic.html", { loader: () => import(/* webpackChunkName: "examples_basic.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/basic.html.js"), meta: {"title":"基础示例"} }],
  ["/examples/routing.html", { loader: () => import(/* webpackChunkName: "examples_routing.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/routing.html.js"), meta: {"title":"路由示例"} }],
  ["/guide/features/", { loader: () => import(/* webpackChunkName: "guide_features_index.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/features/index.html.js"), meta: {"title":"功能指南"} }],
  ["/guide/features/architecture.html", { loader: () => import(/* webpackChunkName: "guide_features_architecture.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/features/architecture.html.js"), meta: {"title":"架构详解"} }],
  ["/guide/features/concepts.html", { loader: () => import(/* webpackChunkName: "guide_features_concepts.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/features/concepts.html.js"), meta: {"title":"核心概念"} }],
  ["/guide/features/logging.html", { loader: () => import(/* webpackChunkName: "guide_features_logging.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/features/logging.html.js"), meta: {"title":"日志系统"} }],
  ["/guide/features/requests.html", { loader: () => import(/* webpackChunkName: "guide_features_requests.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/features/requests.html.js"), meta: {"title":"请求处理"} }],
  ["/guide/features/routing.html", { loader: () => import(/* webpackChunkName: "guide_features_routing.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/features/routing.html.js"), meta: {"title":"路由管理"} }],
  ["/guide/features/runtime.html", { loader: () => import(/* webpackChunkName: "guide_features_runtime.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/features/runtime.html.js"), meta: {"title":"运行时初始化"} }],
  ["/guide/features/state-management.html", { loader: () => import(/* webpackChunkName: "guide_features_state-management.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/features/state-management.html.js"), meta: {"title":"状态管理"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
  ["/examples/requests.html", { loader: () => import(/* webpackChunkName: "examples_requests.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/requests.html.js"), meta: {"title":"请求处理示例"} }],
  ["/examples/logging.html", { loader: () => import(/* webpackChunkName: "examples_logging.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/logging.html.js"), meta: {"title":"日志示例"} }],
  ["/examples/comprehensive.html", { loader: () => import(/* webpackChunkName: "examples_comprehensive.html" */"/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/comprehensive.html.js"), meta: {"title":"综合示例"} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
