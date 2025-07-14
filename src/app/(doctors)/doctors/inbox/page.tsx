"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Clock, User, MessageSquare } from "lucide-react";
import { getDoctorChats, getChatMessages, sendMessage } from "@/app/actions/chat";
import { Chat, ChatMessage } from "@/types/chats";

export default function DoctorInboxPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch chats on component mount
    useEffect(() => {
        fetchChats();
    }, []);

    // Set up polling for messages when a chat is selected
    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
            
            // Start polling every 4 seconds
            pollingIntervalRef.current = setInterval(() => {
                fetchMessages(selectedChat.id);
            }, 4000);

            return () => {
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                }
            };
        }
    }, [selectedChat]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const fetchedChats = await getDoctorChats();
            setChats(fetchedChats);
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            const fetchedMessages = await getChatMessages(chatId);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedChat || !newMessage.trim() || sending) return;

        try {
            setSending(true);
            const sentMessage = await sendMessage(selectedChat.id, newMessage.trim(), selectedChat.patient_id, 'USER');
            
            // Add the new message to the messages list
            setMessages(prev => [...prev, sentMessage]);
            
            // Update the chat list with the new last message
            setChats(prev => prev.map(chat => 
                chat.id === selectedChat.id 
                    ? { ...chat, last_message: sentMessage.content, last_message_time: sentMessage.timestamp }
                    : chat
            ));
            
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.patient_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (timestamp: string) => {
        try {
            // Handle ISO string format from API
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                return '';
            }
            return date.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (error) {
            return '';
        }
    };

    const formatDate = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                return '';
            }
            
            const now = new Date();
            const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
            
            if (diffInHours < 24) {
                return formatTime(timestamp);
            } else if (diffInHours < 48) {
                return 'Yesterday';
            } else {
                return date.toLocaleDateString();
            }
        } catch (error) {
            return '';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Chat List Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>
                    
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {searchTerm ? 'No conversations found' : 'No conversations yet'}
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                    selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10 flex-shrink-0">
                                        <AvatarImage src={chat.patient_profile_image || ""} alt={chat.patient_name || "Patient"} />
                                        <AvatarFallback>
                                            <User className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">{chat.patient_name || "Unknown Patient"}</h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                                                {chat.last_message}
                                            </p>
                                            <span className="text-xs text-gray-400 flex-shrink-0">
                                                {formatDate(chat.last_message_time)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarImage src={selectedChat.patient_profile_image || ""} alt={selectedChat.patient_name || "Patient"} />
                                    <AvatarFallback>
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-gray-900 truncate">{selectedChat.patient_name || "Unknown Patient"}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender_type === 'doctor' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow-sm ${
                                                message.sender_type === 'doctor'
                                                    ? 'bg-blue-600 text-white rounded-br-md'
                                                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                            <div
                                                className={`text-xs mt-1 ${
                                                    message.sender_type === 'doctor' ? 'text-blue-100' : 'text-gray-400'
                                                }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            <div className="flex space-x-3">
                                <Input
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={sending}
                                    className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || sending}
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}