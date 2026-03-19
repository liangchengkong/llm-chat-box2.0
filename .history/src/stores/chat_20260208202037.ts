import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Conversation, Message } from '@/types'

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string
  isLoading: boolean
  addMessage: (message: Message) => void
  setIsLoading: (value: boolean) => void
  updateLastMessage: (content: string, reasoning_content: string, completion_tokens: number, speed: string, loading?: boolean) => void
  getLastMessage: () => Message | null
  createConversation: () => void
  switchConversation: (conversationId: string) => void
  updateConversationTitle: (conversationId: string, newTitle: string) => void
  deleteConversation: (conversationId: string) => void
  setCurrentMessages: (messages: Message[]) => void
  getCurrentConversation: () => Conversation | undefined
  getCurrentMessages: () => Message[]
  resetStore: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [
        {
          id: '1',
          title: '日常问候',
          messages: [],
          createdAt: Date.now(),
        },
      ],
      currentConversationId: '1',
      isLoading: false,

      addMessage: (message: any) =>
        set((state) => {
          const newConversations = state.conversations.map((conv) => {
            if (conv.id === state.currentConversationId) {
              const newMessages = [
                ...conv.messages,
                {
                  ...message,
                  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  timestamp: new Date().toISOString(),
                },
              ]
              return { ...conv, messages: newMessages }
            }
            return conv
          })
          return { conversations: newConversations }
        }),

      setIsLoading: (value) => set({ isLoading: value }),

      updateLastMessage: (content: string, reasoning_content: string, completion_tokens: number, speed: string, loading?: boolean) =>
       set((state) => {
         const newConversations = state.conversations.map((conv) => {
           if (conv.id === state.currentConversationId && conv.messages.length > 0) {
             const newMessages = [...conv.messages]
             const lastIndex = newMessages.length - 1
             newMessages[lastIndex] = {
               ...newMessages[lastIndex],
               content,
               reasoning_content,
               completion_tokens,
               speed,
               ...(loading !== undefined && { loading }),
             }
             return { ...conv, messages: newMessages }
           }
           return conv
         })
         return { conversations: newConversations }
       }),

      getLastMessage: () => {
        const state = get()
        const currentConv = state.conversations.find((conv) => conv.id === state.currentConversationId)
        if (currentConv && currentConv.messages.length > 0) {
          return currentConv.messages[currentConv.messages.length - 1]
        }
        return null
      },

      getCurrentConversation: () => {
        const state = get()
        return state.conversations.find((conv) => conv.id === state.currentConversationId)
      },

      getCurrentMessages: () => {
        const state = get()
        const currentConv = state.conversations.find((conv) => conv.id === state.currentConversationId)
        const messages = currentConv?.messages || []
        return messages
      },

      createConversation: () =>
        set((state) => {
           const timestamp = Date.now()
           const newConversation: Conversation = {
             id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
             title: '日常问候',
             messages: [],
             createdAt: timestamp,
           }
           return {
             conversations: [newConversation, ...state.conversations],
             currentConversationId: newConversation.id,
           }
        }),

      switchConversation: (conversationId) => set({ currentConversationId: conversationId }),

      updateConversationTitle: (conversationId, newTitle) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, title: newTitle } : conv
          ),
        })),

      deleteConversation: (conversationId) =>
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== conversationId)
          if (newConversations.length === 0) {
             const timestamp = Date.now()
            const newConversation: Conversation = {
              id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
              title: '日常问候',
              messages: [],
              createdAt: timestamp,
            }
            return {
              conversations: [newConversation],
              currentConversationId: newConversation.id,
            }
          }
          if (conversationId === state.currentConversationId) {
            return {
              conversations: newConversations,
              currentConversationId: newConversations[0].id,
            }
          }
          return { conversations: newConversations }
        }),

      setCurrentMessages: (messages) =>
        set((state) => {
          const newConversations = state.conversations.map((conv) => {
            if (conv.id === state.currentConversationId) {
              return { ...conv, messages }
            }
            return conv
          })
          return { conversations: newConversations }
        }),

      resetStore: () =>
        set(() => ({
          conversations: [
            {
              id: '1',
              title: '日常问候',
              messages: [],
              createdAt: Date.now(),
            },
          ],
          currentConversationId: '1',
          isLoading: false,
        })),
    }),
    {
      name: 'llm-chat-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.conversations) {
          const uniqueConversations = state.conversations.filter((conv, index, self) =>
            index === self.findIndex((c) => c.id === conv.id)
          )
          state.conversations = uniqueConversations
        }
      },
    }
  )
)
