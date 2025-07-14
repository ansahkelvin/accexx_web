"use server"

import { cookies } from "next/headers";
import { BASE_URL } from "@/config/config";
import { Chat, ChatMessage } from "@/types/chats";

export interface ChatRequest {
    appointment_id: string;
    patient_id: string;
    doctor_id: string;
}

export async function getDoctorChats(): Promise<Chat[]> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(`${BASE_URL}/v1/chat/doctor/chats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform the API response to match Chat interface
        const chats: Chat[] = (data || []).map((chat: any) => ({
            id: chat.id,
            appointment_id: '',
            patient_id: chat.userId,
            doctor_id: chat.doctorId,
            created_at: chat.createdAt,
            updated_at: chat.updatedAt,
            patient_name: chat.userName,
            patient_profile_image: '',
            last_message: chat.lastMessage || '',
            last_message_time: chat.lastMessageTime || chat.updatedAt
        }));
        
        return chats;
    } catch (error) {
        console.error("Error fetching doctor chats:", error);
        throw error;
    }
}

export async function getUserChats(): Promise<Chat[]> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            console.error("No access token found");
            throw new Error("No access token found");
        }

        const endpoint = `${BASE_URL}/v1/chat/user/chats`;
        // console.log("Fetching user chats from:", endpoint);

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            cache: "no-store"
        });

        // console.log("Response status:", response.status);
        // console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        // console.log("API Response data:", data);
        
        // Transform the API response to match Chat interface
        const chats: Chat[] = (data || []).map((chat: any) => ({
            id: chat.id,
            appointment_id: chat.appointmentId || '',
            patient_id: chat.userId,
            doctor_id: chat.doctorId,
            created_at: chat.createdAt,
            updated_at: chat.updatedAt,
            doctor_name: chat.doctorName,
            doctor_profile_image: chat.doctorProfileImage,
            last_message: chat.lastMessage,
            last_message_time: chat.lastMessageTime
        }));
        
        // console.log("Transformed chats:", chats);
        return chats;
    } catch (error) {
        console.error("Error fetching user chats:", error);
        // Return empty array instead of throwing to prevent UI breakage
        return [];
    }
}

export async function getChatMessages(chatId: string, page: number = 0, size: number = 50): Promise<ChatMessage[]> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(
            `${BASE_URL}/v1/chat/${chatId}/messages/all`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform the API response to match ChatMessage interface
        const messages: ChatMessage[] = (data || []).map((msg: any) => ({
            id: msg.id,
            chat_id: msg.chatId,
            sender_id: msg.senderId,
            content: msg.content,
            timestamp: msg.sentAt || msg.updatedAt,
            sender_type: msg.senderType === 'USER' ? 'patient' : 'doctor'
        }));
        
        return messages;
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        throw error;
    }
}

// Only allow sending messages to existing chats
export async function sendMessage(
    chatId: string,
    content: string,
    receiverId: string,
    receiverType: 'USER' | 'DOCTOR'
): Promise<ChatMessage> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;
        if (!accessToken) {
            throw new Error("No access token found");
        }
        if (!chatId) {
            throw new Error("chatId is required to send a message");
        }
        const endpoint = `${BASE_URL}/v1/chat/send`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                chatId,
                content,
                receiverId,
                receiverType
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        const message: ChatMessage = {
            id: data.id,
            chat_id: data.chatId || data.chat_id,
            sender_id: data.senderId || data.sender_id,
            content: data.content,
            timestamp: data.sentAt || data.timestamp || new Date().toISOString(),
            sender_type: data.senderType === 'USER' ? 'patient' : 'doctor'
        };
        return message;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}

export async function markMessageAsRead(messageId: string): Promise<void> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(`${BASE_URL}/v1/chat/messages/${messageId}/read`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error marking message as read:", error);
        throw error;
    }
}