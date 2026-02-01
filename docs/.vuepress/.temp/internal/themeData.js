export const themeData = JSON.parse("{\"logo\":null,\"repo\":\"https://github.com/nucleusx/core\",\"docsDir\":\"docs\",\"navbar\":[{\"text\":\"首页\",\"link\":\"/\"},{\"text\":\"指南\",\"link\":\"/guide/\"},{\"text\":\"API\",\"link\":\"/api/\"},{\"text\":\"示例\",\"link\":\"/examples/\"},{\"text\":\"GitHub\",\"link\":\"https://github.com/nucleusx/core\"}],\"sidebar\":{\"/guide/\":[{\"text\":\"指南\",\"children\":[\"/guide/README.md\",\"/guide/getting-started.md\",\"/guide/installation.md\",\"/guide/configuration.md\"]},{\"text\":\"功能详解\",\"children\":[\"/guide/features/README.md\",\"/guide/features/concepts.md\",\"/guide/features/architecture.md\",\"/guide/features/runtime.md\",\"/guide/features/routing.md\",\"/guide/features/state-management.md\",\"/guide/features/requests.md\",\"/guide/features/logging.md\",\"/guide/features/best-practices.md\",\"/guide/features/faq.md\"]},{\"text\":\"法律与授权\",\"children\":[\"/guide/license.md\"]}],\"/api/\":[{\"text\":\"API 参考\",\"children\":[\"/api/README.md\",\"/api/core.md\",\"/api/router.md\",\"/api/store.md\",\"/api/request.md\",\"/api/logger.md\"]}],\"/examples/\":[{\"text\":\"示例代码\",\"children\":[\"/examples/README.md\",\"/examples/basic.md\",\"/examples/routing.md\",\"/examples/state-management.md\",\"/examples/requests.md\",\"/examples/logging.md\",\"/examples/comprehensive.md\"]}]},\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
