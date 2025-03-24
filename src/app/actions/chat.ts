"use server"

import {cookies} from "next/headers";
import {BASE_URL} from "@/config/config";
import {ChatRequest} from "@/types/chats";

export async function createChat(chat: ChatRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const user_id = cookieStore.get("user_id")?.value;

    if (!user_id || !accessToken) {
        throw new Error("Authentication required");
    }

    // Validate required fields based on database schema
    if (!chat.appointment_id || !chat.patient_id || !chat.doctor_id) {
        console.error("Missing required fields for chat creation", chat);
        throw new Error("Missing required fields");
    }

    const requestBody = {
        appointment_id: chat.appointment_id,
        patient_id: chat.patient_id,
        doctor_id: chat.doctor_id,
    };

    try {
        const response = await fetch(`${BASE_URL}/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.detail || `Error: ${response.status} ${response.statusText}`;
            } catch (e) {
                console.error(e)
                errorMessage = `Error: ${response.status} ${response.statusText}`;
            }

            console.error("Failed to create chat:", errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Error creating chat:", err);
        throw err;
    }
}

/**
 * Get all chats for the current user
 */
export async function getUserChats() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const user_id = cookieStore.get("user_id")?.value;

    if (!user_id || !accessToken) {
        throw new Error("Authentication required");
    }

    try {
        const response = await fetch(`${BASE_URL}/chats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            cache: 'no-store' // Ensure we always get fresh data
        });

        if (!response.ok) {
            console.error("Failed to fetch chats:", response.status, response.statusText);
            throw new Error(`Failed to fetch chats: ${response.status}`);
        }

        return await response.json();

    } catch (err) {
        console.error("Error fetching chats:", err);
        throw err;
    }
}

/**
 * Get all messages for a specific chat
 */
export async function getChatMessages(chatId: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Authentication required");
    }

    if (!chatId) {
        throw new Error("Chat ID is required");
    }

    try {
        const response = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            cache: 'no-store' 
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch chat messages: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Error fetching chat messages:", err);
        throw err;
    }
}


export async function sendMessage(chatId: string, content: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const user_id = cookieStore.get("user_id")?.value;

    if (!accessToken || !user_id || !chatId || !content.trim()) {
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                sender_id: user_id,
                content: content
            })
        });

        if (!response.ok) {
            console.error("Failed to send message:", response.status, response.statusText);
            return null;
        }

        return await response.json();
    } catch (err) {
        console.error("Error sending message:", err);
        throw err;
    }
}