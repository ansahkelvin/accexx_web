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
        user_type: 'doctor' | 'patient';
    };
}

// Simple types based on the actual API response

export interface Chat {
    id: string;
    patient_name: string;
    doctor_name: string;
    patient_profile_image: string;
    doctor_profile_image: string;
    last_message: string;
    last_message_time: string;
}

export interface ChatMessage {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    timestamp: string;
    sender_type?: 'doctor' | 'patient';
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