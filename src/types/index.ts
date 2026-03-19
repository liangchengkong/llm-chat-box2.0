export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  reasoning_content?: string
  files?: FileItem[]
  completion_tokens?: number
  speed?: string
  loading?: boolean
  timestamp?: string
}

export interface FileItem {
  name: string
  url: string
  type: 'image' | 'file'
  size: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
}

export interface Settings {
  model: string
  apiKey: string
  stream: boolean
  maxTokens: number
  temperature: number
  topP: number
  topK: number
}

export interface ModelOption {
  label: string
  value: string
  maxTokens: number
}

export interface MessageContent {
  text: string
  files: FileItem[]
}

export interface UpdateCallback {
  (
    content: string,
    reasoning_content: string,
    tokens: number,
    speed: string
  ): void
}
