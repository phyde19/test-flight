'use client'

import { useState, useEffect } from 'react'
import { useConversationStore, MessageRole } from './stores/conversationStore'
import Cell from './components/Cell'
import InsertCell from './components/InsertCell'
import SystemPromptCell from './components/SystemPromptCell'
import Toolbar from './components/Toolbar'
import APIControls from './components/APIControls'

export default function NotebookInterface() {
  const store = useConversationStore()
  
  // Empty state message
  const EmptyState = () => (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Start your conversation</h3>
      <p className="text-gray-500 mb-4">Add a user or assistant message to begin</p>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => store.addMessage('user', '')}
          className="py-2 px-4 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
          </svg>
          Add User Message
        </button>
        <button
          onClick={() => store.addMessage('assistant', '')}
          className="py-2 px-4 bg-green-100 text-green-800 hover:bg-green-200 rounded-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
          </svg>
          Add Assistant Message
        </button>
      </div>
    </div>
  )

  // Handle export
  const handleExport = () => {
    const stateJson = store.exportState()
    navigator.clipboard.writeText(stateJson)
      .then(() => alert('Conversation state copied to clipboard'))
      .catch(err => {
        console.error('Failed to copy:', err)
        alert('Failed to copy to clipboard. See console for details.')
      })
  }
  
  // Handle import
  const handleImport = () => {
    const stateJson = prompt('Paste the conversation state JSON:')
    if (stateJson) {
      try {
        store.importState(stateJson)
      } catch (error) {
        console.error('Import error:', error)
        alert('Failed to import. Invalid JSON format.')
      }
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toolbar */}
      <Toolbar 
        selectedAssistant={store.selectedAssistant}
        onChangeAssistant={store.setAssistant}
        onAddUserMessage={() => store.addMessage('user', '')}
        onAddAssistantMessage={() => store.addMessage('assistant', '')}
        onStreamResponse={store.startStream}
        onStopStream={store.stopStream}
        onClearAll={store.clearMessages}
        onExport={handleExport}
        onImport={handleImport}
        isStreaming={store.isStreaming}
        hasMessages={store.messages.length > 0}
      />
      
      {/* API Parameters Controls - panel only */}
      <APIControls />
      
      {/* Main notebook area */}
      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* All cells container */}
          <div className="space-y-6 relative">
            {/* System prompt cell */}
            <div className="mb-4 relative">
              <SystemPromptCell 
                content={store.systemPrompt}
                onChange={store.setSystemPrompt}
              />
            </div>
            
            {/* Message cells */}
            {store.messages.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {store.messages.map((message, index) => (
                  <div key={message.id}>
                    <Cell 
                      message={message}
                      isStreaming={store.isStreaming}
                      isTarget={store.targetMessageId === message.id}
                      onUpdate={store.updateMessage}
                      onDelete={store.removeMessage}
                      onMoveUp={() => store.reorderMessages(index, index - 1)}
                      onMoveDown={() => store.reorderMessages(index, index + 1)}
                      onRegenerate={
                        message.role === 'assistant' 
                          ? () => store.regenerateMessage(message.id) 
                          : undefined
                      }
                      canMoveUp={index > 0}
                      canMoveDown={index < store.messages.length - 1}
                    />
                    
                    {/* Insert cell controls */}
                    <InsertCell 
                      onInsertUser={() => store.insertMessageAfter(message.id, 'user')}
                      onInsertAssistant={() => store.insertMessageAfter(message.id, 'assistant')}
                    />
                    
                    {/* If this is the last message and it's streaming, don't show insert controls */}
                    {index === store.messages.length - 1 && store.isStreaming && (
                      <div className="h-8"></div>
                    )}
                  </div>
                ))}
                
                {/* Add cell at the end */}
                <div className="mt-6 flex space-x-2 justify-center">
                  <button
                    onClick={() => store.addMessage('user', '')}
                    className="py-1.5 px-3 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full flex items-center gap-1 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"/>
                      <path d="M5 12h14"/>
                    </svg>
                    User
                  </button>
                  
                  <button
                    onClick={() => store.addMessage('assistant', '')}
                    className="py-1.5 px-3 text-sm bg-green-100 text-green-800 hover:bg-green-200 rounded-full flex items-center gap-1 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"/>
                      <path d="M5 12h14"/>
                    </svg>
                    Assistant
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}