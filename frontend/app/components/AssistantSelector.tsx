'use client'

import { AssistantType } from '../stores/conversationStore';

interface AssistantSelectorProps {
  selectedAssistant: AssistantType;
  onChange: (assistant: AssistantType) => void;
}

export default function AssistantSelector({
  selectedAssistant,
  onChange
}: AssistantSelectorProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Assistant</h2>
      
      <div className="flex flex-wrap gap-2">
        <AssistantButton 
          type="basic"
          label="Basic"
          description="Standard assistant without special capabilities"
          isSelected={selectedAssistant === 'basic'}
          onClick={() => onChange('basic')}
        />
        
        <AssistantButton 
          type="rag"
          label="RAG"
          description="Retrieval-Augmented Generation with document access"
          isSelected={selectedAssistant === 'rag'}
          onClick={() => onChange('rag')}
        />
        
        <AssistantButton 
          type="web-search"
          label="Web Search"
          description="Assistant with web search capabilities"
          isSelected={selectedAssistant === 'web-search'}
          onClick={() => onChange('web-search')}
        />
      </div>
    </div>
  );
}

interface AssistantButtonProps {
  type: AssistantType;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

function AssistantButton({
  type, 
  label, 
  description,
  isSelected, 
  onClick
}: AssistantButtonProps) {
  const baseClasses = "flex flex-col items-start p-3 border rounded-md flex-1 min-w-[120px] transition-all";
  const selectedClasses = isSelected
    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
    
  return (
    <button
      className={`${baseClasses} ${selectedClasses}`}
      onClick={onClick}
    >
      <span className="font-medium">{label}</span>
      <span className="text-xs text-gray-500 mt-1 text-left">{description}</span>
    </button>
  );
}