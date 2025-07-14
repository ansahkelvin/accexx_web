# Flutter WebSocket Integration Guide

## Overview
The backend has been updated to use a simple WebSocket implementation instead of Socket.IO. This guide shows how to update your Flutter app to use the new WebSocket endpoint.

## Backend Changes Summary
- ❌ **Removed**: Socket.IO server (`/socket.io/`)
- ✅ **Added**: Simple WebSocket endpoint (`/chat`)
- ✅ **Maintained**: JWT authentication
- ✅ **Maintained**: Integration with existing Chat/Message system

## WebSocket Endpoint Details

### Connection URL
```
ws://your-server.com/chat?token=YOUR_JWT_TOKEN
```

### Authentication
- JWT token passed as query parameter: `?token=YOUR_JWT_TOKEN`
- Alternative: Send token in first message after connection

### Message Format
All messages use JSON format:

```json
{
  "chatId": "chat_123",
  "content": "Hello, doctor!",
  "senderType": "USER"
}
```

## Flutter Implementation

### 1. Update Dependencies

Remove Socket.IO dependencies and add WebSocket support:

```yaml
dependencies:
  web_socket_channel: ^2.4.0
  # Remove: socket_io_client
```

### 2. Create WebSocket Service

```dart
import 'dart:convert';
import 'dart:io';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;

class WebSocketService {
  WebSocketChannel? _channel;
  String? _jwtToken;
  String? _baseUrl;
  
  // Connection status
  bool _isConnected = false;
  bool get isConnected => _isConnected;
  
  // Event callbacks
  Function(Map<String, dynamic>)? onMessageReceived;
  Function()? onConnected;
  Function()? onDisconnected;
  Function(String)? onError;

  void initialize(String baseUrl, String jwtToken) {
    _baseUrl = baseUrl;
    _jwtToken = jwtToken;
  }

  Future<void> connect() async {
    if (_isConnected) return;
    
    try {
      final wsUrl = _baseUrl!.replaceAll('https://', 'wss://').replaceAll('http://', 'ws://');
      final uri = Uri.parse('$wsUrl/chat?token=$_jwtToken');
      
      _channel = WebSocketChannel.connect(uri);
      
      // Listen for connection
      _channel!.ready.then((_) {
        _isConnected = true;
        onConnected?.call();
        print('WebSocket connected successfully');
      }).catchError((error) {
        print('WebSocket connection failed: $error');
        onError?.call(error.toString());
      });
      
      // Listen for messages
      _channel!.stream.listen(
        (message) {
          try {
            final data = json.decode(message);
            onMessageReceived?.call(data);
          } catch (e) {
            print('Error parsing message: $e');
          }
        },
        onError: (error) {
          print('WebSocket error: $error');
          _isConnected = false;
          onError?.call(error.toString());
        },
        onDone: () {
          print('WebSocket connection closed');
          _isConnected = false;
          onDisconnected?.call();
        },
      );
      
    } catch (e) {
      print('WebSocket connection error: $e');
      onError?.call(e.toString());
    }
  }

  void sendMessage(String chatId, String content, String senderType) {
    if (!_isConnected || _channel == null) {
      print('WebSocket not connected');
      return;
    }

    final message = {
      'chatId': chatId,
      'content': content,
      'senderType': senderType, // 'USER' or 'DOCTOR'
    };

    try {
      _channel!.sink.add(json.encode(message));
      print('Message sent: $message');
    } catch (e) {
      print('Error sending message: $e');
      onError?.call(e.toString());
    }
  }

  void disconnect() {
    if (_channel != null) {
      _channel!.sink.close(status.goingAway);
      _channel = null;
    }
    _isConnected = false;
  }

  void dispose() {
    disconnect();
  }
}
```

### 3. Update Chat Screen

```dart
class ChatScreen extends StatefulWidget {
  final String chatId;
  final String userType; // 'USER' or 'DOCTOR'
  
  const ChatScreen({
    Key? key,
    required this.chatId,
    required this.userType,
  }) : super(key: key);

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final WebSocketService _webSocketService = WebSocketService();
  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  bool _isConnected = false;

  @override
  void initState() {
    super.initState();
    _initializeWebSocket();
  }

  void _initializeWebSocket() {
    // Get JWT token from your auth service
    final jwtToken = AuthService.getToken(); // Your method to get JWT
    final baseUrl = 'https://your-server.com'; // Your server URL
    
    _webSocketService.initialize(baseUrl, jwtToken);
    
    // Set up event listeners
    _webSocketService.onConnected = () {
      setState(() {
        _isConnected = true;
      });
      print('Connected to WebSocket');
    };
    
    _webSocketService.onDisconnected = () {
      setState(() {
        _isConnected = false;
      });
      print('Disconnected from WebSocket');
    };
    
    _webSocketService.onError = (error) {
      print('WebSocket error: $error');
      // Show error to user
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Connection error: $error')),
      );
    };
    
    _webSocketService.onMessageReceived = (message) {
      setState(() {
        _messages.add(message);
      });
      // Scroll to bottom, update UI, etc.
    };
    
    // Connect
    _webSocketService.connect();
  }

  void _sendMessage() {
    final content = _messageController.text.trim();
    if (content.isEmpty || !_isConnected) return;
    
    _webSocketService.sendMessage(
      widget.chatId,
      content,
      widget.userType,
    );
    
    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chat'),
        actions: [
          Container(
            margin: EdgeInsets.only(right: 16),
            child: Center(
              child: Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _isConnected ? Colors.green : Colors.red,
                ),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Connection status
          if (!_isConnected)
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(8),
              color: Colors.orange,
              child: Text(
                'Connecting...',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white),
              ),
            ),
          
          // Messages list
          Expanded(
            child: ListView.builder(
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return ListTile(
                  title: Text(message['content'] ?? ''),
                  subtitle: Text(message['senderType'] ?? ''),
                  trailing: Text(message['timestamp'] ?? ''),
                );
              },
            ),
          ),
          
          // Message input
          Container(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'Type a message...',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                SizedBox(width: 8),
                IconButton(
                  onPressed: _isConnected ? _sendMessage : null,
                  icon: Icon(Icons.send),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _webSocketService.dispose();
    _messageController.dispose();
    super.dispose();
  }
}
```

### 4. Handle Connection Status

```dart
// Add this to your service or state management
class ConnectionStatusService {
  static bool _isWebSocketConnected = false;
  
  static bool get isConnected => _isWebSocketConnected;
  
  static void setConnectionStatus(bool connected) {
    _isWebSocketConnected = connected;
    // Notify listeners, update UI, etc.
  }
}
```

## Key Differences from Socket.IO

| Feature | Socket.IO | Simple WebSocket |
|---------|-----------|------------------|
| **Connection** | `io('server.com')` | `WebSocketChannel.connect(uri)` |
| **Authentication** | `auth: {token: jwt}` | `?token=jwt` in URL |
| **Events** | `socket.on('event')` | `stream.listen()` |
| **Emit** | `socket.emit('event', data)` | `sink.add(json.encode(data))` |
| **Rooms** | Built-in | Manual implementation |
| **Reconnection** | Automatic | Manual implementation |

## Testing the Connection

1. **Deploy the backend** with the new WebSocket implementation
2. **Update your Flutter app** to use the new WebSocket service
3. **Test the connection** with the WebSocket URL: `ws://your-server.com/chat?token=jwt`

## Troubleshooting

### Common Issues:
1. **404 on `/socket.io/`**: Update Flutter to use `/chat` endpoint
2. **401 Unauthorized**: Check JWT token validity
3. **Connection refused**: Ensure backend is deployed with WebSocket support
4. **Message not received**: Check JSON format and chat ID

### Debug Steps:
1. Check WebSocket connection status in Flutter
2. Verify JWT token is valid
3. Check server logs for WebSocket connections
4. Test with a WebSocket client tool

## Migration Checklist

- [ ] Remove Socket.IO dependencies from Flutter
- [ ] Add WebSocket dependencies
- [ ] Update connection URL to `/chat`
- [ ] Update authentication to use query parameter
- [ ] Update message format to JSON
- [ ] Update event handling
- [ ] Test connection and messaging
- [ ] Deploy and verify in production

This implementation provides a cleaner, more reliable WebSocket connection with better error handling and connection status reporting. 