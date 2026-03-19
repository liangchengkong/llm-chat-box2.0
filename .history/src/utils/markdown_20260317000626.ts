import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const md = new (MarkdownIt as any)({
  html: true,
  breaks: true,
  linkify: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        return `<div class="code-block"><div class="code-header"><span class="code-lang">${lang}</span><div class="code-actions"><button class="code-action-btn" data-action="copy" data-tooltip="复制"><img src="/src/assets/photo/复制.png" alt="copy" /></button><button class="code-action-btn" data-action="theme" data-tooltip="切换主题"><img src="/src/assets/photo/暗黑模式.png" alt="theme" data-light-icon="/src/assets/photo/明亮模式.png" data-dark-icon="/src/assets/photo/暗黑模式.png" /></button></div></div><pre class="hljs"><code>${highlighted}</code></pre></div>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${(md as any).utils.escapeHtml(str)}</code></pre>`
  },
})

export const renderMarkdown = (content: string) => {
  if (!content) return ''
  return md.render(content)
}

export { md }
