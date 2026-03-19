import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Settings, ModelOption } from '@/types'

interface SettingState {
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  model: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
  apiKey: '',
  stream: true,
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.7,
  topK: 50,
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'llm-setting-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export const useSettings = () => useSettingStore((state) => state.settings)

export const modelOptions: ModelOption[] = [
  {
    label: 'DeepSeek-R1-0528-Qwen3-8B',
    value: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
    maxTokens: 4096,
  },
  {
      label: 'THUDM/GLM-4.1V-9B-Thinking',
      value: 'THUDM/GLM-4.1V-9B-Thinking',
      maxTokens: 4096,
  },
  {
    label: 'DeepSeek-R1',
    value: 'deepseek-ai/DeepSeek-R1',
    maxTokens: 16384,
  },
  {
    label: 'DeepSeek-V3',
    value: 'deepseek-ai/DeepSeek-V3',
    maxTokens: 4096,
  },
  {
    label: 'DeepSeek-V2.5',
    value: 'deepseek-ai/DeepSeek-V2.5',
    maxTokens: 4096,
  },
  {
    label: 'Qwen2.5-72B-Instruct-128K',
    value: 'Qwen/Qwen2.5-72B-Instruct-128K',
    maxTokens: 4096,
  },
  {
    label: 'QwQ-32B-Preview',
    value: 'Qwen/QwQ-32B-Preview',
    maxTokens: 8192,
  },
  {
    label: 'glm-4-9b-chat',
    value: 'THUDM/glm-4-9b-chat',
    maxTokens: 4096,
  },
  {
    label: 'glm-4-9b-chat(Pro)',
    value: 'Pro/THUDM/glm-4-9b-chat',
    maxTokens: 4096,
  },
]
