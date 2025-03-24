'use client'

interface InsertCellProps {
  onInsertUser: () => void
  onInsertAssistant: () => void
}

export default function InsertCell({
  onInsertUser,
  onInsertAssistant
}: InsertCellProps) {
  return (
    <div className="h-2 group relative flex justify-center items-center my-1">
      <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-10">
        <button
          onClick={onInsertUser}
          className="py-1 px-2 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full flex items-center gap-1 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
          </svg>
          User
        </button>
        <button
          onClick={onInsertAssistant}
          className="py-1 px-2 text-xs bg-green-100 text-green-800 hover:bg-green-200 rounded-full flex items-center gap-1 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
          </svg>
          Assistant
        </button>
      </div>
      <div className="absolute w-full h-px bg-gray-200 group-hover:bg-gray-400 transition-colors"></div>
    </div>
  )
}