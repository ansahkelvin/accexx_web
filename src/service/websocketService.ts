import { WebSocketMessage } from '@/types/chat';

export interface WebSocketConfig {
  url: string;
  token: string;
  onMessage: (message: WebSocketMessage) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onError: (error: string) => void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private config: WebSocketConfig | null = null;

  private getAuthToken(): string {
    if (typeof window === 'undefined') return '';
    
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
      
    return token || '';
  }

  connect(config: WebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.config = config;
      this.isConnecting = true;

      try {
        // Use the token from cookies if not provided in config
        const token = config.token || this.getAuthToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

        const wsUrl = `${config.url}/chat?token=${token}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected successfully');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          config.onConnect();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            config.onMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.isConnecting = false;
          config.onDisconnect();
          
          // Attempt to reconnect if not manually closed
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          config.onError('Connection error occurred');
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        config.onError('Failed to create WebSocket connection');
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.isConnecting || !this.config) return;

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      // Get fresh token for reconnection
      const token = this.getAuthToken();
      if (token) {
        this.connect({
          ...this.config!,
          token
        });
      } else {
        this.config?.onError('Authentication required for reconnect');
      }
    }, delay);
  }

  sendMessage(message: { chatId: string; content: string; senderType: 'DOCTOR' }): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
      this.config?.onError('Not connected to server');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): number {
    return this.ws?.readyState || WebSocket.CLOSED;
  }
}

export const websocketService = new WebSocketService(); 