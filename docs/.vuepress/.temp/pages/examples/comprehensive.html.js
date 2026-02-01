import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/comprehensive.html.vue"
const data = JSON.parse("{\"path\":\"/examples/comprehensive.html\",\"title\":\"综合示例\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"examples/comprehensive.md\"}")
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
