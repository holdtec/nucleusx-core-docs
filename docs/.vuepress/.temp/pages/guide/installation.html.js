import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/installation.html.vue"
const data = JSON.parse("{\"path\":\"/guide/installation.html\",\"title\":\"安装指南\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"guide/installation.md\"}")
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
