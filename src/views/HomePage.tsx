import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchDialog from '@/components/SearchDialog'
import styles from './HomePage.module.scss'

function HomePage() {
  const [showSearchDialog, setShowSearchDialog] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSearchClick = () => {
    setShowSearchDialog(true)
  }

  const handleOverlayClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains(styles['search-dialog-overlay'])) {
      setShowSearchDialog(false)
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (!showSearchDialog) return

    const searchDialog = document.querySelector('.search-dialog')
    if (
      searchDialog &&
      !searchDialog.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest('.search-container')
    ) {
      setShowSearchDialog(false)
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowSearchDialog(false)
    }
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      setShowSearchDialog(true)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [handleClickOutside, handleKeydown])

  return (
    <div className={styles['home-page']}>
      <header className={styles.header}>
        <div className={styles['header-left']}>
          <span className={styles['logo-text']}>LLM Chat</span>
        </div>
        <div className={styles['header-right']}>
          <div className={styles['search-container']} onClick={handleSearchClick}>
            <div className={styles['search-input']}>
              <svg className={styles['search-icon']} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="搜索" readOnly />
              <div className={styles['shortcut-key']}>⌘ K</div>
            </div>
          </div>
          <a href="https://github.com/Solomon-He/LLM-chat" target="_blank" className={styles['github-link']}>
            <img src="/src/assets/photo/github.png" alt="GitHub" className={styles['github-icon']} />
          </a>
        </div>
      </header>

      <main className={styles['main-content']}>
        <div className={styles['hero-section']}>
          <h1 className={styles.title}>欢迎使用 LLM Chat</h1>
          <p className={styles.description}>一个强大的 AI 聊天助手，基于大语言模型，为您提供智能对话体验</p>
          <div className={styles.features}>
            <div className={styles['feature-item']}>
              <svg className={styles['feature-icon']} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h3>智能对话</h3>
              <p>自然流畅的对话体验，理解上下文</p>
            </div>
            <div className={styles['feature-item']}>
              <svg className={styles['feature-icon']} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <h3>文件支持</h3>
              <p>支持多种格式文件上传，增强信息输入</p>
              <p className={styles.note}>注意：由于接口限制，后台无法读取到文件内容</p>
            </div>
            <div className={styles['feature-item']}>
              <svg className={styles['feature-icon']} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <h3>个性化设置</h3>
              <p>可自定义的对话参数，满足不同场景需求</p>
              <p className={styles.note} style={{ color: '#3f7af1' }}>支持 deepseek_r1 模型</p>
            </div>
          </div>
          <button className={styles['start-button']} onClick={() => navigate('/chat')}>
            <span className={styles['mirror-text']}>开始对话</span>
            <div className={styles.liquid}></div>
          </button>
        </div>
      </main>

      {showSearchDialog && (
        <div className={styles['search-dialog-overlay']} onClick={handleOverlayClick}>
          <div className={styles['search-dialog-container']} onClick={(e) => e.stopPropagation()}>
            <SearchDialog onClose={() => setShowSearchDialog(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
