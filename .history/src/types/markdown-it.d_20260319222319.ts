declare module 'markdown-it' {
  interface MarkdownItOptions {
    html?: boolean
    breaks?: boolean
    linkify?: boolean
    highlight?: (str: string, lang: string) => string
    [key: string]: any
  }

  interface MarkdownIt {
    render(text: string): string
    utils: {
      escapeHtml(str: string): string
    }
    use(plugin: any, options?: any): void
  }

  interface MarkdownItConstructor {
    new (options?: MarkdownItOptions): MarkdownIt
  }

  const MarkdownIt: MarkdownItConstructor
  export default MarkdownIt
}

declare module 'markdown-it-link-attributes' {
  const mdLinkAttributes: any
}

declare module 'markdown-it-emoji' {
  const emoji: any
  const full: any
  export { emoji, full }
}
