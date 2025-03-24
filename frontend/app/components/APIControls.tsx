'use client'

interface APIControlsProps {
  isStreaming: boolean;
  messagesExist: boolean;
  onStartStream: () => void;
  onStopStream: () => void;
  onClearAll: () => void;
}

export default function APIControls({
  isStreaming,
  messagesExist,
  onStartStream,
  onStopStream,
  onClearAll
}: APIControlsProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Actions</h2>
      
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onStartStream}
          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isStreaming || !messagesExist}
        >
          {isStreaming ? 'Streaming...' : 'Generate Response'}
        </button>
        
        <button
          onClick={onStopStream}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isStreaming}
        >
          Stop Stream
        </button>
        
        <button
          onClick={onClearAll}
          className="p-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors text-sm"
          title="Clear all messages"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}