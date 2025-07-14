import { useState, useEffect, useCallback } from 'react';
import { websocketService } from '@/service/websocketService';
import { WebSocketMessage } from '@/types/chat';

interface UseWebSocketProps {
  onMessage: (message: WebSocketMessage) => void;
}

export const useWebSocket = ({ onMessage }: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://accexx-backend-gbn6c.ondigitalocean.app';
      
      await websocketService.connect({
        url: wsUrl,
        token: '', // Will be retrieved from cookies by the service
        onMessage,
        onConnect: () => {
          setIsConnected(true);
          setIsConnecting(false);
          setError(null);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsConnecting(false);
        },
        onError: (errorMessage) => {
          setError(errorMessage);
          setIsConnecting(false);
        },
      });
    } catch (error) {
      setError('Failed to connect to WebSocket');
      setIsConnecting(false);
    }
  }, [onMessage]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const sendMessage = useCallback((message: { chatId: string; content: string; senderType: 'DOCTOR' }) => {
    websocketService.sendMessage(message);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    connect,
    disconnect,
  };
}; 