import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/index.html.vue"
const data = JSON.parse("{\"path\":\"/api/\",\"title\":\"API 参考\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{\"updatedTime\":1769923550000,\"contributors\":[{\"name\":\"John Wu\",\"username\":\"\",\"email\":\"whitehatgo@gmail.com\",\"commits\":1}],\"changelog\":[{\"hash\":\"86637f8f9aa7c0c500284712378c01ffec0a9b6a\",\"time\":1769923550000,\"email\":\"whitehatgo@gmail.com\",\"author\":\"John Wu\",\"message\":\"feat: 初始化 NucleusX-Core 文档项目\"}]},\"filePathRelative\":\"api/README.md\"}")
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
