declare module 'markdown-it' {
  interface MarkdownItOptions {
    html?: boolean
    breaks?: boolean
    linkify?: boolean
    highlight?: (str: string, lang: string) => string
    [key: string]: unknown
  }

  interface MarkdownIt {
    render(text: string): string
    utils: {
      escapeHtml(str: string): string
    }
    use(plugin: (md: MarkdownIt, options?: Record<string, unknown>) => void, options?: Record<string, unknown>): void
  }

  interface MarkdownItConstructor {
    new (options?: MarkdownItOptions): MarkdownIt
  }

  const MarkdownIt: MarkdownItConstructor
  export default MarkdownIt
}

declare module 'markdown-it-link-attributes' {
  const mdLinkAttributes: (md: unknown, options?: Record<string, unknown>) => void
  export default mdLinkAttributes
}

declare module 'markdown-it-emoji' {
  const emoji: (md: unknown, options?: Record<string, unknown>) => void
  const full: (md: unknown, options?: Record<string, unknown>) => void
  export { emoji, full }
}
