import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/logging.html.vue"
const data = JSON.parse("{\"path\":\"/examples/logging.html\",\"title\":\"日志示例\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"examples/logging.md\"}")
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
