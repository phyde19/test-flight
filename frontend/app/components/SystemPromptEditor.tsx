'use client'

interface SystemPromptEditorProps {
  systemPrompt: string | null;
  onChange: (newPrompt: string) => void;
}

export default function SystemPromptEditor({
  systemPrompt,
  onChange
}: SystemPromptEditorProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex items-center mb-2">
        <h2 className="text-lg font-semibold">System Prompt</h2>
        <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
          system
        </span>
      </div>
      
      <textarea
        value={systemPrompt || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter system instructions here..."
        className="w-full p-3 border rounded-md min-h-[100px] focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 outline-none"
      />
    </div>
  );
}