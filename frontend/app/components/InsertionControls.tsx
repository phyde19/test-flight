'use client'

interface InsertionControlsProps {
  onInsertUser: () => void;
  onInsertAssistant: () => void;
}

export default function InsertionControls({ 
  onInsertUser, 
  onInsertAssistant 
}: InsertionControlsProps) {
  return (
    <div className="group relative h-0 flex justify-center">
      <div className="absolute -top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 bg-white border rounded px-1 py-0.5 shadow-sm">
        <button
          onClick={onInsertUser}
          className="text-xs px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded"
          title="Insert user message"
        >
          + User
        </button>
        <button
          onClick={onInsertAssistant}
          className="text-xs px-2 py-0.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded"
          title="Insert assistant message"
        >
          + Assistant
        </button>
      </div>
    </div>
  );
}