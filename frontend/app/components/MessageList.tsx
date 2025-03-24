// 'use client'

// import { useState } from 'react';
// import { Message } from '../stores/conversationStore';
// import MessageCard from './MessageCard';
// import InsertionControls from './InsertionControls';

// interface MessageListProps {
//   messages: Message[];
//   onUpdateMessage: (id: string, updates: { content: string }) => void;
//   onRemoveMessage: (id: string) => void;
//   onReorderMessages: (sourceIndex: number, targetIndex: number) => void;
//   onInsertMessage: (afterId: string, role: 'user' | 'assistant') => void;
//   onRegenerateMessage: (id: string) => void;
// }

// export default function MessageList({
//   messages,
//   onUpdateMessage,
//   onRemoveMessage,
//   onReorderMessages,
//   onInsertMessage,
//   onRegenerateMessage
// }: MessageListProps) {
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editContent, setEditContent] = useState('');

//   const startEditing = (id: string, content: string) => {
//     setEditingId(id);
//     setEditContent(content);
//   };

//   const saveEdit = (id: string) => {
//     if (editContent.trim()) {
//       onUpdateMessage(id, { content: editContent });
//     }
//     setEditingId(null);
//     setEditContent('');
//   };

//   if (messages.length === 0) {
//     return (
//       <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50">
//         <p className="text-gray-500">No messages yet. Start by adding a message below.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {messages.map((message, index) => (
//         <div key={message.id} className="space-y-3">
//           <MessageCard
//             message={message}
//             isEditing={editingId === message.id}
//             editContent={editContent}
//             onStartEditing={startEditing}
//             onSaveEdit={saveEdit}
//             onRemove={onRemoveMessage}
//             onMoveUp={() => onReorderMessages(index, index - 1)}
//             onMoveDown={() => onReorderMessages(index, index + 1)}
//             onRegenerateMessage={
//               message.role === 'assistant'
//                 ? () => onRegenerateMessage(message.id)
//                 : undefined
//             }
//             canMoveUp={index > 0}
//             canMoveDown={index < messages.length - 1}
//             onEditContentChange={setEditContent}
//           />
          
//           {/* Insertion controls after each message */}
//           <InsertionControls 
//             onInsertUser={() => onInsertMessage(message.id, 'user')}
//             onInsertAssistant={() => onInsertMessage(message.id, 'assistant')}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }