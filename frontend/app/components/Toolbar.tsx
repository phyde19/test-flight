'use client'

import { AssistantType } from '../stores/conversationStore'

interface ToolbarProps {
  selectedAssistant: AssistantType
  onChangeAssistant: (assistant: AssistantType) => void
  onAddUserMessage: () => void
  onAddAssistantMessage: () => void
  onStreamResponse: () => void
  onStopStream: () => void
  onClearAll: () => void
  onExport: () => void
  onImport: () => void
  isStreaming: boolean
  hasMessages: boolean
}

export default function Toolbar({
  selectedAssistant,
  onChangeAssistant,
  onAddUserMessage,
  onAddAssistantMessage,
  onStreamResponse,
  onStopStream,
  onClearAll,
  onExport,
  onImport,
  isStreaming,
  hasMessages
}: ToolbarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b shadow-sm py-2 px-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Assistant selector */}
        <div className="flex items-center mr-4">
          <span className="text-sm font-medium mr-2">Assistant:</span>
          <select
            value={selectedAssistant}
            onChange={(e) => onChangeAssistant(e.target.value as AssistantType)}
            className="py-1 px-2 text-sm border rounded bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
          >
            <option value="basic">Basic</option>
            <option value="rag">RAG</option>
            <option value="web-search">Web Search</option>
          </select>
        </div>
        
        {/* Add cells */}
        <ToolbarButton
          onClick={onAddUserMessage}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 10h-4V6"/>
              <path d="M15 10a5 5 0 0 1-5-5"/>
              <path d="M19 14c1.49-1.46 2-3.21 2-5 0-4.28-4.48-9-10-9-4.48 0-8.11 2.79-9.52 6.71"/>
              <path d="M5 18v4h4"/>
              <path d="M9 18a5 5 0 0 0-5-5"/>
              <path d="M5 10c-1.49 1.46-2 3.21-2 5 0 4.28 4.48 9 10 9 4.48 0 8.11-2.79 9.52-6.71"/>
            </svg>
          }
          label="Add User"
          color="blue"
        />
        <ToolbarButton
          onClick={onAddAssistantMessage}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          }
          label="Add Assistant"
          color="green"
        />
        
        {/* Divider */}
        <div className="h-6 border-l border-gray-300 mx-1"></div>
        
        {/* Run controls */}
        {isStreaming ? (
          <ToolbarButton
            onClick={onStopStream}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="6" width="12" height="12"/>
              </svg>
            }
            label="Stop"
            color="red"
          />
        ) : (
          <ToolbarButton
            onClick={onStreamResponse}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            }
            label="Run"
            color="green"
            disabled={!hasMessages}
          />
        )}
        
        <ToolbarButton
          onClick={onClearAll}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          }
          label="Clear All"
          color="gray"
        />
        
        {/* Divider */}
        <div className="h-6 border-l border-gray-300 mx-1"></div>
        
        {/* Export/Import */}
        <ToolbarButton
          onClick={onExport}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 17V3"/>
              <path d="m6 11 6 6 6-6"/>
              <path d="M19 21H5"/>
            </svg>
          }
          label="Export"
          color="purple"
        />
        <ToolbarButton
          onClick={onImport}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v14"/>
              <path d="m18 11-6 6-6-6"/>
              <path d="M19 21H5"/>
            </svg>
          }
          label="Import"
          color="purple"
        />
      </div>
    </div>
  )
}

interface ToolbarButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  color: 'blue' | 'green' | 'red' | 'purple' | 'gray'
  disabled?: boolean
}

function ToolbarButton({
  onClick,
  icon,
  label,
  color,
  disabled = false
}: ToolbarButtonProps) {
  const colorClasses = {
    blue: 'text-blue-600 hover:bg-blue-50',
    green: 'text-green-600 hover:bg-green-50',
    red: 'text-red-600 hover:bg-red-50',
    purple: 'text-purple-600 hover:bg-purple-50',
    gray: 'text-gray-600 hover:bg-gray-50'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-1 px-2 text-xs rounded flex items-center gap-1 border border-gray-200 transition-colors ${colorClasses[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
      {label}
    </button>
  )
}