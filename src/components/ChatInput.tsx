import { useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import type { FileItem } from '@/types'

interface ChatInputProps {
  loading: boolean
  onSend: (message: { text: string; files: FileItem[] }) => void
}

export interface ChatInputRef {
  setInputValue: (value: string) => void
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ loading, onSend }, ref) => {
  const [inputValue, setInputValue] = useState('')
  const [fileList, setFileList] = useState<FileItem[]>([])

  useImperativeHandle(ref, () => ({
    setInputValue: (value: string) => {
      setInputValue(value)
    }
  }))

  const handleSend = useCallback(() => {
    // console.log('=== ChatInput handleSend called ===')
    // console.log('inputValue:', inputValue)
    // console.log('loading:', loading)
    // console.log('fileList:', fileList)

    if (!inputValue.trim() || loading) {
      // console.log('Returning early - inputValue.trim():', inputValue.trim(), 'loading:', loading)
      return
    }

    const messageContent = {
      text: inputValue.trim(),
      files: fileList,
    }

    // console.log('Calling onSend with:', messageContent)
    onSend(messageContent)
    setInputValue('')
    setFileList([])
  }, [inputValue, fileList, loading, onSend])

  const handleNewline = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setInputValue(inputValue + '\n')
  }, [inputValue])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileList([
      ...fileList,
      {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        size: file.size,
      },
    ])
  }, [fileList])

  const handleFileRemove = useCallback((file: FileItem) => {
    const index = fileList.findIndex((item) => item.url === file.url)
    if (index !== -1) {
      URL.revokeObjectURL(fileList[index].url)
      setFileList(fileList.filter((_, i) => i !== index))
    }
  }, [fileList])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    } else if (e.key === 'Enter' && e.shiftKey) {
      handleNewline(e)
    }
  }, [handleSend, handleNewline])

  return (
    <div className="chat-input-wrapper">
      {fileList.length > 0 && (
        <div className="preview-area">
          {fileList.map((file) => (
            <div key={file.url} className="preview-item">
              {file.type === 'image' ? (
                <div className="image-preview">
                  <img src={file.url} alt={file.name} />
                  <div className="remove-btn" onClick={() => handleFileRemove(file)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="file-preview">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(1)}KB</span>
                  <div className="remove-btn" onClick={() => handleFileRemove(file)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="textarea-wrapper">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入消息，Enter 发送，Shift + Enter 换行"
          rows={1}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="chat-textarea"
        />
      </div>

      <div className="button-group">
        <label className="upload-btn">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <img src="/src/assets/photo/附件.png" alt="link" />
        </label>
        <label className="upload-btn">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <img src="/src/assets/photo/图片.png" alt="picture" />
        </label>
        <div className="divider"></div>
        <button className="action-btn send-btn" disabled={loading} onClick={handleSend}>
          <img src="/src/assets/photo/发送.png" alt="send" />
        </button>
      </div>
    </div>
  )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput
