"use client"
import { useEffect, useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft, Filter } from 'lucide-react';
import Image from "next/image";
import { getUserChats, getChatMessages, sendMessage } from "@/app/actions/chat";
import { Chat, ChatMessage } from "@/types/chats";

export default function InboxPage() {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState<string>('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(true);
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sendingMessage, setSendingMessage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
    }, []);

    const handleSendMessage = async () => {
        if (messageInput.trim() === "" || !selectedChat || sendingMessage) return;

        setSendingMessage(true);
        try {
            // Optimistically update UI
            const newMessage: ChatMessage = {
                id: `temp-${Date.now()}`,
                chat_id: selectedChat.id,
                sender_id: "current-user", // Will be replaced by actual ID from server
                content: messageInput,
                timestamp: new Date().toISOString(),
                sender_type: 'patient'
            };

            // Add to messages
            setMessages(prev => [...prev, newMessage]);

            // Clear input
            setMessageInput("");

            // Send to server
            await sendMessage(selectedChat.id, messageInput);

            // Reload messages to get the actual saved message
            await loadChatMessages(selectedChat.id);

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
        <div className="flex h-full flex-1 bg-gray-50 overflow-hidden">
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
                                                    src={chat.doctor_profile_image || '/api/placeholder/100/100'}
                                                    alt={chat.doctor_name}
                                                    className="object-cover w-full h-full"
                                                    width={408}
                                                    height={408}
                                                />
                                            </div>
                                        </div>

                                        <div className="ml-3 flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-gray-900 truncate">{chat.doctor_name}</h3>
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
                                        src={selectedChat.doctor_profile_image}
                                        alt={selectedChat.doctor_name}
                                        className="object-cover w-full h-full"
                                        width={450}
                                        height={450}
                                    />
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-semibold text-gray-900">{selectedChat.doctor_name}</h3>
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
                                        <p className="text-sm mt-2">Start a conversation with {selectedChat.doctor_name}</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender_type === "patient" ? "justify-end" : "justify-start"}`}
                                        >
                                            {message.sender_type === "doctor" && (
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 self-end mb-1 hidden sm:block">
                                                    <Image
                                                        src={selectedChat.doctor_profile_image || '/api/placeholder/100/100'}
                                                        alt={selectedChat.doctor_name}
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
                                                        message.sender_type === "patient" ? "text-blue-100" : "text-gray-500"
                                                    }`}
                                                >
                                                    {new Date(message.timestamp).toLocaleString()}
                                                </p>
                                            </div>

                                            {message.sender_type === "patient" && (
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
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 mx-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSendMessage();
                                        }
                                    }}
                                    disabled={sendingMessage}
                                />
                                <button
                                    className={`p-2 rounded-full ${
                                        messageInput.trim() && !sendingMessage
                                            ? "bg-blue-500 hover:bg-blue-600"
                                            : "bg-gray-300"
                                    } text-white transition-colors`}
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim() || sendingMessage}
                                >
                                    {sendingMessage ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Send size={18} />
                                    )}
                                </button>
                            </div>
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