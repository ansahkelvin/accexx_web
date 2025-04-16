"use client"

import { WebSocketMessage } from '@/types/chats';

class ChatWebSocketService {
    private socket: WebSocket | null = null;
    private chatId: string | null = null;
    private messageHandlers: Array<(data: WebSocketMessage) => void> = [];
    private connectionHandlers: Array<(isConnected: boolean) => void> = [];
    private errorHandlers: Array<(error: string) => void> = [];
    private reconnectAttempts: number = 0;
    private reconnectInterval: NodeJS.Timeout | null = null;
    private readonly MAX_RECONNECT_ATTEMPTS: number = 5;
    private readonly RECONNECT_DELAY: number = 3000; // 3 seconds

    constructor() {
        // Initialize as null, will be created when connect() is called
        this.socket = null;
        this.chatId = null;
    }

    /**
     * Connect to a chat WebSocket
     * @param chatId The chat ID to connect to
     * @param token Authentication token (starts with "Bearer ")
     */
    connect(chatId: string, token: string): void {
        // Don't create multiple connections to the same chat
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

        if (this.socket && this.chatId === chatId && this.socket.readyState === WebSocket.OPEN) {
            return;
        }

        // Close any existing connections
        this.disconnect();

        // Store the chat ID
        this.chatId = chatId;

        // Create WebSocket URL
        // const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // const host = process.env.NEXT_PUBLIC_API_URL || window.location.host;
        const wsUrl = `ws://localhost:8000/ws/chats/${chatId}?token=${cleanToken}`;
        
        // Create new WebSocket
        this.socket = new WebSocket(wsUrl);

        // Setup event handlers
        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            this.reconnectAttempts = 0;
            this.clearReconnectInterval();
            this.notifyConnectionHandlers(true);
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as WebSocketMessage;
                this.notifyMessageHandlers(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
                this.notifyErrorHandlers('Error parsing message');
            }
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed', event.code, event.reason);
            this.notifyConnectionHandlers(false);

            // Try to reconnect on abnormal closure
            if (event.code !== 1000 && this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
                this.attemptReconnect();
            }
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.notifyErrorHandlers('Connection error');
        };
    }

    /**
     * Disconnect from the WebSocket server
     */
    disconnect(): void {
        this.clearReconnectInterval();

        if (this.socket) {
            // Remove all event handlers to prevent memory leaks
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onclose = null;
            this.socket.onerror = null;

            // Close the connection
            if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
                this.socket.close(1000, 'Client disconnected');
            }

            this.socket = null;
            this.chatId = null;
        }
    }

    /**
     * Attempt to reconnect to the WebSocket
     */
    private attemptReconnect(): void {
        this.reconnectAttempts += 1;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})...`);

        this.clearReconnectInterval();

        this.reconnectInterval = setTimeout(() => {
            if (this.chatId) {
                // Get fresh token
                const accessToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('access_token='))
                    ?.split('=')[1];

                if (accessToken) {
                    this.connect(this.chatId, `Bearer ${accessToken}`);
                } else {
                    this.notifyErrorHandlers('Authentication required for reconnect');
                }
            }
        }, this.RECONNECT_DELAY);
    }

    /**
     * Clear any reconnect interval
     */
    private clearReconnectInterval(): void {
        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
            this.reconnectInterval = null;
        }
    }

    /**
     * Send a message to the current chat
     * @param content Message content
     * @returns Whether the message was sent successfully
     */
    sendMessage(content: string): boolean {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            this.notifyErrorHandlers('Not connected');
            return false;
        }

        try {
            const messageData = { content };
            this.socket.send(JSON.stringify(messageData));
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            this.notifyErrorHandlers('Failed to send message');
            return false;
        }
    }

    /**
     * Register a handler for incoming messages
     * @param handler Function to call when a message is received
     * @returns Function to remove the handler
     */
    onMessage(handler: (data: WebSocketMessage) => void): () => void {
        this.messageHandlers.push(handler);
        return () => {
            this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Register a handler for connection status changes
     * @param handler Function to call when connection status changes
     * @returns Function to remove the handler
     */
    onConnectionChange(handler: (isConnected: boolean) => void): () => void {
        this.connectionHandlers.push(handler);
        return () => {
            this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Register a handler for error messages
     * @param handler Function to call when an error occurs
     * @returns Function to remove the handler
     */
    onError(handler: (errorMessage: string) => void): () => void {
        this.errorHandlers.push(handler);
        return () => {
            this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Notify all message handlers of a new message
     * @param data Message data
     */
    private notifyMessageHandlers(data: WebSocketMessage): void {
        this.messageHandlers.forEach(handler => handler(data));
    }

    /**
     * Notify all connection handlers of a connection status change
     * @param isConnected Whether the connection is now connected
     */
    private notifyConnectionHandlers(isConnected: boolean): void {
        this.connectionHandlers.forEach(handler => handler(isConnected));
    }

    /**
     * Notify all error handlers of an error
     * @param errorMessage Error message
     */
    private notifyErrorHandlers(errorMessage: string): void {
        this.errorHandlers.forEach(handler => handler(errorMessage));
    }

    /**
     * Check if the WebSocket is connected
     * @returns Whether the WebSocket is connected
     */
    isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    /**
     * Get the ID of the current chat
     * @returns Current chat ID or null if not connected
     */
    getCurrentChatId(): string | null {
        return this.chatId;
    }
}

// Create a singleton instance
const chatWebSocketService = new ChatWebSocketService();
export default chatWebSocketService;