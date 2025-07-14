// Types for the chat feature based on actual database schema

export interface Message {
    id: string; // UUID
    chat_id: string; // UUID
    sender_id: string; // UUID
    content: string;
    timestamp: string; // DateTime
    sender?: {
        id: string;
        name: string;
        profile_image?: string;
        role: 'doctor' | 'patient';
    };
}

// Chat interface that matches the API response structure
export interface Chat {
    id: string;
    appointment_id: string;
    patient_id: string;
    doctor_id: string;
    created_at: string;
    updated_at: string;
    // For doctor view - patient information
    patient_name?: string;
    patient_profile_image?: string;
    // For patient view - doctor information  
    doctor_name?: string;
    doctor_profile_image?: string;
    // Common fields
    last_message: string;
    last_message_time: string;
}

export interface ChatRequest {
    appointment_id: string;
    patient_id: string;
    doctor_id: string;
}

export interface SendMessageRequest {
    chat_id: string;
    sender_id: string;
    content: string;
}

// Types for the UI components
export interface UIChatMessage {
    id: string;
    sender: 'doctor' | 'patient';
    content: string;
    timestamp: string;
    sender_id: string;
}

export interface UIChatDoctor {
    id: string;
    name: string;
    specialty?: string;
    avatar?: string;
    online?: boolean;
}

export interface UIChat {
    id: string;
    doctor_name: UIChatDoctor;
    doctor_profile_image: string;
    appointment_id: string;
    messages: UIChatMessage[];
    unread: number;
    lastMessageTime: string;
}

export interface ChatMessage {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    timestamp: string;
    sender_type: 'patient' | 'doctor';
}

// WebSocket message types based on the Flutter integration guide
export interface WebSocketMessage {
    // Message content (required)
    content: string;
    
    // Message metadata
    id?: string;
    chatId?: string;
    chat_id?: string;
    sender_id?: string;
    timestamp?: string;
    
    // Sender information
    sender_type?: 'patient' | 'doctor';
    senderType?: 'USER' | 'DOCTOR';
    sender_name?: string;
    sender_profile_image?: string;
    
    // Error handling
    error?: string;
    type?: 'message' | 'status' | 'error' | 'connection';
    data?: any;
}

export interface ConnectionStatus {
    isConnected: boolean;
    reconnecting: boolean;
    attempts: number;
}