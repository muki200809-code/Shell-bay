import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  code: string
  messages: ChatMessage[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic'

interface AppState {
  // AI Configuration
  aiProvider: AIProvider
  geminiApiKey: string
  openaiApiKey: string
  anthropicApiKey: string
  
  // Projects
  projects: Project[]
  currentProjectId: string | null
  
  // UI State
  isSettingsOpen: boolean
  previewMode: 'desktop' | 'tablet' | 'mobile'
  showCode: boolean
  
  // Actions
  setAIProvider: (provider: AIProvider) => void
  setGeminiApiKey: (key: string) => void
  setOpenaiApiKey: (key: string) => void
  setAnthropicApiKey: (key: string) => void
  
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (id: string | null) => void
  
  setSettingsOpen: (open: boolean) => void
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void
  setShowCode: (show: boolean) => void
  
  addMessage: (projectId: string, message: ChatMessage) => void
  updateCode: (projectId: string, code: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      aiProvider: 'gemini',
      geminiApiKey: '',
      openaiApiKey: '',
      anthropicApiKey: '',
      
      projects: [],
      currentProjectId: null,
      
      isSettingsOpen: false,
      previewMode: 'desktop',
      showCode: false,
      
      // Actions
      setAIProvider: (provider) => set({ aiProvider: provider }),
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setOpenaiApiKey: (key) => set({ openaiApiKey: key }),
      setAnthropicApiKey: (key) => set({ anthropicApiKey: key }),
      
      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
          currentProjectId: project.id,
        })),
      
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        })),
      
      setCurrentProject: (id) => set({ currentProjectId: id }),
      
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setShowCode: (show) => set({ showCode: show }),
      
      addMessage: (projectId, message) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, messages: [...p.messages, message] }
              : p
          ),
        })),
      
      updateCode: (projectId, code) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, code } : p
          ),
        })),
    }),
    {
      name: 'shell-bay-storage',
    }
  )
)
