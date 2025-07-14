import React from 'react';
import { Chat } from '@/types/chat';

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  loading: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  loading,
}) => {
  const formatDistanceToNow = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-4xl mb-4">💬</div>
        <p className="text-lg font-medium">No conversations yet</p>
        <p className="text-sm">When patients start chatting, they'll appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedChat?.id === chat.id
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{chat.userName}</h3>
            {chat.lastMessageTime && (
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(chat.lastMessageTime)}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 truncate">
            {chat.lastMessage || 'No messages yet'}
          </p>
          
          {chat.unreadCount > 0 && (
            <div className="flex items-center justify-between mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {chat.unreadCount} unread
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 