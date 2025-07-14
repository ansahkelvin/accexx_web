import { Chat, ChatMessage, SendMessageRequest } from '@/types/chat';
import { getUserChats, getChatMessages, sendMessage as sendMessageAction } from '@/app/actions/chat';

class ChatService {
  async getDoctorChats(): Promise<Chat[]> {
    try {
      const response = await getUserChats();
      console.log('=== RAW API RESPONSE FOR CHATS ===');
      console.log('Response type:', typeof response);
      console.log('Response:', JSON.stringify(response, null, 2));
      
      // Return the response directly - it should already be in the correct format
      if (Array.isArray(response)) {
        console.log('Response is array, length:', response.length);
        if (response.length > 0) {
          console.log('First chat object keys:', Object.keys(response[0]));
          console.log('First chat object:', response[0]);
        }
        return response;
      }
      
      // If it's wrapped in a data property, extract it
      if (response && typeof response === 'object' && response.data && Array.isArray(response.data)) {
        console.log('Response has data property, length:', response.data.length);
        if (response.data.length > 0) {
          console.log('First chat object keys:', Object.keys(response.data[0]));
          console.log('First chat object:', response.data[0]);
        }
        return response.data;
      }
      
      console.warn('Unexpected response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching doctor chats:', error);
      throw error;
    }
  }

  async getChatMessages(chatId: string, page: number = 0, size: number = 50): Promise<ChatMessage[]> {
    try {
      console.log('Calling getChatMessages for chatId:', chatId);
      const response = await getChatMessages(chatId);
      console.log('=== RAW API RESPONSE FOR MESSAGES ===');
      console.log('Response type:', typeof response);
      console.log('Response:', JSON.stringify(response, null, 2));
      
      // Return the response directly
      if (Array.isArray(response)) {
        console.log('Messages array length:', response.length);
        if (response.length > 0) {
          console.log('First message object keys:', Object.keys(response[0]));
          console.log('First message object:', response[0]);
        }
        return response;
      }
      
      // If it's wrapped in a data property, extract it
      if (response && typeof response === 'object' && response.data && Array.isArray(response.data)) {
        console.log('Messages from data property, length:', response.data.length);
        if (response.data.length > 0) {
          console.log('First message object keys:', Object.keys(response.data[0]));
          console.log('First message object:', response.data[0]);
        }
        return response.data;
      }
      
      console.warn('Unexpected messages response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  async sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
    try {
      const response = await sendMessageAction(request.chatId, request.content);
      
      if (!response) {
        throw new Error('Failed to send message');
      }
      
      // Return the response directly
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    // This would need to be implemented as a server action
    console.log('Marking message as read:', messageId);
  }
}

export const chatService = new ChatService(); 