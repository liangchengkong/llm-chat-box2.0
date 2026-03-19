import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatStore } from '@/stores/chat'
import { messageHandler } from '@/utils/messageHandler'
import { createChatCompletion } from '@/utils/api'
import { useSettingStore } from '@/stores/setting'
import ChatInput, { ChatInputRef } from '../components/ChatInput'
import ChatMessage from '../components/ChatMessage'
import PopupMenu from '../components/PopupMenu'
import DialogEdit from '../components/DialogEdit'
import SettingsPanel from '../components/SettingsPanel'

function ChatView() {
  const navigate = useNavigate()
  const chatStore = useChatStore()
  const settingStore = useSettingStore()
  const messagesContainer = useRef<HTMLDivElement>(null)
  const settingDrawerRef = useRef<{ openDrawer: () => void } | null>(null)
  const popupMenuRef = useRef<{ openDialog: (conversationId: string, type: 'edit' | 'delete') => void } | null>(null)
  const dialogEditRef = useRef<{ openDialog: (conversationId: string, type: 'edit' | 'delete') => void } | null>(null)
  const isInitialized = useRef(false)
  const chatInputRef = useRef<ChatInputRef | null>(null)

  const currentConversation = chatStore.getCurrentConversation()
  const currentMessages = chatStore.getCurrentMessages()

  const scrollToBottom = useCallback(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
    if (!isInitialized.current && currentMessages.length === 0 && chatStore.conversations.length === 0) {
      chatStore.createConversation()
      isInitialized.current = true
    }
  }, [currentMessages, chatStore.isLoading, scrollToBottom, chatStore, chatStore.conversations.length])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SET_INPUT_VALUE' && chatInputRef.current) {
        chatInputRef.current.setInputValue(event.data.value)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  useEffect(() => {
    const conversations = chatStore.conversations
    const ids = conversations.map(c => c.id)
    const uniqueIds = new Set(ids)
    if (ids.length !== uniqueIds.size) {
      console.warn('检测到重复的对话 ID，正在修复...')
      chatStore.resetStore()
    }
  }, [])

  const handleSend = useCallback(async (messageContent: { text: string; files: any[] }) => {
    try {
      const userMessage = messageHandler.formatMessage('user', messageContent.text, '', messageContent.files)
      chatStore.addMessage(userMessage)

      const assistantMessage = messageHandler.formatMessage('assistant', '', '')
      chatStore.addMessage(assistantMessage)

      chatStore.setIsLoading(true)

      const messages = [
        { role: 'user' as const, content: messageContent.text }
      ]

      if (messages.length === 0) {
        chatStore.updateLastMessage('请输入有效的内容。', '', 0, '0')
        return
      }

      const response = await createChatCompletion(messages, settingStore.settings)

      await messageHandler.handleResponse(
        response,
        settingStore.settings.stream,
        (content, reasoning_content, tokens, speed) => {
          chatStore.updateLastMessage(content, reasoning_content, tokens, speed)
        }
      )
    } catch (error) {
      console.error('Failed to send message:', error)
      chatStore.updateLastMessage('抱歉，发生了一些错误，请稍后重试。', '', 0, '0')
    } finally {
      chatStore.setIsLoading(false)
    }
  }, [chatStore, settingStore])

  const handleRegenerate = useCallback(async () => {
    if (currentMessages.length === 0) return

    const lastUserMessage = [...currentMessages].reverse().find((msg) => msg.role === 'user')
    if (!lastUserMessage) return

    const newMessages = currentMessages.slice(0, -1)
    chatStore.setCurrentMessages(newMessages)

    await handleSend({ text: lastUserMessage.content, files: lastUserMessage.files || [] })
  }, [currentMessages, chatStore, handleSend])

  const handleNewChat = useCallback(() => {
    chatStore.createConversation()
  }, [chatStore])

  const currentTitle = currentConversation?.title || 'LLM Chat'

  const formatTitle = useCallback((title: string) => {
    return title.length > 4 ? title.slice(0, 4) + '...' : title
  }, [])

  const handleBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <PopupMenu ref={popupMenuRef as any} />
          <button className="new-chat-btn" onClick={handleNewChat}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            新对话
          </button>
          <div className="divider"></div>
          <div className="title-wrapper">
            <h1 className="chat-title">{formatTitle(currentTitle)}</h1>
            <button
              className="edit-btn"
              onClick={() => dialogEditRef.current?.openDialog(chatStore.currentConversationId, 'edit')}
            >
              <img src="/src/assets/photo/编辑.png" alt="edit" />
            </button>
          </div>
        </div>

        <div className="header-right">
          <button className="action-btn" onClick={() => settingDrawerRef.current?.openDrawer()}>
            <img src="/src/assets/photo/设置.png" alt="settings" />
          </button>
          <button className="action-btn" onClick={handleBack}>
            <img src="/src/assets/photo/返回.png" alt="back" />
          </button>
        </div>
      </div>

      <div className="messages-container" ref={messagesContainer}>
        {currentMessages.length > 0 ? (
          currentMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLastAssistantMessage={index === currentMessages.length - 1 && message.role === 'assistant'}
              onRegenerate={handleRegenerate}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <img src="/src/assets/photo/对话.png" alt="chat" className="empty-icon" />
              <h2>开始对话吧</h2>
              <p>有什么想和我聊的吗？</p>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <ChatInput ref={chatInputRef} loading={chatStore.isLoading} onSend={handleSend} />
      </div>

      <SettingsPanel ref={settingDrawerRef as any} />
      <DialogEdit ref={dialogEditRef as any} />
    </div>
  )
}

export default ChatView
