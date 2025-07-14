import { Chat, ChatMessage, SendMessageRequest } from '@/types/chat';
import { getUserChats, getChatMessages, sendMessage as sendMessageAction } from '@/app/actions/chat';

class ChatService {
  async getDoctorChats(): Promise<Chat[]> {
    try {
      const response = await getUserChats();
      console.log('=== RAW API RESPONSE FOR CHATS ===');
      console.log('Response type:', typeof response);
      console.log('Response:', JSON.stringify(response, null, 2));
      
      // Handle different response formats
      if (Array.isArray(response)) {
        console.log('Response is array, length:', response.length);
        if (response.length > 0) {
          console.log('First chat object keys:', Object.keys(response[0]));
          console.log('First chat object:', response[0]);
        }
        // Transform to match Chat interface if needed
        return response.map((chat: any) => ({
          id: chat.id,
          userId: chat.userId || chat.user?.id,
          doctorId: chat.doctorId || chat.doctor?.id,
          userName: chat.userName || chat.user?.fullName || chat.user?.name,
          doctorName: chat.doctorName || chat.doctor?.fullName || chat.doctor?.name,
          doctorProfileImage: chat.doctorProfileImage || chat.doctor?.profileImage || '',
          lastMessage: chat.lastMessage || '',
          lastMessageTime: chat.lastMessageTime || chat.updatedAt,
          unreadCount: chat.unreadCount || 0,
          isActive: chat.isActive || true,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        }));
      }
      
      // If it's wrapped in a data property, extract it
      if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        const data = (response as any).data;
        console.log('Response has data property, length:', data.length);
        if (data.length > 0) {
          console.log('First chat object keys:', Object.keys(data[0]));
          console.log('First chat object:', data[0]);
        }
        return data.map((chat: any) => ({
          id: chat.id,
          userId: chat.userId || chat.user?.id,
          doctorId: chat.doctorId || chat.doctor?.id,
          userName: chat.userName || chat.user?.fullName || chat.user?.name,
          doctorName: chat.doctorName || chat.doctor?.fullName || chat.doctor?.name,
          doctorProfileImage: chat.doctorProfileImage || chat.doctor?.profileImage || '',
          lastMessage: chat.lastMessage || '',
          lastMessageTime: chat.lastMessageTime || chat.updatedAt,
          unreadCount: chat.unreadCount || 0,
          isActive: chat.isActive || true,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        }));
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
      
      // Handle different response formats
      if (Array.isArray(response)) {
        console.log('Messages array length:', response.length);
        if (response.length > 0) {
          console.log('First message object keys:', Object.keys(response[0]));
          console.log('First message object:', response[0]);
        }
        return response.map((message: any) => ({
          id: message.id,
          chat_id: message.chat_id || message.chatId,
          sender_id: message.sender_id || message.senderId,
          content: message.content,
          timestamp: message.timestamp || message.createdAt,
          sender_type: message.sender_type || message.senderType || 'doctor'
        }));
      }
      
      // If it's wrapped in a data property, extract it
      if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        const data = (response as any).data;
        console.log('Messages from data property, length:', data.length);
        if (data.length > 0) {
          console.log('First message object keys:', Object.keys(data[0]));
          console.log('First message object:', data[0]);
        }
        return data.map((message: any) => ({
          id: message.id,
          chat_id: message.chat_id || message.chatId,
          sender_id: message.sender_id || message.senderId,
          content: message.content,
          timestamp: message.timestamp || message.createdAt,
          sender_type: message.sender_type || message.senderType || 'doctor'
        }));
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
      // For doctor sending message, receiverId and receiverType need to be determined
      // This is a simplified approach - you may need to adjust based on your logic
      const response = await sendMessageAction(request.chatId, request.content, 'patient', 'USER');
      
      if (!response) {
        throw new Error('Failed to send message');
      }
      
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