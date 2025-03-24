import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type MessageRole = 'user' | 'assistant' | 'system'
export type AssistantType = 'basic' | 'rag' | 'web-search'

export interface Message {
  id: string
  role: MessageRole
  content: string
}


interface ConversationState {
  // Core state
  messages: Message[]
  selectedAssistant: AssistantType
  systemPrompt: string | null
  isStreaming: boolean
  streamedResponse: string
  abortController: AbortController | null

  // Message actions
  addMessage: (role: MessageRole, content: string) => void
  updateMessage: (id: string, updates: Partial<Omit<Message, 'id'>>) => void
  removeMessage: (id: string) => void
  reorderMessages: (sourceIndex: number, targetIndex: number) => void
  clearMessages: () => void

  // Assistant selection
  setAssistant: (assistant: AssistantType) => void

  // System prompt
  setSystemPrompt: (prompt: string | null) => void

  // Export/Import
  exportState: () => string
  importState: (stateJson: string) => void
  
  // API interaction
  startStream: () => Promise<void>
  stopStream: () => void
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  // Initial state
  messages: [],
  selectedAssistant: 'basic',
  systemPrompt: null,
  isStreaming: false,
  streamedResponse: '',
  abortController: null as AbortController | null,

  // Message actions
  addMessage: (role, content) => set(state => ({
    messages: [...state.messages, { id: nanoid(), role, content }]
  })),

  updateMessage: (id, updates) => set(state => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    )
  })),

  removeMessage: (id) => set(state => ({
    messages: state.messages.filter(msg => msg.id !== id)
  })),

  reorderMessages: (sourceIndex, targetIndex) => set(state => {
    const newMessages = [...state.messages]
    const [removed] = newMessages.splice(sourceIndex, 1)
    newMessages.splice(targetIndex, 0, removed)
    return { messages: newMessages }
  }),

  clearMessages: () => set({ messages: [] }),

  // Assistant selection
  setAssistant: (assistant) => set({ selectedAssistant: assistant }),

  // System prompt
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),


  // Export/Import
  exportState: () => {
    const { messages, selectedAssistant, systemPrompt } = get()
    return JSON.stringify({
      messages,
      selectedAssistant,
      systemPrompt
    }, null, 2)
  },
  
  importState: (stateJson) => {
    try {
      const state = JSON.parse(stateJson)
      
      // Validate the structure
      if (typeof state !== 'object') throw new Error('Invalid state format')
      
      // Import messages with validation
      if (Array.isArray(state.messages)) {
        const validMessages = state.messages.filter((msg: any) => 
          msg && 
          typeof msg.id === 'string' && 
          ['user', 'assistant', 'system'].includes(msg.role) &&
          typeof msg.content === 'string'
        )
        set({ messages: validMessages })
      }
      
      // Import assistant selection if valid
      if (['basic', 'rag', 'web-search'].includes(state.selectedAssistant)) {
        set({ selectedAssistant: state.selectedAssistant })
      }
      
      // Import system prompt if valid
      if (state.systemPrompt === null || typeof state.systemPrompt === 'string') {
        set({ systemPrompt: state.systemPrompt })
      }
    } catch (error) {
      console.error('Error importing state:', error)
    }
  },

  // API interaction
  startStream: async () => {
    const { messages, selectedAssistant, systemPrompt } = get()
    
    if (messages.length === 0) return
    
    // Find the last user message
    let lastUserMessageIndex = messages.length - 1
    while (lastUserMessageIndex >= 0 && messages[lastUserMessageIndex].role !== 'user') {
      lastUserMessageIndex--
    }
    
    // If there are assistant messages after the last user message, remove them
    let messagesToSend = [...messages]
    if (lastUserMessageIndex >= 0 && lastUserMessageIndex < messages.length - 1) {
      // Get all messages up to and including the last user message
      messagesToSend = messages.slice(0, lastUserMessageIndex + 1)
      set({ messages: messagesToSend })
    }
    
    // Create abort controller
    const abortController = new AbortController()
    set({ isStreaming: true, streamedResponse: '', abortController })
    
    try {
      // Convert messages to the format expected by the API,
      // ensuring we exactly match the backend schema
      const apiMessages = messagesToSend.map(({ role, content }) => ({ 
        role, 
        content 
      }))
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/completion/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistant: selectedAssistant,
          system_prompt: systemPrompt || null, // Ensure null when empty
          conversation: apiMessages,
        }),
        signal: abortController.signal,
      })
      
      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text()
        throw new Error(`API error (${response.status}): ${errorText}`)
      }
      
      if (!response.body) {
        throw new Error('No response body')
      }
      
      const reader = response.body.getReader()
      
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          // Once streaming is complete, add or replace an assistant response message
          const { streamedResponse, messages } = get()
          if (streamedResponse.trim()) {
            // Check if the last message is from the assistant
            const lastMessageIndex = messages.length - 1
            if (lastMessageIndex >= 0 && messages[lastMessageIndex].role === 'assistant') {
              // Replace the last assistant message
              get().updateMessage(messages[lastMessageIndex].id, { content: streamedResponse })
            } else {
              // Add a new assistant message
              get().addMessage('assistant', streamedResponse)
            }
          }
          break
        }
        
        const text = new TextDecoder().decode(value)
        set(state => ({ 
          streamedResponse: state.streamedResponse + text 
        }))
      }
    } catch (error) {
      // Only log errors that aren't from aborting
      if (error.name !== 'AbortError') {
        console.error('Error streaming response:', error)
        
        // Display error to user by adding it to the streamedResponse
        set(state => ({ 
          streamedResponse: `Error connecting to API: ${error.message}\n\nMake sure the backend is running at ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}` 
        }))
        
        // Wait 5 seconds then clear the error
        setTimeout(() => {
          set({ isStreaming: false, abortController: null })
        }, 5000)
        return
      }
    } finally {
      set({ isStreaming: false, abortController: null })
    }
  },

  stopStream: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
      set({ isStreaming: false, abortController: null })
    }
  }
}))