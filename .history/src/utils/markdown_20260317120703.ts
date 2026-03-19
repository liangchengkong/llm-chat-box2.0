import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import mdLinkAttributes from 'markdown-it-link-attributes'
import { full as emoji } from 'markdown-it-emoji'
import 'highlight.js/styles/atom-one-dark.css'
import copyIcon from '@/assets/photo/复制.png'
import darkIcon from '@/assets/photo/暗黑模式.png'
import lightIcon from '@/assets/photo/明亮模式.png'

const md: MarkdownIt = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        return `<div class="code-block"><div class="code-header"><span class="code-lang">${lang}</span><div class="code-actions"><button class="code-action-btn" data-action="copy" data-tooltip="复制"><img src="${copyIcon}" alt="copy" /></button><button class="code-action-btn" data-action="theme" data-tooltip="切换主题"><img src="${darkIcon}" alt="theme" data-light-icon="${lightIcon}" data-dark-icon="${darkIcon}" /></button></div></div><pre class="hljs"><code>${highlighted}</code></pre></div>`
      } catch (__) {}
    }
    return `<div class="code-block"><div class="code-header"><span class="code-lang">text</span><div class="code-actions"><button class="code-action-btn" data-action="copy" data-tooltip="复制"><img src="${copyIcon}" alt="copy" /></button><button class="code-action-btn" data-action="theme" data-tooltip="切换主题"><img src="${darkIcon}" alt="theme" data-light-icon="${lightIcon}" data-dark-icon="${darkIcon}" /></button></div></div><pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre></div>`
  },
})

md.use(mdLinkAttributes, {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
})

md.use(emoji)

export const renderMarkdown = (content: string) => {
  if (!content) return ''
  return md.render(content)
}

export { md }
