import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"首页\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"title\":\"首页\",\"hero\":{\"name\":\"NucleusX-Core\",\"text\":\"运行时核心库\",\"tagline\":\"面向中大型、多端、长生命周期应用的业务逻辑治理方案\",\"actions\":[{\"text\":\"快速开始\",\"link\":\"/guide/getting-started.html\",\"type\":\"primary\"},{\"text\":\"API 参考\",\"link\":\"/api/\",\"type\":\"secondary\"}]},\"features\":[{\"title\":\"业务逻辑去平台化\",\"details\":\"业务代码不直接依赖 UI/平台 API，提升可移植性\"},{\"title\":\"统一运行时上下文\",\"details\":\"请求、状态、日志等能力通过统一入口访问\"},{\"title\":\"可配置式集成\",\"details\":\"根据运行环境注入不同实现，无需修改业务代码\"},{\"title\":\"适合复杂业务流程\",\"details\":\"支持多页面、多步骤、跨端一致的业务流程管理\"},{\"title\":\"虚拟路由引擎\",\"details\":\"突破原生页面栈限制，实现纯净的 SPA 导航\"},{\"title\":\"企业级治理\",\"details\":\"专为长期演进、多人协作、跨端运行的企业级项目设计\"}],\"footer\":\"Copyright © 2026 NucleusX | 商业授权联系 contact@nucleusx.dev\"},\"git\":{\"updatedTime\":1769923550000,\"contributors\":[{\"name\":\"John Wu\",\"username\":\"\",\"email\":\"whitehatgo@gmail.com\",\"commits\":1}],\"changelog\":[{\"hash\":\"86637f8f9aa7c0c500284712378c01ffec0a9b6a\",\"time\":1769923550000,\"email\":\"whitehatgo@gmail.com\",\"author\":\"John Wu\",\"message\":\"feat: 初始化 NucleusX-Core 文档项目\"}]},\"filePathRelative\":\"README.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
