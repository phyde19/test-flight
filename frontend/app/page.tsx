'use client'

import { useEffect, useState } from 'react'
import stringify from 'json-stringify-pretty-compact'
import { useConversationStore, MessageRole, AssistantType } from './stores/conversationStore'

export default function DebugInterface() {
  // For new message form
  const [newRole, setNewRole] = useState<MessageRole>('user')
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  
  // Current store state as string for display
  const [stateSnapshot, setStateSnapshot] = useState('')
  
  // Access store actions and state
  const store = useConversationStore()
  
  
  // Update state snapshot whenever store changes
  useEffect(() => {
    const {
      messages,
      selectedAssistant, 
      systemPrompt,
      isStreaming,
      streamedResponse,
      ...actions
    } = store
    
    setStateSnapshot(stringify({
      messages,
      selectedAssistant,
      systemPrompt,
      isStreaming,
      streamedResponse
    }, { maxLength: 100 }))
  }, [store])
  
  // Add a new message
  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newContent.trim()) {
      store.addMessage(newRole, newContent)
      setNewContent('')
    }
  }
  
  // Start editing a message
  const startEditing = (id: string, content: string) => {
    setEditingId(id)
    setEditContent(content)
  }
  
  // Save edits to a message
  const saveEdit = (id: string) => {
    if (editContent.trim()) {
      store.updateMessage(id, { content: editContent })
    }
    setEditingId(null)
    setEditContent('')
  }
  
  
  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Controls panel */}
      <div className="w-full md:w-1/2 space-y-6">
        <h1 className="text-2xl font-bold">Conversation Debugger</h1>
        
        {/* Assistant selector */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Assistant</h2>
          <select 
            value={store.selectedAssistant}
            onChange={(e) => store.setAssistant(e.target.value as AssistantType)}
            className="w-full p-2 border rounded"
          >
            <option value="basic">Basic</option>
            <option value="rag">RAG</option>
            <option value="web-search">Web Search</option>
          </select>
        </div>
        
        {/* System prompt */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">System Prompt</h2>
          <textarea
            value={store.systemPrompt || ''}
            onChange={(e) => store.setSystemPrompt(e.target.value || null)}
            className="w-full p-2 border rounded min-h-[100px]"
            placeholder="Optional system prompt..."
          />
        </div>
        
        {/* Message list */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Messages</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {store.messages.map((msg, index) => (
              <div key={msg.id} className="flex flex-col p-2 border rounded">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      msg.role === 'user' ? 'bg-blue-100' : 
                      msg.role === 'assistant' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {msg.role}
                    </span>
                    <div className="flex">
                      <button 
                        onClick={() => index > 0 && store.reorderMessages(index, index - 1)}
                        className="px-1 text-gray-600 disabled:text-gray-300"
                        disabled={index === 0}
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => index < store.messages.length - 1 && store.reorderMessages(index, index + 1)}
                        className="px-1 text-gray-600 disabled:text-gray-300"
                        disabled={index === store.messages.length - 1}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEditing(msg.id, msg.content)}
                      className="text-xs text-blue-600"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => store.removeMessage(msg.id)}
                      className="text-xs text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                {editingId === msg.id ? (
                  <div className="flex flex-col">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border rounded min-h-[60px]"
                    />
                    <div className="flex justify-end mt-1">
                      <button 
                        onClick={() => saveEdit(msg.id)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            ))}
          </div>
          
          {/* Add message form */}
          <form onSubmit={handleAddMessage} className="mt-4 space-y-2">
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as MessageRole)}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="assistant">Assistant</option>
              <option value="system">System</option>
            </select>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-2 border rounded min-h-[100px]"
              placeholder="Message content..."
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={!newContent.trim()}
            >
              Add Message
            </button>
          </form>
          
          <div className="flex gap-2 mt-2">
            <button
              onClick={store.clearMessages}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Clear All
            </button>
          </div>
        </div>
        
        
        {/* Export/Import */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Export/Import</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                const stateJson = store.exportState()
                navigator.clipboard.writeText(stateJson)
                  .then(() => alert('State copied to clipboard'))
                  .catch(() => {
                    // Fallback for when clipboard isn't available
                    const textarea = document.createElement('textarea')
                    textarea.value = stateJson
                    document.body.appendChild(textarea)
                    textarea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textarea)
                    alert('State copied to clipboard')
                  })
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Export to Clipboard
            </button>
            
            <button
              onClick={() => {
                const stateJson = prompt('Paste the state JSON:')
                if (stateJson) {
                  store.importState(stateJson)
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Import from Clipboard
            </button>
          </div>
        </div>
        
        {/* API Controls */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">API Controls</h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => store.startStream()}
              className="px-4 py-2 bg-green-600 text-white rounded"
              disabled={store.isStreaming || store.messages.length === 0}
            >
              {store.isStreaming ? 'Streaming...' : 'Start Stream'}
            </button>
            
            <button
              onClick={store.stopStream}
              className="px-4 py-2 bg-red-600 text-white rounded"
              disabled={!store.isStreaming}
            >
              Stop Stream
            </button>
          </div>
        </div>
      </div>
      
      {/* State visualization */}
      <div className="w-full md:w-1/2">
        <div className="sticky top-4">
          <h2 className="text-lg font-semibold mb-2">Store State</h2>
          <div className="p-4 border rounded-lg bg-gray-50 overflow-auto max-h-[calc(100vh-8rem)]">
            <pre className="text-xs">{stateSnapshot}</pre>
          </div>
          
          {/* Streamed response */}
          {store.isStreaming && (
            <div className="mt-4 p-4 border rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Streaming Response</h2>
              <div className="p-2 border rounded bg-green-50 min-h-[100px] whitespace-pre-wrap">
                {store.streamedResponse || 'Waiting for response...'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}