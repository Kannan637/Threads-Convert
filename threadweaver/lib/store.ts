import { create } from 'zustand'

export interface Tweet {
  id: string
  content: string
  characterCount: number
  order: number
}

interface ThreadState {
  originalContent: string
  generatedThreads: Tweet[]
  platform: 'twitter' | 'linkedin' | 'both'
  style: 'professional' | 'casual' | 'storytelling' | 'educational'
  threadLength: number
  isGenerating: boolean
  
  setOriginalContent: (content: string) => void
  setGeneratedThreads: (threads: Tweet[]) => void
  setPlatform: (platform: 'twitter' | 'linkedin' | 'both') => void
  setStyle: (style: 'professional' | 'casual' | 'storytelling' | 'educational') => void
  setThreadLength: (length: number) => void
  setIsGenerating: (isGenerating: boolean) => void
  updateTweet: (id: string, content: string) => void
  reset: () => void
}

export const useThreadStore = create<ThreadState>((set) => ({
  originalContent: '',
  generatedThreads: [],
  platform: 'twitter',
  style: 'professional',
  threadLength: 10,
  isGenerating: false,
  
  setOriginalContent: (content) => set({ originalContent: content }),
  setGeneratedThreads: (threads) => set({ generatedThreads: threads }),
  setPlatform: (platform) => set({ platform }),
  setStyle: (style) => set({ style }),
  setThreadLength: (length) => set({ threadLength: length }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  updateTweet: (id, content) =>
    set((state) => ({
      generatedThreads: state.generatedThreads.map((tweet) =>
        tweet.id === id
          ? { ...tweet, content, characterCount: content.length }
          : tweet
      ),
    })),
  
  reset: () =>
    set({
      originalContent: '',
      generatedThreads: [],
      platform: 'twitter',
      style: 'professional',
      threadLength: 10,
      isGenerating: false,
    }),
}))
