'use client'

import { useState, useRef, useEffect } from 'react'
import { Message, MessageRole } from '../stores/conversationStore'

interface CellProps {
  message: Message
  isStreaming?: boolean
  isTarget?: boolean
  onUpdate: (id: string, updates: { content: string }) => void
  onDelete: (id: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRegenerate?: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

export default function Cell({
  message,
  isStreaming = false,
  isTarget = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onRegenerate,
  canMoveUp,
  canMoveDown
}: CellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editDraft, setEditDraft] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Initialize draft text when editing starts
  const startEditing = () => {
    setEditDraft(message.content)
    setIsEditing(true)
  }

  // Role-specific styling
  const roleStyles = {
    user: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      hover: 'hover:border-blue-300',
      label: 'bg-blue-100 text-blue-800'
    },
    assistant: {
      border: 'border-green-200',
      bg: 'bg-green-50',
      hover: 'hover:border-green-300',
      label: 'bg-green-100 text-green-800'
    },
    system: {
      border: 'border-yellow-200',
      bg: 'bg-yellow-50',
      hover: 'hover:border-yellow-300',
      label: 'bg-yellow-100 text-yellow-800'
    }
  }[message.role]

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [isEditing, editDraft])

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  // Handle save
  const handleSave = () => {
    onUpdate(message.id, { content: editDraft })
    setIsEditing(false)
    // No need to reset editDraft - we'll initialize it when editing starts
  }

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false)
    // No need to reset editDraft - we'll initialize it when editing starts
  }

  return (
    <div 
      className={`relative group transition-all duration-200 rounded-lg 
        ${roleStyles.border} ${roleStyles.bg} ${roleStyles.hover} 
        ${isEditing ? 'shadow-md ring-2 ring-blue-400 ring-opacity-50' : 'shadow-sm hover:shadow'}
        ${isStreaming && isTarget ? 'animate-pulse' : ''}
        ${!isEditing ? 'cursor-pointer' : ''}
      `}
      onClick={(e) => {
        // Don't trigger edit if clicking on buttons or controls
        if (
          e.target instanceof Element && 
          (e.target.closest('button') || e.target.closest('svg') || e.target.tagName === 'BUTTON' || isEditing)
        ) {
          return;
        }
        startEditing();
      }}
    >
      {/* Cell number and controls - positioned outside the cell */}
      <div className="absolute -left-10 top-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className={`text-gray-400 hover:text-gray-700 ${!canMoveUp ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Move up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
        <button 
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className={`text-gray-400 hover:text-gray-700 ${!canMoveDown ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Move down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Cell content */}
      <div className="p-4">
        {/* Role badge and controls */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className={`text-xs font-medium px-2 py-1 rounded ${roleStyles.label}`}>
              {message.role}
              {isStreaming && isTarget && (
                <span className="ml-2 inline-flex">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse delay-150">●</span>
                  <span className="animate-pulse delay-300">●</span>
                </span>
              )}
            </span>
            {isEditing && (
              <span className="ml-2 text-xs text-blue-500 font-medium px-2 py-0.5 bg-blue-50 rounded-full border border-blue-200">
                Editing
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {message.role === 'assistant' && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="text-xs text-purple-600 hover:text-purple-800"
                title="Regenerate this response"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            )}
            
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="text-xs text-green-600 hover:text-green-800"
                  title="Save changes"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </button>
                <button
                  onClick={handleCancel}
                  className="text-xs text-red-600 hover:text-red-800"
                  title="Cancel editing"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={startEditing}
                  className="text-xs text-blue-600 hover:text-blue-800"
                  title="Edit message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                  title="Delete message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Editable content */}
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            onKeyDown={(e) => {
              // Handle Shift+Enter to save
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            className="w-full p-0 bg-transparent border-none resize-none focus:ring-0 focus:outline-none"
            rows={1}
          />
        ) : (
          <div className="whitespace-pre-wrap">
            {message.content || <span className="italic text-gray-400">Empty message. Click to edit.</span>}
          </div>
        )}
      </div>
    </div>
  )
}