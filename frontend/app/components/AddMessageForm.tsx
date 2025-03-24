'use client'

import { useState } from 'react';
import { MessageRole } from '../stores/conversationStore';

interface AddMessageFormProps {
  onAddMessage: (role: MessageRole, content: string) => void;
}

export default function AddMessageForm({ onAddMessage }: AddMessageFormProps) {
  const [role, setRole] = useState<MessageRole>('user');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddMessage(role, content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Add Message</h2>
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1" htmlFor="message-role">
          Role
        </label>
        <select
          id="message-role"
          value={role}
          onChange={(e) => setRole(e.target.value as MessageRole)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
        >
          <option value="user">User</option>
          <option value="assistant">Assistant</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1" htmlFor="message-content">
          Content
        </label>
        <textarea
          id="message-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded min-h-[120px] focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
          placeholder={role === 'user' ? "Enter user message..." : "Enter assistant response..."}
        />
      </div>
      
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        disabled={!content.trim()}
      >
        Add Message
      </button>
    </form>
  );
}