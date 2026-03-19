import type { Settings } from '@/types'

const API_BASE_URL = 'https://api.siliconflow.cn/v1'

export const createChatCompletion = async (messages: { role: string; content: string }[], settings: Settings) => {
  const payload = {
    model: settings.model,
    messages,
    stream: settings.stream,
    max_tokens: settings.maxTokens,
    temperature: settings.temperature,
    top_p: settings.topP,
    top_k: settings.topK,
  }

  // console.log('API Request Payload:', JSON.stringify(payload, null, 2))
  // console.log('API Key:', settings.apiKey ? `${settings.apiKey.substring(0, 10)}...` : 'empty')

  const options: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }

  try {
    const startTime = Date.now()
    const response = await fetch(`${API_BASE_URL}/chat/completions`, options)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    if (settings.stream) {
      return response
    } else {
      const data = await response.json()
      const duration = (Date.now() - startTime) / 1000
      data.speed = (data.usage.completion_tokens / duration).toFixed(2)
      return data
    }
  } catch (error) {
    console.error('Chat API Error:', error)
    throw error
  }
}
