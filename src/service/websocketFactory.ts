"use client"

export class WebSocketFactory {
    /**
     * Creates a configured WebSocket connection with unified error handling and reconnection logic
     *
     * @param endpoint The WebSocket endpoint path (e.g., "/ws/chats/123")
     * @param token Authentication token
     * @param params Additional query parameters
     * @param options Configuration options
     * @returns A configured WebSocket instance with added helper methods
     */
    static createWebSocket(
        endpoint: string,
        token: string,
        params: Record<string, string> = {},
        options: WebSocketOptions = {}
    ): EnhancedWebSocket {
        // Prepare base URL
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = process.env.NEXT_PUBLIC_API_URL || window.location.host;

        // Add token to params if provided
        if (token) {
            params = { ...params, token };
        }

        // Build query string
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        // Create final URL - update to use the new WebSocket endpoint
        const wsUrl = `${protocol}//${host}/ws${endpoint}${queryString ? '?' + queryString : ''}`;

        // Create socket with default options
        const defaultOptions: WebSocketOptions = {
            maxReconnectAttempts: 5,
            reconnectDelay: 3000,
            debug: false,
            ...options
        };

        return new EnhancedWebSocket(wsUrl, defaultOptions);
    }
}

export interface WebSocketOptions {
    maxReconnectAttempts?: number;
    reconnectDelay?: number;
    debug?: boolean;
    protocols?: string | string[];
}

export class EnhancedWebSocket {
    private socket: WebSocket | null = null;
    private url: string;
    private options: Required<WebSocketOptions>;
    private reconnectAttempts = 0;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private messageHandlers: Array<(data: any) => void> = [];
    private connectionHandlers: Array<(status: boolean) => void> = [];
    private errorHandlers: Array<(error: string) => void> = [];

    constructor(url: string, options: WebSocketOptions) {
        this.url = url;
        this.options = {
            maxReconnectAttempts: 5,
            reconnectDelay: 3000,
            debug: false,
            protocols: [],
            ...options
        };
    }

    /**
     * Connects to the WebSocket server
     */
    connect(): void {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            this.log('WebSocket is already connecting or connected');
            return;
        }

        this.log(`Connecting to ${this.url}`);

        try {
            this.socket = new WebSocket(this.url, this.options.protocols);

            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
            this.socket.onerror = this.handleError.bind(this);
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * Disconnects from the WebSocket server
     */
    disconnect(code: number = 1000, reason: string = 'Client disconnected'): void {
        this.clearReconnectTimer();

        if (this.socket) {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.close(code, reason);
            }

            // Clean up event handlers to prevent memory leaks
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onclose = null;
            this.socket.onerror = null;

            this.socket = null;
            this.notifyConnectionHandlers(false);
        }
    }

    /**
     * Sends a message to the WebSocket server
     */
    send(data: any): boolean {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            this.notifyErrorHandlers('Cannot send message: WebSocket is not connected');
            return false;
        }

        try {
            const message = typeof data === 'string' ? data : JSON.stringify(data);
            this.socket.send(message);
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Registers a handler for incoming messages
     */
    onMessage(handler: (data: any) => void): () => void {
        this.messageHandlers.push(handler);
        return () => {
            this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Registers a handler for connection status changes
     */
    onConnectionChange(handler: (isConnected: boolean) => void): () => void {
        this.connectionHandlers.push(handler);
        return () => {
            this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Registers a handler for error messages
     */
    onError(handler: (errorMessage: string) => void): () => void {
        this.errorHandlers.push(handler);
        return () => {
            this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Checks if the WebSocket is currently connected
     */
    isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    /**
     * Gets the current connection state
     */
    getState(): number | null {
        return this.socket ? this.socket.readyState : null;
    }

    private handleOpen(event: Event): void {
        this.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            this.notifyMessageHandlers(data);
        } catch (error) {
            this.log('Error parsing WebSocket message:', error);
            this.notifyErrorHandlers('Error parsing message');
        }
    }

    private handleClose(event: CloseEvent): void {
        this.log(`WebSocket closed: ${event.code} ${event.reason}`);
        this.notifyConnectionHandlers(false);

        // Attempt to reconnect on abnormal closures
        if (event.code !== 1000 && event.code !== 1001) {
            this.attemptReconnect();
        }
    }

    private handleError(event: Event | any): void {
        this.log('WebSocket error:', event);
        this.notifyErrorHandlers('Connection error');
    }

    private handleInitializationError(error: any): void {
        this.log('Failed to initialize WebSocket:', error);
        this.notifyErrorHandlers('Failed to initialize WebSocket connection');
        this.attemptReconnect();
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
            this.log(`Maximum reconnect attempts (${this.options.maxReconnectAttempts}) reached`);
            this.notifyErrorHandlers('Failed to reconnect after multiple attempts');
            return;
        }

        this.reconnectAttempts++;
        this.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})...`);

        this.clearReconnectTimer();

        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, this.options.reconnectDelay);
    }

    private clearReconnectTimer(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    private notifyMessageHandlers(data: any): void {
        this.messageHandlers.forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                this.log('Error in message handler:', error);
            }
        });
    }

    private notifyConnectionHandlers(isConnected: boolean): void {
        this.connectionHandlers.forEach(handler => {
            try {
                handler(isConnected);
            } catch (error) {
                this.log('Error in connection handler:', error);
            }
        });
    }

    private notifyErrorHandlers(errorMessage: string): void {
        this.errorHandlers.forEach(handler => {
            try {
                handler(errorMessage);
            } catch (error) {
                this.log('Error in error handler:', error);
            }
        });
    }

    private log(...args: any[]): void {
        if (this.options.debug) {
            console.log('[WebSocket]', ...args);
        }
    }
}

export default WebSocketFactory;