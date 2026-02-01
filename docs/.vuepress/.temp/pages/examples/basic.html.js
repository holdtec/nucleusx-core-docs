import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/examples/basic.html.vue"
const data = JSON.parse("{\"path\":\"/examples/basic.html\",\"title\":\"基础示例\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"examples/basic.md\"}")
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
