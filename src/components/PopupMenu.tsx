import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react'
import { useChatStore } from '@/stores/chat'
import DialogEdit from './DialogEdit'

interface PopupMenuRef {
  openDialog: (conversationId: string, type: 'edit' | 'delete') => void
}

const PopupMenu = forwardRef<PopupMenuRef>((_, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const chatStore = useChatStore()
  const dialogEdit = useRef<PopupMenuRef>(null)

  useImperativeHandle(ref, () => ({
    openDialog: (conversationId: string, type: 'edit' | 'delete') => {
      dialogEdit.current?.openDialog(conversationId, type)
    }
  }))

  const toggle = useCallback(() => {
    setIsVisible(!isVisible)
  }, [isVisible])

  const handleNewChat = useCallback(() => {
    chatStore.createConversation()
    setIsVisible(false)
  }, [chatStore])

  const handleClearAll = useCallback(() => {
    if (window.confirm('确定要清空所有对话吗？')) {
      chatStore.resetStore()
      setIsVisible(false)
    }
  }, [chatStore])

  const handleSwitchChat = useCallback((conversationId: string) => {
    chatStore.switchConversation(conversationId)
    setIsVisible(false)
  }, [chatStore])

  const formatTitle = useCallback((title: string) => {
    return title.length > 4 ? title.slice(0, 4) + '...' : title
  }, [])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const wrapper = document.querySelector('.popup-wrapper')
    if (wrapper && !wrapper.contains(event.target as Node)) {
      setIsVisible(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <div className="popup-wrapper">
      <button className="action-btn" onClick={toggle}>
        <img src="/src/assets/photo/弹出框.png" alt="" />
      </button>
      {isVisible && (
        <div className="popup-menu">
          <div className="menu-section">
            <button className="new-chat-btn" onClick={handleNewChat}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              新对话
            </button>
          </div>
          <div className="divider"></div>
          <div className="menu-section">
            <div className="section-title">历史对话</div>
            <div className="history-list">
              {chatStore.conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`menu-item ${conversation.id === chatStore.currentConversationId ? 'active' : ''}`}
                  onClick={() => handleSwitchChat(conversation.id)}
                >
                  <div className="item-content">
                    <img src="/src/assets/photo/对话.png" alt="" />
                    <span title={conversation.title}>{formatTitle(conversation.title)}</span>
                  </div>
                  <div className="item-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        dialogEdit.current?.openDialog(conversation.id, 'edit')
                      }}
                    >
                      <img src="/src/assets/photo/编辑.png" alt="edit" />
                    </button>
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        dialogEdit.current?.openDialog(conversation.id, 'delete')
                      }}
                    >
                      <img src="/src/assets/photo/删除.png" alt="delete" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="menu-section">
            <button className="clear-all-btn" onClick={handleClearAll}>
              <img src="/src/assets/photo/删除.png" alt="" />
              清空所有对话
            </button>
          </div>
        </div>
      )}
      <DialogEdit ref={dialogEdit} />
    </div>
  )
})

PopupMenu.displayName = 'PopupMenu'

export default PopupMenu
