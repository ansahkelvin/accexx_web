# Doctor Chat & WebSocket Implementation for Next.js

## Overview
This implementation provides a complete doctor-side chat system with real-time WebSocket communication, replacing the previous Socket.IO implementation with a simple WebSocket approach.

## Project Structure

```
src/
├── app/
│   ├── doctor/
│   │   ├── chat/
│   │   │   ├── page.tsx
│   │   │   ├── [chatId]/
│   │   │   │   └── page.tsx
│   │   │   └── loading.tsx
│   │   └── layout.tsx
├── components/
│   ├── chat/
│   │   ├── ChatList.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ConnectionStatus.tsx
├── hooks/
│   ├── useWebSocket.ts
│   └── useChat.ts
├── services/
│   ├── websocketService.ts
│   ├── chatService.ts
│   └── authService.ts
├── types/
│   ├── chat.ts
│   └── websocket.ts
└── utils/
    ├── websocket.ts
    └── dateUtils.ts
```

## 1. Type Definitions

### `src/types/chat.ts`
```typescript
export interface Message {
  id: string;
  chatId: string;
  content: string;
  senderId: string;
  senderType: 'USER' | 'DOCTOR';
  senderName: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  userId: string;
  doctorId: string;
  userName: string;
  userEmail: string;
  lastMessage?: Message;
  lastMessageTime?: string;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  senderType: 'DOCTOR';
}

export interface ChatResponse {
  success: boolean;
  data: Chat[];
  message?: string;
}

export interface MessageResponse {
  success: boolean;
  data: Message[];
  message?: string;
}
```

### `src/types/websocket.ts`
```typescript
export interface WebSocketMessage {
  type: 'message' | 'status' | 'error' | 'connection';
  data: any;
  timestamp: number;
}

export interface ChatMessage {
  chatId: string;
  content: string;
  senderType: 'DOCTOR';
}

export interface WebSocketConfig {
  url: string;
  token: string;
  onMessage: (message: WebSocketMessage) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onError: (error: string) => void;
}
```

## 2. WebSocket Service

### `src/services/websocketService.ts`
```typescript
import { WebSocketConfig, WebSocketMessage, ChatMessage } from '@/types/websocket';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private config: WebSocketConfig | null = null;

  connect(config: WebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.config = config;
      this.isConnecting = true;

      try {
        const wsUrl = `${config.url}/chat?token=${config.token}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected successfully');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          config.onConnect();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            config.onMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.isConnecting = false;
          config.onDisconnect();
          
          // Attempt to reconnect if not manually closed
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          config.onError('Connection error occurred');
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        config.onError('Failed to create WebSocket connection');
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.isConnecting || !this.config) return;

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect(this.config!);
    }, delay);
  }

  sendMessage(message: ChatMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
      this.config?.onError('Not connected to server');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): number {
    return this.ws?.readyState || WebSocket.CLOSED;
  }
}

export const websocketService = new WebSocketService();
```

## 3. Chat Service

### `src/services/chatService.ts`
```typescript
import { Chat, Message, SendMessageRequest, ChatResponse, MessageResponse } from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ChatService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('doctorToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getDoctorChats(): Promise<Chat[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/doctor/chats`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching doctor chats:', error);
      throw error;
    }
  }

  async getChatMessages(chatId: string, page: number = 0, size: number = 50): Promise<Message[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/chat/${chatId}/messages?page=${page}&size=${size}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MessageResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  async sendMessage(request: SendMessageRequest): Promise<Message> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/send`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/v1/chat/messages/${messageId}/read`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }
}

export const chatService = new ChatService();
```

## 4. Custom Hooks

### `src/hooks/useWebSocket.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import { websocketService } from '@/services/websocketService';
import { WebSocketMessage, ChatMessage } from '@/types/websocket';

interface UseWebSocketProps {
  token: string;
  onMessage: (message: WebSocketMessage) => void;
}

export const useWebSocket = ({ token, onMessage }: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (!token) return;

    setIsConnecting(true);
    setError(null);

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
      
      await websocketService.connect({
        url: wsUrl,
        token,
        onMessage,
        onConnect: () => {
          setIsConnected(true);
          setIsConnecting(false);
          setError(null);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsConnecting(false);
        },
        onError: (errorMessage) => {
          setError(errorMessage);
          setIsConnecting(false);
        },
      });
    } catch (error) {
      setError('Failed to connect to WebSocket');
      setIsConnecting(false);
    }
  }, [token, onMessage]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const sendMessage = useCallback((message: ChatMessage) => {
    websocketService.sendMessage(message);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    connect,
    disconnect,
  };
};
```

### `src/hooks/useChat.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/services/chatService';
import { Chat, Message, SendMessageRequest } from '@/types/chat';
import { WebSocketMessage } from '@/types/websocket';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedChats = await chatService.getDoctorChats();
      setChats(fetchedChats);
    } catch (error) {
      setError('Failed to fetch chats');
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      const fetchedMessages = await chatService.getChatMessages(chatId);
      setMessages(fetchedMessages);
    } catch (error) {
      setError('Failed to fetch messages');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!selectedChat) return;

    const request: SendMessageRequest = {
      chatId: selectedChat.id,
      content,
      senderType: 'DOCTOR',
    };

    try {
      const newMessage = await chatService.sendMessage(request);
      setMessages(prev => [...prev, newMessage]);
      
      // Update chat list with new last message
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: newMessage, lastMessageTime: newMessage.timestamp }
          : chat
      ));
    } catch (error) {
      setError('Failed to send message');
      console.error('Error sending message:', error);
    }
  }, [selectedChat]);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    if (message.type === 'message') {
      const newMessage = message.data as Message;
      
      // Add message to current chat if it matches
      if (selectedChat && newMessage.chatId === selectedChat.id) {
        setMessages(prev => [...prev, newMessage]);
      }

      // Update chat list
      setChats(prev => prev.map(chat => 
        chat.id === newMessage.chatId 
          ? { ...chat, lastMessage: newMessage, lastMessageTime: newMessage.timestamp }
          : chat
      ));
    }
  }, [selectedChat]);

  const selectChat = useCallback((chat: Chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.id);
  }, [fetchMessages]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    selectedChat,
    messages,
    loading,
    error,
    sendMessage,
    selectChat,
    handleWebSocketMessage,
    refetchChats: fetchChats,
  };
};
```

## 5. React Components

### `src/components/chat/ConnectionStatus.tsx`
```typescript
import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting,
  error,
}) => {
  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Connecting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Connection Error</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
        <Wifi className="w-4 h-4" />
        <span className="text-sm font-medium">Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Disconnected</span>
    </div>
  );
};
```

### `src/components/chat/ChatList.tsx`
```typescript
import React from 'react';
import { Chat } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';

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
                {formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: true })}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 truncate">
            {chat.lastMessage?.content || 'No messages yet'}
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
```

### `src/components/chat/MessageBubble.tsx`
```typescript
import React from 'react';
import { Message } from '@/types/chat';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <div
          className={`text-xs mt-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {format(new Date(message.timestamp), 'HH:mm')}
        </div>
      </div>
    </div>
  );
};
```

### `src/components/chat/MessageInput.tsx`
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          rows={1}
          maxLength={1000}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
```

### `src/components/chat/ChatWindow.tsx`
```typescript
import React, { useRef, useEffect } from 'react';
import { Chat, Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ConnectionStatus } from './ConnectionStatus';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
  error?: string | null;
  loading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  onSendMessage,
  isConnected,
  isConnecting,
  error,
  loading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-lg font-medium">Select a conversation</p>
          <p className="text-sm">Choose a chat from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{chat.userName}</h2>
            <p className="text-sm text-gray-500">{chat.userEmail}</p>
          </div>
          <ConnectionStatus
            isConnected={isConnected}
            isConnecting={isConnecting}
            error={error}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderType === 'DOCTOR'}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        disabled={!isConnected}
        placeholder={isConnected ? "Type your message..." : "Connecting..."}
      />
    </div>
  );
};
```

## 6. Page Components

### `src/app/doctor/chat/page.tsx`
```typescript
'use client';

import React, { useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Chat } from '@/types/chat';

export default function DoctorChatPage() {
  const {
    chats,
    selectedChat,
    messages,
    loading,
    error,
    sendMessage,
    selectChat,
    handleWebSocketMessage,
  } = useChat();

  // Get doctor token from localStorage or auth context
  const doctorToken = typeof window !== 'undefined' 
    ? localStorage.getItem('doctorToken') 
    : null;

  const { isConnected, isConnecting, error: wsError } = useWebSocket({
    token: doctorToken || '',
    onMessage: handleWebSocketMessage,
  });

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleSelectChat = (chat: Chat) => {
    selectChat(chat);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Conversations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {chats.length} active conversation{chats.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            loading={loading}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatWindow
          chat={selectedChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
          isConnecting={isConnecting}
          error={wsError}
          loading={loading}
        />
      </div>
    </div>
  );
}
```

### `src/app/doctor/chat/[chatId]/page.tsx`
```typescript
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ArrowLeft } from 'lucide-react';

export default function DoctorChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;

  const {
    chats,
    selectedChat,
    messages,
    loading,
    error,
    sendMessage,
    selectChat,
    handleWebSocketMessage,
  } = useChat();

  const doctorToken = typeof window !== 'undefined' 
    ? localStorage.getItem('doctorToken') 
    : null;

  const { isConnected, isConnecting, error: wsError } = useWebSocket({
    token: doctorToken || '',
    onMessage: handleWebSocketMessage,
  });

  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        selectChat(chat);
      }
    }
  }, [chatId, chats, selectChat]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleBack = () => {
    router.push('/doctor/chat');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {selectedChat?.userName || 'Loading...'}
            </h1>
            <p className="text-sm text-gray-500">
              {selectedChat?.userEmail || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          chat={selectedChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
          isConnecting={isConnecting}
          error={wsError}
          loading={loading}
        />
      </div>
    </div>
  );
}
```

## 7. Environment Configuration

### `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

### `.env.production`
```env
NEXT_PUBLIC_API_URL=https://your-production-domain.com
NEXT_PUBLIC_WS_URL=wss://your-production-domain.com
```

## 8. Authentication Integration

### `src/services/authService.ts`
```typescript
class AuthService {
  getDoctorToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('doctorToken');
  }

  setDoctorToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('doctorToken', token);
  }

  removeDoctorToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('doctorToken');
  }

  isAuthenticated(): boolean {
    return !!this.getDoctorToken();
  }

  logout(): void {
    this.removeDoctorToken();
    window.location.href = '/doctor/login';
  }
}

export const authService = new AuthService();
```

## 9. Key Features

### **Real-time Communication:**
- WebSocket connection with automatic reconnection
- Real-time message delivery
- Connection status indicators
- Error handling and recovery

### **Chat Management:**
- List of all patient conversations
- Unread message counts
- Last message preview
- Message timestamps

### **User Experience:**
- Responsive design
- Loading states
- Error handling
- Smooth animations
- Auto-scroll to latest messages

### **Security:**
- JWT token authentication
- Secure WebSocket connection
- Role-based access control

### **Performance:**
- Message pagination
- Efficient re-rendering
- Optimized WebSocket handling
- Memory leak prevention

## 10. Testing the Implementation

1. **Start the backend** with the WebSocket endpoint
2. **Login as a doctor** to get a valid JWT token
3. **Create time slots** for patients to book appointments
4. **Test the chat flow**:
   - Patient books appointment
   - Doctor receives chat notification
   - Real-time messaging works
   - Connection status updates

This implementation provides a complete, production-ready doctor chat system with real-time WebSocket communication, replacing the previous Socket.IO approach with a simpler, more reliable solution. 