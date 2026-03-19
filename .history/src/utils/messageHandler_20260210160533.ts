import type { Message, UpdateCallback } from '@/types'

export const messageHandler = {
  formatMessage(
    role: 'user' | 'assistant',
    content: string,
    reasoning_content = '',
    files: any[] = []
  ): Message {
    return {
      id: Date.now(),
      role,
      content,
      reasoning_content,
      files,
      completion_tokens: 0,
      speed: '0',
      loading: false,
    }
  },

  async handleStreamResponse(response: Response, updateCallback: UpdateCallback) {
    const reader = response.body?.getReader()
    if (!reader) {
      console.error('No reader available for stream response')
      return
    }

    const decoder = new TextDecoder()
    let accumulatedContent = ''
    let accumulatedReasoning = ''
    const startTime = Date.now()
    let totalTokens = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter((line) => line.trim() !== '')

      for (const line of lines) {
        if (line === 'data: [DONE]') continue
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(5))
            console.log('Stream chunk data:', JSON.stringify(data, null, 2))

            // 检查 choices 是否存在
            if (!data.choices || data.choices.length === 0) {
              console.warn('No choices in stream response')
              continue
            }

            const delta = data.choices[0].delta || {}
            const content = delta.content || ''
            //
            const reasoning = delta.reasoning_content || ''

            accumulatedContent += content
            accumulatedReasoning += reasoning

            // 更新总令牌数
            if (data.usage?.completion_tokens) {
              totalTokens = data.usage.completion_tokens
            }

            // 计算速度
            const duration = (Date.now() - startTime) / 1000
            const speed = duration > 0 ? (totalTokens / duration).toFixed(2) : '0'

            updateCallback(
              accumulatedContent,
              accumulatedReasoning,
              totalTokens,
              speed
            )
          } catch (error) {
            console.error('Error processing stream chunk:', error)
          }
        }
      }
    }
  },

  handleNormalResponse(response: any, updateCallback: UpdateCallback) {
    updateCallback(
      response.choices[0].message.content,
      response.choices[0].message.reasoning_content || '',
      response.usage.completion_tokens,
      response.speed
    )
  },

  async handleResponse(response: Response | any, isStream: boolean, updateCallback: UpdateCallback) {
    if (isStream) {
      await this.handleStreamResponse(response, updateCallback)
    } else {
      this.handleNormalResponse(response, updateCallback)
    }
  },
}
