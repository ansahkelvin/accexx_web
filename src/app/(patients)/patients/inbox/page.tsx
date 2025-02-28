"use client"
import { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';

// Define TypeScript interfaces
interface Message {
    id: number;
    sender: 'doctor' | 'patient';
    content: string;
    timestamp: string;
}

interface Doctor {
    id: number;
    name: string;
    specialty: string;
    avatar: string;
    online: boolean;
}

interface Conversation {
    id: number;
    doctor: Doctor;
    messages: Message[];
    unread: number;
}

export default function InboxPage() {
    const [selectedDoctor, setSelectedDoctor] = useState<Conversation | null>(null);
    const [messageInput, setMessageInput] = useState<string>('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(true);
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: 1,
            doctor: {
                id: 1,
                name: "Dr. Sarah Johnson",
                specialty: "Cardiologist",
                avatar: "https://images.unsplash.com/photo-1739382120665-fa6bcf8b7833?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D0",
                online: true
            },
            messages: [
                {
                    id: 1,
                    sender: "doctor",
                    content: "Hello, how are you feeling today? Have you been monitoring your blood pressure as we discussed?",
                    timestamp: "Today, 10:30 AM"
                },
                {
                    id: 2,
                    sender: "patient",
                    content: "Hello Dr. Johnson, yes I have. My readings have been within the range you suggested, usually around 120/80.",
                    timestamp: "Today, 10:35 AM"
                },
                {
                    id: 3,
                    sender: "doctor",
                    content: "That's excellent news! Keep it up and remember to take your medication regularly. Any side effects to report?",
                    timestamp: "Today, 10:38 AM"
                }
            ],
            unread: 1
        },
        {
            id: 2,
            doctor: {
                id: 2,
                name: "Dr. Michael Chen",
                specialty: "Dermatologist",
                avatar: "https://images.unsplash.com/photo-1735656244034-6b2b53d2657d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                online: false
            },
            messages: [
                {
                    id: 1,
                    sender: "patient",
                    content: "Dr. Chen, I've been applying the prescribed cream but the rash seems to be spreading slightly.",
                    timestamp: "Yesterday, 3:15 PM"
                },
                {
                    id: 2,
                    sender: "doctor",
                    content: "Could you send me a photo of the affected area? I'd like to see how it's progressing.",
                    timestamp: "Yesterday, 4:22 PM"
                }
            ],
            unread: 0
        },
        {
            id: 3,
            doctor: {
                id: 3,
                name: "Dr. Emily Rodriguez",
                specialty: "Neurologist",
                avatar: "https://images.unsplash.com/photo-1738762518712-8cab51776881?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                online: true
            },
            messages: [
                {
                    id: 1,
                    sender: "doctor",
                    content: "Your test results look good. I'd like to follow up with you next week to discuss how the new medication is working.",
                    timestamp: "Monday, 11:45 AM"
                }
            ],
            unread: 1
        }
    ]);

    const handleSendMessage = () => {
        if (messageInput.trim() === "" || !selectedDoctor) return;

        const updatedConversations = conversations.map(convo => {
            if (convo.id === selectedDoctor.id) {
                return {
                    ...convo,
                    messages: [
                        ...convo.messages,
                        {
                            id: convo.messages.length + 1,
                            sender: "patient" as const,
                            content: messageInput,
                            timestamp: "Just now"
                        }
                    ]
                };
            }
            return convo;
        });

        setConversations(updatedConversations);
        setMessageInput("");
    };

    const handleSelectDoctor = (conversation: Conversation) => {
        setSelectedDoctor(conversation);
        setMobileSidebarOpen(false);
    };

    return (
        <div className="flex h-[85vh] bg-gray-50">
            {/* Sidebar - always visible on desktop/tablet, toggleable on mobile */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 bg-white md:block
                ${mobileSidebarOpen ? 'block' : 'hidden'} 
                ${selectedDoctor ? 'absolute md:relative z-10 inset-0 md:inset-auto' : ''}`}
            >
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100%-80px)]">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedDoctor && selectedDoctor.id === conversation.id ? "bg-blue-50" : ""
                            }`}
                            onClick={() => handleSelectDoctor(conversation)}
                        >
                            <div className="flex items-start">
                                <div className="relative">
                                    <img
                                        src={conversation.doctor.avatar}
                                        alt={conversation.doctor.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {conversation.doctor.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                    )}
                                </div>

                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-900">{conversation.doctor.name}</h3>
                                        <span className="text-xs text-gray-500">
                                            {conversation.messages[conversation.messages.length - 1].timestamp.split(",")[0]}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{conversation.doctor.specialty}</p>
                                    <p className="text-sm text-gray-500 mt-1 truncate">
                                        {conversation.messages[conversation.messages.length - 1].content}
                                    </p>
                                </div>

                                {conversation.unread > 0 && (
                                    <span className="ml-2 bg-blue-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {conversation.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main chat area */}
            <div className={`flex-1 flex flex-col ${!mobileSidebarOpen ? 'block' : 'hidden md:block'}`}>
                {selectedDoctor ? (
                    <>
                        {/* Mobile-only back button */}
                        <div className="md:hidden p-2 bg-white border-b border-gray-200">
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className="flex items-center text-gray-600"
                            >
                                <ArrowLeft size={20} className="mr-1" />
                                <span>Back</span>
                            </button>
                        </div>

                        {/* Conversation Header */}
                        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                            <div className="flex items-center">
                                <img
                                    src={selectedDoctor.doctor.avatar}
                                    alt={selectedDoctor.doctor.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="ml-3">
                                    <h3 className="font-semibold text-gray-900">{selectedDoctor.doctor.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedDoctor.doctor.online ? (
                                            <span className="text-green-500">Online</span>
                                        ) : (
                                            <span className="text-gray-500">Offline</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Phone size={20} className="text-gray-600" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Video size={20} className="text-gray-600" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <MoreVertical size={20} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <div className="space-y-4">
                                {selectedDoctor.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                                                message.sender === "patient"
                                                    ? "bg-blue-500 text-white rounded-br-none"
                                                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                                            }`}
                                        >
                                            <p>{message.content}</p>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    message.sender === "patient" ? "text-blue-100" : "text-gray-500"
                                                }`}
                                            >
                                                {message.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center">
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Paperclip size={20} className="text-gray-500" />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 mx-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <button
                                    className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                                    onClick={handleSendMessage}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                        <div className="text-center p-6 max-w-md">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No conversation selected</h3>
                            <p>Select a doctor from the list to start or continue a conversation.</p>
                            <button
                                className="mt-4 p-2 bg-blue-500 text-white rounded-lg md:hidden"
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