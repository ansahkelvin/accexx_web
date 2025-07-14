import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/service/chatService';
import { Chat, ChatMessage, SendMessageRequest } from '@/types/chat';
import { WebSocketMessage } from '@/types/chat';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      setChatsLoading(true);
      setError(null);
      const fetchedChats = await chatService.getDoctorChats();
      console.log('Fetched chats:', fetchedChats);
      setChats(fetchedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Failed to fetch chats. Please check your connection and try again.');
    } finally {
      setChatsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      setMessagesLoading(true);
      setError(null);
      console.log('Fetching messages for chat:', chatId);
      const fetchedMessages = await chatService.getChatMessages(chatId);
      console.log('Fetched messages:', fetchedMessages);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again.');
    } finally {
      setMessagesLoading(false);
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
          ? { ...chat, lastMessage: content, lastMessageTime: new Date().toISOString() }
          : chat
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  }, [selectedChat]);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    console.log('WebSocket message received:', message);
    if (message.content) {
      // Create a new message from WebSocket data
      const newMessage: ChatMessage = {
        id: message.id || `ws-${Date.now()}`,
        chat_id: message.chatId || message.chat_id || '',
        sender_id: message.sender_id || 'unknown',
        content: message.content,
        timestamp: message.timestamp || new Date().toISOString(),
        sender_type: message.sender_type || 'patient'
      };
      
      // Add message to current chat if it matches
      if (selectedChat && newMessage.chat_id === selectedChat.id) {
        setMessages(prev => [...prev, newMessage]);
      }

      // Update chat list
      setChats(prev => prev.map(chat => 
        chat.id === newMessage.chat_id 
          ? { ...chat, lastMessage: message.content, lastMessageTime: newMessage.timestamp }
          : chat
      ));
    }
  }, [selectedChat]);

  const selectChat = useCallback((chat: Chat) => {
    console.log('Selecting chat:', chat);
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
    loading: chatsLoading || messagesLoading,
    chatsLoading,
    messagesLoading,
    error,
    sendMessage,
    selectChat,
    handleWebSocketMessage,
    refetchChats: fetchChats,
  };
}; 