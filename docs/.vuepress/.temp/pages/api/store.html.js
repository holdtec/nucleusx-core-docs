import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/api/store.html.vue"
const data = JSON.parse("{\"path\":\"/api/store.html\",\"title\":\"状态管理 API\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"api/store.md\"}")
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
