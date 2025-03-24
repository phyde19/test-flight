'use client'

interface StreamingResponseProps {
  content: string;
  isStreaming: boolean;
  targetMessageId: string | null;
}

export default function StreamingResponse({
  content,
  isStreaming,
  targetMessageId
}: StreamingResponseProps) {
  if (!isStreaming && !content) return null;
  
  return (
    <div className="p-4 border rounded-lg shadow-sm animate-fadeIn mt-4">
      <div className="flex items-center mb-2">
        <h2 className="text-lg font-semibold">
          {targetMessageId ? 'Regenerating Response' : 'Streaming Response'}
        </h2>
        
        {isStreaming && (
          <div className="ml-2 flex items-center">
            <div className="animate-pulse h-2 w-2 rounded-full bg-green-500 mr-0.5"></div>
            <div className="animate-pulse delay-75 h-2 w-2 rounded-full bg-green-500 mr-0.5"></div>
            <div className="animate-pulse delay-150 h-2 w-2 rounded-full bg-green-500"></div>
          </div>
        )}
      </div>
      
      <div className="p-3 border rounded-md bg-green-50 min-h-[100px] whitespace-pre-wrap">
        {content || 'Waiting for response...'}
      </div>
    </div>
  );
}