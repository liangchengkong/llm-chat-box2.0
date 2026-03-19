import { useState, useImperativeHandle, forwardRef } from 'react'
import { useChatStore } from '@/stores/chat'

export interface DialogEditRef {
  openDialog: (conversationId: string, type: 'edit' | 'delete') => void
}

const DialogEdit = forwardRef<DialogEditRef>((_, ref) => {
  const [dialogVisible, setDialogVisible] = useState(false)
  const [inputTitle, setInputTitle] = useState('')
  const [dialogType, setDialogType] = useState<'edit' | 'delete'>('edit')
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const chatStore = useChatStore()

  useImperativeHandle(ref, () => ({
    openDialog: (conversationId: string, type: 'edit' | 'delete' = 'edit') => {
      setCurrentConversationId(conversationId)
      setDialogType(type)

      if (type === 'edit') {
        const conversation = chatStore.conversations.find((c) => c.id === conversationId)
        setInputTitle(conversation?.title || '')
      }

      setDialogVisible(true)
    }
  }))

  const handleConfirm = () => {
    if (dialogType === 'edit') {
      if (!inputTitle.trim()) {
        return
      }
      chatStore.updateConversationTitle(currentConversationId!, inputTitle.trim())
    } else {
      chatStore.deleteConversation(currentConversationId!)
    }
    setDialogVisible(false)
    setInputTitle('')
  }

  const handleCancel = () => {
    setDialogVisible(false)
    setInputTitle('')
  }

  return (
    <div className={`dialog-overlay ${dialogVisible ? 'visible' : ''}`}>
      <div className="dialog-container">
        <div className="dialog-header">
          <h3>{dialogType === 'edit' ? '编辑对话名称' : '确定删除对话?'}</h3>
          <button className="close-btn" onClick={handleCancel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="dialog-body">
          {dialogType === 'edit' ? (
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="请输入对话名称"
              maxLength={50}
              className="dialog-input"
            />
          ) : (
            <div className="delete-warning">
              <svg className="warning-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0-1.71 1.71l12 12a2 2 0 0 2.83 0l-12-12a2 2 0 0 0-1.42-1.71z" />
                <line x1="12" y1="9" x2="12" y2="21" />
              </svg>
              <span>删除后，聊天记录将不可恢复。</span>
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button className="btn btn-secondary" onClick={handleCancel}>取消</button>
          <button
            className={`btn ${dialogType === 'edit' ? 'btn-primary' : 'btn-danger'}`}
            onClick={handleConfirm}
          >
            {dialogType === 'edit' ? '确定' : '删除'}
          </button>
        </div>
      </div>
    </div>
  )
})

DialogEdit.displayName = 'DialogEdit'

export default DialogEdit
