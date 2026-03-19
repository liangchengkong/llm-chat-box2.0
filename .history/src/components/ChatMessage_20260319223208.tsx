import { useState, useEffect, useCallback } from 'react'
import { renderMarkdown } from '@/utils/markdown'
import type { Message, FileItem } from '@/types'
import type { Message, FileItem } from '@/types'

interface ChatMessageProps {
  message: Message
  isLastAssistantMessage: boolean
  onRegenerate: () => void
}

function ChatMessage({ message, isLastAssistantMessage, onRegenerate }: ChatMessageProps) {
//   console.log('=== ChatMessage render ===')
//   console.log('Message props:', message)
//   console.log('Message content:', message.content)
//   console.log('Message loading:', message.loading)

  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(true)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2500)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const handleLike = () => {
    if (isDisliked) setIsDisliked(false)
    setIsLiked(!isLiked)
  }

  const handleDislike = () => {
    if (isLiked) setIsLiked(false)
    setIsDisliked(!isDisliked)
  }

  const handleRegenerateClick = () => {
    onRegenerate()
  }

  const handleCodeCopy = useCallback(async (event: Event) => {
    const codeBlock = (event.target as HTMLElement).closest('.code-block')
    const code = codeBlock?.querySelector('code')?.textContent

    if (code) {
      try {
        await navigator.clipboard.writeText(code)
      } catch (err) {
        console.error('复制失败:', err)
      }
    }
  }, [])

  const handleThemeToggle = useCallback((event: Event) => {
    const codeBlock = (event.target as HTMLElement).closest('.code-block')
    const themeBtn = (event.target as HTMLElement).closest('[data-action="theme"]')
    const themeIcon = themeBtn?.querySelector('img') as HTMLImageElement
    const lightIcon = themeIcon?.dataset.lightIcon
    const darkIcon = themeIcon?.dataset.darkIcon

    if (codeBlock && themeIcon && lightIcon && darkIcon) {
      codeBlock.classList.toggle('dark-theme')
      themeIcon.src = codeBlock.classList.contains('dark-theme') ? lightIcon : darkIcon
    }
  }, [])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if ('addedNodes' in mutation) {
          const codeBlocks = document.querySelectorAll('.code-block')
          codeBlocks.forEach((block) => {
            const copyBtn = block.querySelector('[data-action="copy"]')
            const themeBtn = block.querySelector('[data-action="theme"]')

            if (copyBtn && !(copyBtn as HTMLElement & { _hasListener?: boolean })._hasListener) {
              copyBtn.addEventListener('click', handleCodeCopy)
              ;(copyBtn as HTMLElement & { _hasListener?: boolean })._hasListener = true
            }
            if (themeBtn && !(themeBtn as HTMLElement & { _hasListener?: boolean })._hasListener) {
              themeBtn.addEventListener('click', handleThemeToggle)
              ;(themeBtn as HTMLElement & { _hasListener?: boolean })._hasListener = true
            }
          })
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      const codeBlocks = document.querySelectorAll('.code-block')
      codeBlocks.forEach((block) => {
        const copyBtn = block.querySelector('[data-action="copy"]')
        const themeBtn = block.querySelector('[data-action="theme"]')
        if (copyBtn) {
          copyBtn.removeEventListener('click', handleCodeCopy)
        }
        if (themeBtn) {
          themeBtn.removeEventListener('click', handleThemeToggle)
        }
      })
    }
  }, [handleCodeCopy, handleThemeToggle])
  const renderedContent = renderMarkdown(message.content)
  const renderedReasoning = message.reasoning_content ? renderMarkdown(message.reasoning_content) : ''

  console.log('Rendered content:', renderedContent)
  console.log('Rendered reasoning:', renderedReasoning)

  return (
    <div className={`message-item ${message.role === 'user' ? 'is-mine' : ''}`}>
      <div className="content">
        {message.files && message.files.length > 0 && (
          <div className="files-container">
            {message.files.map((file: FileItem) => (
              <div key={file.url} className="file-item">
                {file.type === 'image' ? (
                  <div className="image-preview">
                    <img src={file.url} alt={file.name} />
                  </div>
                ) : (
                  <div className="file-preview">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(1)}KB</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {message.loading && message.role === 'assistant' && (
          <div className="thinking-text">
            <img src="/src/assets/photo/加载中.png" alt="loading" className="loading-icon" />
            <span>内容生成中...</span>
          </div>
        )}

        {message.reasoning_content && (
          <div className="reasoning-toggle" onClick={() => setIsReasoningExpanded(!isReasoningExpanded)}>
            <img src="/src/assets/photo/深度思考.png" alt="thinking" />
            <span>深度思考</span>
            <svg className={`toggle-icon ${isReasoningExpanded ? 'is-expanded' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        )}

        {message.reasoning_content && isReasoningExpanded && (
          <div className="reasoning markdown-body" dangerouslySetInnerHTML={{ __html: renderedReasoning }}></div>
        )}

        <div className="bubble markdown-body" dangerouslySetInnerHTML={{ __html: renderedContent }}></div>

        {message.role === 'assistant' && !message.loading && (
          <div className="message-actions">
            {isLastAssistantMessage && (
              <button className="action-btn" onClick={handleRegenerateClick} data-tooltip="重新生成">
                <img src="/src/assets/photo/重新生成.png" alt="regenerate" />
              </button>
            )}
            <button className="action-btn" onClick={handleCopy} data-tooltip="复制">
              <img src={isCopied ? "/src/assets/photo/成功.png" : "/src/assets/photo/复制.png"} alt="copy" />
            </button>
            <button className="action-btn" onClick={handleLike} data-tooltip="喜欢">
              <img src={isLiked ? "/src/assets/photo/赞2.png" : "/src/assets/photo/赞.png"} alt="like" />
            </button>
            <button className="action-btn" onClick={handleDislike} data-tooltip="不喜欢">
              <img src={isDisliked ? "/src/assets/photo/踩2.png" : "/src/assets/photo/踩.png"} alt="dislike" />
            </button>

            {message.completion_tokens && (
              <span className="tokens-info">
                tokens: {message.completion_tokens}, speed: {message.speed} tokens/s
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
