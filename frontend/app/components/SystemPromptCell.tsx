'use client'

import { useState, useRef, useEffect } from 'react'

interface SystemPromptCellProps {
  content: string | null
  onChange: (content: string) => void
}

export default function SystemPromptCell({
  content,
  onChange
}: SystemPromptCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(content || '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [isEditing, value])

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  // Handle save
  const handleSave = () => {
    onChange(value)
    setIsEditing(false)
  }

  // Handle cancel
  const handleCancel = () => {
    setValue(content || '')
    setIsEditing(false)
  }

  return (
    <div 
      className={`relative group transition-all duration-200 rounded-lg border-yellow-200 bg-yellow-50 hover:border-yellow-300 
        ${isEditing ? 'shadow-md ring-2 ring-blue-400 ring-opacity-50' : 'shadow-sm hover:shadow'}
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
        setIsEditing(true);
      }}>
      {/* Using the same space for control buttons as regular cells for consistent width */}
      <div className="absolute -left-10 top-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* This space is intentionally left empty to match Cell component layout */}
      </div>
      <div className="p-4">
        {/* Header and controls */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-800">
              system
            </span>
            {isEditing && (
              <span className="ml-2 text-xs text-blue-500 font-medium px-2 py-0.5 bg-blue-50 rounded-full border border-blue-200">
                Editing
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
                title="Edit system prompt"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Editable content */}
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              // Handle Shift+Enter to save
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            className="w-full p-0 bg-transparent border-none resize-none focus:ring-0 focus:outline-none"
            placeholder="Enter system instructions here..."
            rows={1}
          />
        ) : (
          <div className="whitespace-pre-wrap">
            {value || <span className="text-gray-400 italic">No system prompt set. Click to edit.</span>}
          </div>
        )}
      </div>
    </div>
  )
}