import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting,
  error,
}) => {
  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Connecting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Connection Error</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
        <Wifi className="w-4 h-4" />
        <span className="text-sm font-medium">Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Disconnected</span>
    </div>
  );
}; 