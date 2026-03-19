import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const createCodeBlockHTML = (code: string, lang?: string): string => {
  const displayLang = lang || 'text'
  const headerHTML = `
    <div class="code-header">
      <span class="code-lang">${displayLang}</span>
      <div class="code-actions">
        <button class="code-action-btn" data-action="copy" data-tooltip="复制">
          <img src="/src/assets/photo/复制.png" alt="copy" />
        </button>
        <button class="code-action-btn" data-action="theme" data-tooltip="切换主题">
          <img src="/src/assets/photo/暗黑模式.png" alt="theme"
               data-light-icon="/src/assets/photo/明亮模式.png"
               data-dark-icon="/src/assets/photo/暗黑模式.png" />
        </button>
      </div>
    </div>
  `

  return `<div class="code-block">${headerHTML}<pre class="hljs"><code>${code}</code></pre></div>`
}

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        return createCodeBlockHTML(highlighted, lang)
      } catch (error) {
        console.warn('Highlight.js failed for language:', lang, error)
      }
    }

    const escapedCode = md.utils.escapeHtml(str)
    return createCodeBlockHTML(escapedCode, lang || undefined)
  },
})

export const renderMarkdown = (content: string): string => {
  if (!content) return ''
  return md.render(content)
}

export { md }
