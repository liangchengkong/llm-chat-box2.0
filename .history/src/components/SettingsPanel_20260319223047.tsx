import { useState, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react'
import { useSettings, useSettingStore, modelOptions } from '@/stores/setting'

export interface SettingsPanelRef {
  openDrawer: () => void
}

const SettingsPanel = forwardRef<SettingsPanelRef>((_, ref) => {
  const [visible, setVisible] = useState(false)
  const settings = useSettings()
  const updateSettings = useSettingStore((state) => state.updateSettings)

  const currentMaxTokens = useMemo(() => {
    return modelOptions.find((option) => option.value === settings.model)?.maxTokens || 4096
  }, [settings.model])

  useImperativeHandle(ref, () => ({
    openDrawer: () => {
      setVisible(true)
    }
  }))

  const handleClose = useCallback(() => {
    setVisible(false)
  }, [])

  const handleModelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value
    const selectedModel = modelOptions.find((option) => option.value === newModel)
    if (selectedModel) {
      const newMaxTokens = Math.min(settings.maxTokens, selectedModel.maxTokens)
      updateSettings({ model: newModel, maxTokens: newMaxTokens })
    }
  }, [settings.maxTokens, updateSettings])

  const handleStreamChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ stream: e.target.checked })
  }, [updateSettings])

  const handleApiKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ apiKey: e.target.value })
  }, [updateSettings])

  const handleMaxTokensChange = useCallback((value: number) => {
    updateSettings({ maxTokens: value })
  }, [updateSettings])

  const handleTemperatureChange = useCallback((value: number) => {
    updateSettings({ temperature: value })
  }, [updateSettings])

  const handleTopPChange = useCallback((value: number) => {
    updateSettings({ topP: value })
  }, [updateSettings])

  const handleTopKChange = useCallback((value: number) => {
    updateSettings({ topK: value })
  }, [updateSettings])

  return (
    <div className={`settings-panel ${visible ? 'visible' : ''}`}>
      <div className="settings-overlay" onClick={handleClose}></div>
      <div className="settings-drawer">
        <div className="settings-header">
          <h3>设置</h3>
          <button className="close-btn" onClick={handleClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settings-content">
          <div className="setting-item">
            <div className="setting-label">Model</div>
            <select
              value={settings.model}
              onChange={handleModelChange}
              className="model-select"
            >
              {modelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-label-row">
              <div className="label-with-tooltip">
                <span>流式响应</span>
                <svg className="tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1.97l-6.91 6.91a6 6 0 0 1-5.69-8.49l6.91-6.91a6 6 0 0 1 5.69 8.49h-11.38a6 6 0 0 1 5.69-8.49l6.91-6.91a6 6 0 0 1 5.83-1.97A3 3 0 0 1 9.09 9z" />
                </svg>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.stream}
                  onChange={handleStreamChange}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label-row">
              <div className="label-with-tooltip">
                <span>API Key</span>
                <svg className="tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1.97l-6.91 6.91a6 6 0 0 1-5.69-8.49l6.91-6.91a6 6 0 0 1 5.69 8.49h-11.38a6 6 0 0 1 5.69-8.49l6.91-6.91a6 6 0 0 1 5.83-1.97A3 3 0 0 1 9.09 9z" />
                </svg>
              </div>
              <a href="https://cloud.siliconflow.cn/account/ak" target="_blank" className="get-key-link">
                获取 API Key
              </a>
            </div>
            <input
              type="password"
              value={settings.apiKey}
              onChange={handleApiKeyChange}
              placeholder="请输入 API Key"
              className="setting-input"
            />
          </div>

          <div className="setting-item">
            <div className="setting-label">
              Max Tokens
              <svg className="tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1.97l-6.91 6.91a6 6 0 0 1-5.69-8.49l6.91-6.91a6 6 0 0 1 5.69 8.49h-11.38a6 6 0 0 1 5.69-8.49l6.91-6.91a6 6 0 0 1 5.83-1.97A3 3 0 0 1 9.09 9z" />
              </svg>
            </div>
            <div className="setting-control">
              <input
                type="range"
                min="1"
                max={currentMaxTokens}
                step="1"
                value={settings.maxTokens}
                onChange={(e) => handleMaxTokensChange(Number(e.target.value))}
                className="setting-slider"
              />
              <input
                type="number"
                min="1"
                max={currentMaxTokens}
                step="1"
                value={settings.maxTokens}
                onChange={(e) => handleMaxTokensChange(Number(e.target.value))}
                className="setting-number"
              />
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              Temperature
              <svg className="tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1.97l-6.91 6.91a6 6 0 0 1-5.69-8.49l6.91-6.91a6 6 0 0 1 5.69 8.49h-11.38a6 6 0 0 1 5.69-8.49l6.91-6.91a6 6 0 0 1 5.83-1.97A3 3 0 0 1 9.09 9z" />
              </svg>
            </div>
            <div className="setting-control">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleTemperatureChange(Number(e.target.value))}
                className="setting-slider"
              />
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleTemperatureChange(Number(e.target.value))}
                className="setting-number"
              />
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              Top-P
              <svg className="tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1.97l-6.91 6.91a6 6 0 0 1-5.69-8.49l6.91-6.91a6 6 0 0 1 5.69 8.49h-11.38a6 6 0 0 1 5.69-8.49l6.91-6.91a6 6 0 0 1 5.83-1.97A3 3 0 0 1 9.09 9z" />
              </svg>
            </div>
            <div className="setting-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.topP}
                onChange={(e) => handleTopPChange(Number(e.target.value))}
                className="setting-slider"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={settings.topP}
                onChange={(e) => handleTopPChange(Number(e.target.value))}
                className="setting-number"
              />
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              Top-K
              <svg className="tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1.97l-6.91 6.91a6 6 0 0 1-5.69-8.49l6.91-6.91a6 6 0 0 1 5.69 8.49h-11.38a6 6 0 0 1 5.69-8.49l6.91-6.91a6 6 0 0 1 5.83-1.97A3 3 0 0 1 9.09 9z" />
              </svg>
            </div>
            <div className="setting-control">
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={settings.topK}
                onChange={(e) => handleTopKChange(Number(e.target.value))}
                className="setting-slider"
              />
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={settings.topK}
                onChange={(e) => handleTopKChange(Number(e.target.value))}
                className="setting-number"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

SettingsPanel.displayName = 'SettingsPanel'

export default SettingsPanel
