"use client"
import { useEffect, useState, useRef } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft, Filter } from 'lucide-react';
import Image from "next/image";
import { getUserChats, getChatMessages } from "@/app/actions/chat";
import { Chat, ChatMessage, WebSocketMessage } from "@/types/chats";
import chatWebSocketService from "@/service/sockets";

export default function InboxPage() {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState<string>('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(true);
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sendingMessage, setSendingMessage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [socketConnected, setSocketConnected] = useState<boolean>(false);

    // Refs for cleanup functions
    const messageHandlerCleanupRef = useRef<(() => void) | null>(null);
    const connectionHandlerCleanupRef = useRef<(() => void) | null>(null);
    const errorHandlerCleanupRef = useRef<(() => void) | null>(null);

    const fetchUserChats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserChats();
            if (response) {
                setChats(response);
            } else {
                setError("Failed to load chats. Please try again.");
            }
        } catch (e) {
            console.error(e);
            setError("An error occurred while fetching your conversations.");
        } finally {
            setLoading(false);
        }
    };

    const loadChatMessages = async (chatId: string) => {
        try {
            const response = await getChatMessages(chatId);
            if (response) {
                setMessages(response);
            }
        } catch (error) {
            console.error("Error loading chat messages:", error);
        }
    };

    useEffect(() => {
        fetchUserChats();

        // Cleanup function to disconnect WebSocket when component unmounts
        return () => {
            chatWebSocketService.disconnect();

            // Clean up all handlers
            if (messageHandlerCleanupRef.current) messageHandlerCleanupRef.current();
            if (connectionHandlerCleanupRef.current) connectionHandlerCleanupRef.current();
            if (errorHandlerCleanupRef.current) errorHandlerCleanupRef.current();
        };
    }, []);

    // Setup WebSocket connection and handlers when a chat is selected
    useEffect(() => {
        if (!selectedChat) return;

        // Clean up previous handlers
        if (messageHandlerCleanupRef.current) messageHandlerCleanupRef.current();
        if (connectionHandlerCleanupRef.current) connectionHandlerCleanupRef.current();
        if (errorHandlerCleanupRef.current) errorHandlerCleanupRef.current();

        // Get authentication token from server
        const setupWebSocket = async () => {
            try {
                // Import the server action to get the auth token
                const { getAuthToken } = await import('@/app/actions/auth');
                const { token, userId } = await getAuthToken();
                console.log(userId);

                if (!token) {
                    setError("Authentication required");
                    return;
                }

                // Setup message handler
                messageHandlerCleanupRef.current = chatWebSocketService.onMessage((data: WebSocketMessage) => {
                    // If there's an error message
                    if (data.error) {
                        console.error("WebSocket error:", data.error);
                        setError(data.error);
                        return;
                    }

                    // Handle incoming message
                    if (data.id && data.chat_id && data.sender_id && data.timestamp && data.sender_type) {
                        const newMessage: ChatMessage = {
                            id: data.id,
                            chat_id: data.chat_id,
                            sender_id: data.sender_id,
                            content: data.content,
                            timestamp: data.timestamp,
                            sender_type: data.sender_type
                        };

                        // Add message to the chat (avoiding duplicates)
                        setMessages(prev => {
                            // Check if message already exists
                            if (prev.some(msg => msg.id === newMessage.id)) {
                                return prev;
                            }
                            return [...prev, newMessage];
                        });

                        // Update chat list with the latest message
                        updateChatWithLatestMessage(data);
                    }
                });

                // Setup connection handler
                connectionHandlerCleanupRef.current = chatWebSocketService.onConnectionChange((isConnected: boolean) => {
                    setSocketConnected(isConnected);
                });

                // Setup error handler
                errorHandlerCleanupRef.current = chatWebSocketService.onError((errorMessage: string) => {
                    setError(errorMessage);
                });

                // Connect to chat with the token from server
                chatWebSocketService.connect(selectedChat.id, `Bearer ${token}`);
            } catch (error) {
                console.error("Error getting authentication token:", error);
                setError("Failed to authenticate. Please refresh the page.");
            }
        };

        // Execute the async function
        setupWebSocket();

    }, [selectedChat]);

    // Update chat list when a new message arrives
    const updateChatWithLatestMessage = (messageData: WebSocketMessage) => {
        if (!messageData.chat_id || !messageData.content || !messageData.timestamp) return;

        setChats(prevChats =>
            prevChats.map(chat => {
                if (chat.id === messageData.chat_id) {
                    return {
                        ...chat,
                        last_message: messageData.content,
                        last_message_time: messageData.timestamp as string
                    };
                }
                return chat;
            })
        );
    };

    const handleSendMessage = async () => {
        if (messageInput.trim() === "" || !selectedChat || sendingMessage || !socketConnected) return;

        setSendingMessage(true);
        try {
            // Send message through WebSocket service
            const success = chatWebSocketService.sendMessage(messageInput);

            if (success) {
                // Clear input (actual message will be added when it comes back through the socket)
                setMessageInput("");
            } else {
                setError("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Failed to send message. Please try again.");
        } finally {
            setSendingMessage(false);
        }
    };

    const handleSelectChat = (chat: Chat) => {
        setSelectedChat(chat);
        setMobileSidebarOpen(false);

        // Reset messages when selecting a new chat
        setMessages([]);

        // Load messages for this chat
        loadChatMessages(chat.id);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] flex-1 bg-gray-50 overflow-hidden">
            <div
                className={`
          w-full sm:w-80 lg:w-96 border-r border-gray-200 bg-white
          ${mobileSidebarOpen ? 'block' : 'hidden sm:block'} 
          ${selectedChat && mobileSidebarOpen ? 'absolute z-10 inset-0 sm:relative sm:inset-auto' : ''}
          h-full flex flex-col
        `}
            >
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Messages</h1>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Filter size={18} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full p-2 pl-9 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">{error}</div>
                    ) : chats.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No conversations yet</div>
                    ) : (
                        [...chats]
                            .sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime())
                            .map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedChat && selectedChat.id === chat.id ? "bg-blue-50" : ""
                                    }`}
                                    onClick={() => handleSelectChat(chat)}
                                >
                                    <div className="flex items-start">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full  overflow-hidden bg-gray-200">
                                                <Image
                                                    src={chat.patient_profile_image}
                                                    alt={chat.patient_name}
                                                    className="object-cover w-full h-full"
                                                    width={408}
                                                    height={508}
                                                />
                                            </div>
                                        </div>

                                        <div className="ml-3 flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-gray-900 truncate">{chat.patient_name}</h3>
                                                <span className="text-xs text-gray-500 ml-1 flex-shrink-0">
                                                      {new Date(chat.last_message_time).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 truncate">
                                                {chat.last_message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>

            {/* Main chat area */}
            <div className={`flex-1 flex flex-col h-full ${!mobileSidebarOpen ? 'block' : 'hidden sm:block'}`}>
                {selectedChat ? (
                    <>
                        {/* Mobile-only back button */}
                        <div className="sm:hidden p-2 bg-white border-b border-gray-200">
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className="flex items-center text-gray-600"
                            >
                                <ArrowLeft size={18} className="mr-1" />
                                <span className="text-sm">Back to conversations</span>
                            </button>
                        </div>

                        {/* Conversation Header */}
                        <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                    <Image
                                        src={selectedChat.patient_profile_image || '/api/placeholder/100/100'}
                                        alt={selectedChat.patient_name}
                                        className="object-cover w-full h-full"
                                        width={450}
                                        height={450}
                                    />
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-semibold text-gray-900">{selectedChat.patient_name}</h3>
                                    <div className="text-xs text-gray-500">
                                        {socketConnected ? (
                                            <span className="flex items-center">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                                You are online
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                                Offline
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-1">
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Phone size={18} className="text-gray-600" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Video size={18} className="text-gray-600" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <MoreVertical size={18} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 my-10">
                                        <p>No messages yet</p>
                                        <p className="text-sm mt-2">Start a conversation with {selectedChat.patient_name}</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender_type === "doctor" ? "justify-end" : "justify-start"}`}
                                        >
                                            {message.sender_type === "patient" && (
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 self-end mb-1 hidden sm:block">
                                                    <Image
                                                        src={selectedChat.patient_profile_image || '/api/placeholder/100/100'}
                                                        alt={selectedChat.patient_name}
                                                        className="object-cover"
                                                        width={32}
                                                        height={32}
                                                    />
                                                </div>
                                            )}

                                            <div
                                                className={`max-w-xs sm:max-w-md lg:max-w-lg p-3 rounded-lg ${
                                                    message.sender_type === "patient"
                                                        ? "bg-blue-500 text-white rounded-br-none"
                                                        : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                                                }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <p
                                                    className={`text-xs mt-1 ${
                                                        message.sender_type === "doctor" ? "text-black" : "text-white"
                                                    }`}
                                                >
                                                    {new Date(message.timestamp).toLocaleString()}
                                                </p>
                                            </div>

                                            {message.sender_type === "doctor" && (
                                                <div className="w-8 h-8 self-end mb-1 ml-2 hidden sm:block"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-3 border-t border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center max-w-4xl mx-auto">
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Paperclip size={18} className="text-gray-500" />
                                </button>
                                <input
                                    type="text"
                                    placeholder={socketConnected
                                        ? "Type your message..."
                                        : "Connecting to chat..."}
                                    className="flex-1 p-2 mx-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSendMessage();
                                        }
                                    }}
                                    disabled={sendingMessage || !socketConnected}
                                />
                                <button
                                    className={`p-2 rounded-full ${
                                        messageInput.trim() && !sendingMessage && socketConnected
                                            ? "bg-blue-500 hover:bg-blue-600"
                                            : "bg-gray-300"
                                    } text-white transition-colors`}
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim() || sendingMessage || !socketConnected}
                                >
                                    {sendingMessage ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Send size={18} />
                                    )}
                                </button>
                            </div>
                            {!socketConnected && selectedChat && (
                                <div className="text-center text-red-500 text-xs mt-1">
                                    Not connected. Please wait or refresh the page.
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                        <div className="text-center p-6 max-w-md">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No conversation selected</h3>
                            <p className="text-sm text-gray-500">Select a doctor from the list to start or continue a conversation.</p>
                            {chats.length === 0 && !loading && (
                                <p className="mt-4 text-sm text-gray-600">
                                    You don&#39;t have any conversations yet. Start one from your appointments page.
                                </p>
                            )}
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm sm:hidden"
                                onClick={() => setMobileSidebarOpen(true)}
                            >
                                View Conversations
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}