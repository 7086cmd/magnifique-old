// import MarkdownIt from 'markdown-it'
// import MarkdownItLatex from 'markdown-it-latex'
// import MarkdownItKatex from 'markdown-it-katex'
// import MarkdownItContainer from 'markdown-it-container'
// // import MarkdownItMermaid from 'markdown-it-mermaid'
// import MarkdownItSub from 'markdown-it-sub'
// import MarkdownItSup from 'markdown-it-sup'
// import MarkdownItDeflist from 'markdown-it-deflist'
// import MarkdownItFootnote from 'markdown-it-footnote'
// import MarkdownItMark from 'markdown-it-mark'

// const md = new MarkdownIt()
// md.use(MarkdownItLatex)
// md.use(MarkdownItKatex)
// md.use(MarkdownItContainer)
// // md.use(MarkdownItMermaid)
// md.use(MarkdownItSub)
// md.use(MarkdownItSup)
// md.use(MarkdownItDeflist)
// md.use(MarkdownItFootnote)
// md.use(MarkdownItMark)

// const createMarkdownParser = (content: string) => {
//   return md.render(content)
// }

// export { createMarkdownParser }

import { Remarkable } from 'remarkable'

const md = new Remarkable({
  html: true,
  breaks: true,
})
md.inline.ruler.enable(['sub', 'sup', 'ins', 'mark'])
md.block.ruler.disable(['table'])
md.block.ruler.enable(['footnote', 'deflist'])
const createMarkdownParser = (content: string) => {
  const result = md
    .render(content)
    .replaceAll('<script', '&lt;script')
    .replaceAll('</script', '&lt;/script')
    .replaceAll('<style', '&lt;style')
    .replaceAll('<meta', '&lt;meta')
    .replaceAll('<link', '&lt;link')
    .replaceAll('</style', '&lt;/style')
    .replaceAll('</meta', '&lt;/meta')
    .replaceAll('</link', '&lt;/link')
  return result
}

export { createMarkdownParser }
