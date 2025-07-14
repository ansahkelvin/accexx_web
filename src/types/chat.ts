// Types that match the actual API response structure
export interface Chat {
  id: string;
  userId: string;
  doctorId: string;
  userName: string;
  doctorName: string;
  doctorProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  sender_type: 'patient' | 'doctor';
}

// Legacy types for backward compatibility
export interface ChatRequest {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
}

// WebSocket message types
export interface WebSocketMessage {
  id?: string;
  chatId?: string;
  chat_id?: string;
  sender_id?: string;
  content: string;
  timestamp?: string;
  sender_type?: 'patient' | 'doctor';
  senderType?: 'USER' | 'DOCTOR';
  sender_name?: string;
  sender_profile_image?: string;
  error?: string;
  type?: 'message' | 'status' | 'error' | 'connection';
  data?: any;
}

export interface ConnectionStatus {
  isConnected: boolean;
  reconnecting: boolean;
  attempts: number;
}

// Request types
export interface SendMessageRequest {
  chatId: string;
  content: string;
  senderType: 'DOCTOR';
} 