import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/routing.html.vue"
const data = JSON.parse("{\"path\":\"/examples/routing.html\",\"title\":\"路由示例\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"examples/routing.md\"}")
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
