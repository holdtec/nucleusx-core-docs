export const siteData = JSON.parse("{\"base\":\"/nucleusx-core-docs/\",\"lang\":\"en-US\",\"title\":\"NucleusX-Core 文档\",\"description\":\"NucleusX 运行时核心库文档\",\"head\":[[\"meta\",{\"name\":\"application-name\",\"content\":\"NucleusX-Core 文档\"}],[\"meta\",{\"name\":\"mobile-web-app-capable\",\"content\":\"yes\"}],[\"meta\",{\"name\":\"theme-color\",\"content\":\"#3eaf7c\"}],[\"meta\",{\"name\":\"apple-mobile-web-app-status-bar-style\",\"content\":\"black\"}],[\"link\",{\"rel\":\"icon\",\"href\":\"/nucleusx-core-docs/favicon.ico\"}],[\"link\",{\"rel\":\"manifest\",\"href\":\"/nucleusx-core-docs/manifest.webmanifest\",\"crossorigin\":\"use-credentials\"}],[\"link\",{\"rel\":\"apple-touch-icon\",\"href\":\"/nucleusx-core-docs/assets/img/apple-icon-152.png\"}]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
