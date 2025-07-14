"use client"
import { useEffect, useState, useRef } from 'react';
import { Search, Send, ArrowLeft, Filter, Bell } from 'lucide-react';
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
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const [sendingMessage, setSendingMessage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{message: string, chatId: string} | null>(null);
    const [unreadChats, setUnreadChats] = useState<Set<string>>(new Set());

    // Refs for polling and UI
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastMessageCountRef = useRef<number>(0);
    const previousChatsRef = useRef<string>('');
    const previousMessagesRef = useRef<string>('');

    const fetchUserChats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserChats();
            if (response) {
                setChats(response);
                previousChatsRef.current = JSON.stringify(response);
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
        setLoadingMessages(true);
        try {
            const response = await getChatMessages(chatId);
            if (response) {
                setMessages(response);
                previousMessagesRef.current = JSON.stringify(response);
                
                // Check for new messages and show notifications
                if (response.length > lastMessageCountRef.current && lastMessageCountRef.current > 0) {
                    const newMessages = response.slice(lastMessageCountRef.current);
                    const doctorMessages = newMessages.filter(msg => msg.sender_type === 'doctor');
                    
                    if (doctorMessages.length > 0 && selectedChat && selectedChat.id !== chatId) {
                        const chat = chats.find(c => c.id === chatId);
                        if (chat) {
                            const messageText = `${chat.doctor_name}: ${doctorMessages[0].content}`;
                            showNotification(messageText, chatId);
                            setUnreadChats(prev => {
                                const updated = new Set(prev);
                                updated.add(chatId);
                                return updated;
                            });
                        }
                    }
                }
                lastMessageCountRef.current = response.length;
            }
        } catch (error) {
            console.error("Error loading chat messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchUserChats();
    }, []);

    // Polling effect - only depends on selectedChat
    useEffect(() => {
        // Clear any existing interval
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        // Start polling for new messages every 4 seconds
        pollingIntervalRef.current = setInterval(async () => {
            try {
                // Fetch chats
                const newChats = await getUserChats();
                if (newChats && newChats.length > 0) {
                    const newChatsString = JSON.stringify(newChats);
                    if (newChatsString !== previousChatsRef.current) {
                        setChats(newChats);
                        previousChatsRef.current = newChatsString;
                    }
                }

                // Fetch messages if we have a selected chat
                if (selectedChat) {
                    const newMessages = await getChatMessages(selectedChat.id);
                    if (newMessages && newMessages.length > 0) {
                        const newMessagesString = JSON.stringify(newMessages);
                        if (newMessagesString !== previousMessagesRef.current) {
                            
                            // Check for new messages and show notifications
                            if (newMessages.length > lastMessageCountRef.current && lastMessageCountRef.current > 0) {
                                const newMessageItems = newMessages.slice(lastMessageCountRef.current);
                                const doctorMessages = newMessageItems.filter(msg => msg.sender_type === 'doctor');
                                
                                if (doctorMessages.length > 0) {
                                    const messageText = `${selectedChat.doctor_name}: ${doctorMessages[0].content}`;
                                    showNotification(messageText, selectedChat.id);
                                    setUnreadChats(prev => {
                                        const updated = new Set(prev);
                                        updated.add(selectedChat.id);
                                        return updated;
                                    });
                                }
                            }
                            lastMessageCountRef.current = newMessages.length;
                            setMessages(newMessages);
                            previousMessagesRef.current = newMessagesString;
                        }
                    }
                }
            } catch (error) {
                console.error("Error in polling:", error);
            }
        }, 4000);

        // Cleanup function
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }
        };
    }, [selectedChat]); // Only depends on selectedChat

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Load messages when a chat is selected
    useEffect(() => {
        if (!selectedChat) return;


        // Remove this chat from unread list when selected
        setUnreadChats(prev => {
            const updated = new Set(prev);
            updated.delete(selectedChat.id);
            return updated;
        });

        // Load messages for this chat
        loadChatMessages(selectedChat.id);
    }, [selectedChat]);

    // Show notification for 3 seconds
    const showNotification = (message: string, chatId: string) => {
        setNotification({ message, chatId });

        // Clear any existing timeout
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }

        // Set new timeout to clear notification after 3 seconds
        notificationTimeoutRef.current = setTimeout(() => {
            setNotification(null);
            notificationTimeoutRef.current = null;
        }, 3000);
    };

    const handleSendMessage = async () => {
        if (messageInput.trim() === "" || !selectedChat || sendingMessage) {
          
            return;
        }

        setSendingMessage(true);
        try {
            
            // Send message via HTTP API - patient sending to doctor
            const newMessage = await sendMessage(selectedChat.id, messageInput, selectedChat.doctor_id, 'DOCTOR');
            
            if (newMessage) {
                // Add message to local state
                setMessages(prev => [...prev, newMessage]);
                setMessageInput("");
                
                // Update chat list with new message
                setChats(prevChats => {
                    const updatedChats = prevChats.map(chat => {
                        if (chat.id === selectedChat.id) {
                            return {
                                ...chat,
                                last_message: newMessage.content,
                                last_message_time: newMessage.timestamp
                            };
                        }
                        return chat;
                    });
                    return updatedChats.sort((a, b) =>
                        new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
                    );
                });
            } else {
                console.error("Failed to send message");
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
        lastMessageCountRef.current = 0;

        // Load messages for this chat
        loadChatMessages(chat.id);

        // Remove from unread list
        setUnreadChats(prev => {
            const updated = new Set(prev);
            updated.delete(chat.id);
            return updated;
        });
    };

    // Navigate to chat from notification
    const handleNotificationClick = (chatId: string) => {
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
            handleSelectChat(chat);
        } else {
        }

        setNotification(null);
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] flex-1 bg-gray-50 overflow-hidden">
            {/* Toast notification for new messages */}
            {notification && (
                <div
                    className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 max-w-xs z-50 cursor-pointer border-l-4 border-green-500 animate-slideUp"
                    onClick={() => handleNotificationClick(notification.chatId)}
                >
                    <div className="flex items-center">
                        <Bell size={18} className="text-green-500 mr-2" />
                        <div>
                            <p className="font-medium text-gray-800 text-sm">New Message</p>
                            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}

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
                        // Skeleton loaders for chat list
                        Array(5).fill(0).map((_, index) => (
                            <div key={`skeleton-${index}`} className="p-3 border-b border-gray-200">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="ml-3 flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full mt-2 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">{error}</div>
                    ) : chats.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No conversations yet</div>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                                    selectedChat && selectedChat.id === chat.id ? "bg-blue-50" : ""
                                }`}
                                onClick={() => handleSelectChat(chat)}
                            >
                                <div className="flex items-start">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                            {chat.doctor_profile_image ? (
                                                <Image
                                                    src={chat.doctor_profile_image}
                                                    alt={chat.doctor_name || ''}
                                                    className="object-cover w-full h-full"
                                                    width={408}
                                                    height={408}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-gray-600 text-xs">
                                                        {chat.doctor_name ? chat.doctor_name.charAt(0).toUpperCase() : 'D'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Important: Only show green dot for unread chats */}
                                        {unreadChats.has(chat.id) && (
                                            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>

                                    <div className="ml-3 flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <h3 className={`font-semibold truncate ${unreadChats.has(chat.id) ? "text-gray-900" : "text-gray-700"}`}>
                                                {chat.doctor_name}
                                            </h3>
                                            <span className="text-xs text-gray-500 ml-1 flex-shrink-0">
                                                {chat.last_message_time && new Date(chat.last_message_time).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm mt-1 truncate ${unreadChats.has(chat.id) ? "font-medium text-gray-800" : "text-gray-500"}`}>
                                            {chat.last_message?? "No messages yet"}
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
                                    {selectedChat.doctor_profile_image ? (
                                        <Image
                                            src={selectedChat.doctor_profile_image}
                                            alt={selectedChat.doctor_name || ''}
                                            className="object-cover w-full h-full"
                                            width={450}
                                            height={450}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-gray-600 text-xs">
                                                {selectedChat.doctor_name ? selectedChat.doctor_name.charAt(0).toUpperCase() : 'D'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-semibold text-gray-900">{selectedChat.doctor_name}</h3>
                                    <div className="text-xs text-gray-500">
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                            Online
                                        </span>
                                    </div>
                                </div>
                            </div>

                          
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {loadingMessages ? (
                                    // Skeleton loaders for messages
                                    <>
                                        {/* Doctor message skeleton */}
                                        <div className="flex justify-start">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-2 self-end mb-1 hidden sm:block"></div>
                                            <div className="max-w-xs sm:max-w-md bg-gray-200 animate-pulse p-3 rounded-lg rounded-bl-none h-16"></div>
                                        </div>

                                        {/* Patient message skeleton */}
                                        <div className="flex justify-end">
                                            <div className="max-w-xs sm:max-w-md bg-blue-200 animate-pulse p-3 rounded-lg rounded-br-none h-12"></div>
                                            <div className="w-8 h-8 self-end mb-1 ml-2 hidden sm:block"></div>
                                        </div>

                                        {/* Doctor message skeleton */}
                                        <div className="flex justify-start">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-2 self-end mb-1 hidden sm:block"></div>
                                            <div className="max-w-xs sm:max-w-md bg-gray-200 animate-pulse p-3 rounded-lg rounded-bl-none h-20"></div>
                                        </div>
                                    </>
                                ) : messages.length === 0 ? (
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
                                                    {selectedChat.doctor_profile_image ? (
                                                        <Image
                                                            src={selectedChat.doctor_profile_image}
                                                            alt={selectedChat.doctor_name || ''}
                                                            className="object-cover h-full w-full"
                                                            width={520}
                                                            height={520}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-gray-600 text-xs">
                                                                {selectedChat.doctor_name ? selectedChat.doctor_name.charAt(0).toUpperCase() : 'D'}
                                                            </span>
                                                        </div>
                                                    )}
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
                                                    {(() => {
                                                        try {
                                                            const date = new Date(message.timestamp);
                                                            if (isNaN(date.getTime())) return '';
                                                            return date.toLocaleTimeString([], { 
                                                                hour: '2-digit', 
                                                                minute: '2-digit' 
                                                            });
                                                        } catch (error) {
                                                            return '';
                                                        }
                                                    })()}
                                                </p>
                                            </div>

                                            {message.sender_type === "patient" && (
                                                <div className="w-8 h-8 self-end mb-1 ml-2 hidden sm:block"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                                {/* Invisible div for scrolling to bottom */}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-3 border-t border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center max-w-4xl mx-auto">
                               
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
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                            <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}