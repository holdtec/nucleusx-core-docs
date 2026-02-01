import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/core.html.vue"
const data = JSON.parse("{\"path\":\"/api/core.html\",\"title\":\"核心模块 API\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"api/core.md\"}")
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
