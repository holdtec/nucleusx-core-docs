import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/request.html.vue"
const data = JSON.parse("{\"path\":\"/api/request.html\",\"title\":\"请求模块 API\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"api/request.md\"}")
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
