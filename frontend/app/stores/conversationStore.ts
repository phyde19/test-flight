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
  targetMessageId: string | null // For message-specific regeneration

  // Message actions
  addMessage: (role: MessageRole, content: string) => void
  insertMessageAfter: (targetId: string, role: MessageRole, content?: string) => void
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
  regenerateMessage: (messageId: string) => Promise<void>
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
  targetMessageId: null,

  // Message actions
  addMessage: (role, content) => set(state => ({
    messages: [...state.messages, { id: nanoid(), role, content }]
  })),
  
  insertMessageAfter: (targetId, role, content = '') => set(state => {
    // Find the index of the target message
    const targetIndex = state.messages.findIndex(msg => msg.id === targetId)
    if (targetIndex === -1) return state
    
    // Create a new array with the inserted message
    const newMessages = [
      ...state.messages.slice(0, targetIndex + 1),
      { id: nanoid(), role, content },
      ...state.messages.slice(targetIndex + 1)
    ]
    
    return { messages: newMessages }
  }),

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
    // Only export the essential state, not streaming state
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
    
    if (lastUserMessageIndex === -1) {
      console.warn('No user message found in conversation')
      return
    }
    
    // Enforce idempotency: Remove any assistant messages after the last user message
    // This ensures we can re-run the stream multiple times and get consistent results
    let messagesToKeep = messages.slice(0, lastUserMessageIndex + 1)
    
    // Only update the UI state if we're actually removing messages
    if (messagesToKeep.length < messages.length) {
      set({ messages: messagesToKeep })
    }
    
    // Create an assistant message to stream into
    const assistantMessageId = nanoid()
    set(state => ({
      messages: [...state.messages, { id: assistantMessageId, role: 'assistant', content: '' }]
    }))
    
    // Create abort controller
    const abortController = new AbortController()
    set({ 
      isStreaming: true, 
      targetMessageId: assistantMessageId,
      abortController 
    })
    
    try {
      // Convert messages to the format expected by the API,
      // ensuring we exactly match the backend schema (omitting our IDs)
      // Only send messages up to and including the last user message
      const apiMessages = messagesToKeep.map(({ role, content }) => ({ 
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
      let streamedContent = ''
      
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }
        
        const text = new TextDecoder().decode(value)
        streamedContent += text
        
        // Update the assistant message with the content received so far
        get().updateMessage(assistantMessageId, { content: streamedContent })
      }
    } catch (error) {
      // Only log errors that aren't from aborting
      if (error.name !== 'AbortError') {
        console.error('Error streaming response:', error)
        
        // Display error in the assistant message
        get().updateMessage(assistantMessageId, { 
          content: `Error connecting to API: ${error.message}\n\nMake sure the backend is running at ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}` 
        })
      }
    } finally {
      set({ isStreaming: false, targetMessageId: null, abortController: null })
    }
  },

  regenerateMessage: async (messageId) => {
    const { messages, selectedAssistant, systemPrompt } = get()
    
    // Find target message (must be assistant message)
    const targetIndex = messages.findIndex(msg => msg.id === messageId)
    if (targetIndex === -1 || messages[targetIndex].role !== 'assistant') return
    
    // Get all messages before the target to use as context
    // This ensures we only use messages that came before this assistant message
    const contextMessages = messages.slice(0, targetIndex)
    
    // Set the target message content to empty during regeneration
    get().updateMessage(messageId, { content: '' })
    
    // Create abort controller
    const abortController = new AbortController()
    set({ 
      isStreaming: true, 
      targetMessageId: messageId,
      abortController 
    })
    
    try {
      // Convert messages to the format expected by the API
      const apiMessages = contextMessages.map(({ role, content }) => ({ 
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
          system_prompt: systemPrompt || null,
          conversation: apiMessages,
        }),
        signal: abortController.signal,
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error (${response.status}): ${errorText}`)
      }
      
      if (!response.body) {
        throw new Error('No response body')
      }
      
      const reader = response.body.getReader()
      let streamedContent = ''
      
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }
        
        const text = new TextDecoder().decode(value)
        streamedContent += text
        
        // Update the message with the content received so far
        get().updateMessage(messageId, { content: streamedContent })
      }
    } catch (error) {
      // Only log errors that aren't from aborting
      if (error.name !== 'AbortError') {
        console.error('Error streaming response:', error)
        
        // Display error in the assistant message
        get().updateMessage(messageId, { 
          content: `Error connecting to API: ${error.message}\n\nMake sure the backend is running at ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}` 
        })
      }
    } finally {
      set({ isStreaming: false, targetMessageId: null, abortController: null })
    }
  },
  
  stopStream: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
      set({ isStreaming: false, targetMessageId: null, abortController: null })
    }
  }
}))