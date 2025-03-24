// 'use client'

// import { useState } from 'react';
// import { Message, MessageRole } from '../stores/conversationStore';

// interface MessageCardProps {
//   message: Message;
//   isEditing: boolean;
//   editContent: string;
//   onStartEditing: (id: string, content: string) => void;
//   onSaveEdit: (id: string) => void;
//   onRemove: (id: string) => void;
//   onMoveUp: () => void;
//   onMoveDown: () => void;
//   onRegenerateMessage?: () => void;
//   canMoveUp: boolean;
//   canMoveDown: boolean;
//   onEditContentChange: (content: string) => void;
// }

// export default function MessageCard({
//   message,
//   isEditing,
//   editContent,
//   onStartEditing,
//   onSaveEdit,
//   onRemove,
//   onMoveUp,
//   onMoveDown,
//   onRegenerateMessage,
//   canMoveUp,
//   canMoveDown,
//   onEditContentChange
// }: MessageCardProps) {
//   const roleBg = message.role === 'user' 
//     ? 'bg-blue-100' 
//     : message.role === 'assistant' 
//       ? 'bg-green-100' 
//       : 'bg-yellow-100';
  
//   return (
//     <div className="flex flex-col p-3 border rounded-lg shadow-sm hover:shadow transition-shadow">
//       <div className="flex justify-between items-center mb-2">
//         <div className="flex items-center gap-2">
//           <span className={`px-2 py-1 rounded text-xs font-medium ${roleBg}`}>
//             {message.role}
//           </span>
//           <div className="flex">
//             <button 
//               onClick={onMoveUp}
//               className="px-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
//               disabled={!canMoveUp}
//               title="Move up"
//             >
//               ▲
//             </button>
//             <button 
//               onClick={onMoveDown}
//               className="px-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
//               disabled={!canMoveDown}
//               title="Move down"
//             >
//               ▼
//             </button>
//           </div>
//         </div>
        
//         <div className="flex gap-2 items-center">
//           {message.role === 'assistant' && onRegenerateMessage && (
//             <button 
//               onClick={onRegenerateMessage}
//               className="text-xs px-2 py-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded flex items-center gap-1"
//               title="Regenerate this response"
//             >
//               <span className="text-purple-600">↻</span> Regenerate
//             </button>
//           )}
          
//           <button 
//             onClick={() => onStartEditing(message.id, message.content)}
//             className="text-xs text-blue-600 hover:text-blue-800"
//           >
//             Edit
//           </button>
//           <button 
//             onClick={() => onRemove(message.id)}
//             className="text-xs text-red-600 hover:text-red-800"
//           >
//             Remove
//           </button>
//         </div>
//       </div>
      
//       {isEditing ? (
//         <div className="flex flex-col">
//           <textarea
//             value={editContent}
//             onChange={(e) => onEditContentChange(e.target.value)}
//             className="w-full p-2 border rounded min-h-[120px] focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
//           />
//           <div className="flex justify-end mt-2">
//             <button 
//               onClick={() => onSaveEdit(message.id)}
//               className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="whitespace-pre-wrap text-sm">{message.content}</div>
//       )}
//     </div>
//   );
// }