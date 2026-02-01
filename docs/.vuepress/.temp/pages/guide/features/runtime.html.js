import comp from "/home/john/workspace/nucleusx-core-docs/docs/.vuepress/.temp/pages/guide/features/runtime.html.vue"
const data = JSON.parse("{\"path\":\"/guide/features/runtime.html\",\"title\":\"运行时初始化\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"guide/features/runtime.md\"}")
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
