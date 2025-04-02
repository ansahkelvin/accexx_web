import {Calendar, Clock, Home, MapPin, Video} from "lucide-react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {createChat} from "@/app/actions/chat";
import Link from "next/link";
import React, { useState } from "react";

interface Appointment {
    id: string;
    doctor_id: string;
    patient_id: string;
    schedule_id: string;
    appointment_time: string;
    status: "Confirmed" | "Cancelled" | "Rescheduled" | "Completed" | "Pending";
    reason: string;
    appointment_type: "In person" | "Virtual" | "Home visit";
    meeting_link?: string;
    appointment_location?: string;
    appointment_location_latitude?: number;
    appointment_location_longitude?: number;
    doctor_name: string;
    doctor_image_url?: string;
    doctor_specialization: string;
    patient_name: string;
    patient_image_url?: string;
}

export default function AppointmentCard({
                                            appointment,
                                            formatDate,
                                            formatTime,
                                            getDaysUntil,
                                            isPast = false
                                        }: {
    appointment: Appointment;
    formatDate: (date: string) => string;
    formatTime: (date: string) => string;
    getDaysUntil: (date: string) => number;
    isPast?: boolean;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const daysUntil = getDaysUntil(appointment.appointment_time);

    // Ensure we have all required fields for the chat request
    const chatRequest = {
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        appointment_id: appointment.id
    };
    
    console.log("AppointmentCard", appointment);

    // Get appropriate icon for appointment type
    const getTypeIcon = () => {
        switch(appointment.appointment_type) {
            case 'Virtual':
                return <Video size={16} className="text-blue-500" />;
            case 'Home visit':
                return <Home size={16} className="text-green-500" />;
            default:
                return <MapPin size={16} className="text-red-500" />;
        }
    };

    // Properly handle the chat creation with error handling and loading state
    const handleCreateChat = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            // Make sure all required IDs are present
            if (!chatRequest.patient_id || !chatRequest.doctor_id || !chatRequest.appointment_id) {
                console.error("Missing required ID for chat creation", chatRequest);
                throw new Error("Missing required information");
            }

            // Call the server action to create the chat
            const result = await createChat(chatRequest);

            // If we get here, it was successful so navigate to inbox
            console.log("Chat created successfully:", result);
            router.push("/patients/inbox");
        } catch (error) {
            console.error("Error creating chat:", error);
            // You could add error notification here
            alert("Failed to start chat. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`
          bg-white rounded-xl overflow-hidden shadow-sm border transition-all
          ${isPast ? 'border-gray-100 opacity-80' : 'border-gray-200 hover:shadow-md'}
        `}>
            {/* Status indicator */}
            <div className={`h-1 ${
                appointment.status === 'Confirmed' ? 'bg-green-500' :
                    appointment.status === 'Pending' ? 'bg-amber-500' :
                        appointment.status === 'Cancelled' ? 'bg-red-500' :
                            appointment.status === 'Completed' ? 'bg-blue-500' : 'bg-gray-500'
            }`}></div>

            <div className="p-4">
                <div className="flex items-start gap-4">
                    {/* Left column with doctor info */}
                    <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                {/* eslint-disable @next/next/no-img-element */}
                                {appointment.doctor_image_url ? (
                                    <img
                                        src={appointment.doctor_image_url}
                                        alt={appointment.doctor_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Dr</div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-medium">{appointment.doctor_name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                                        appointment.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            appointment.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                appointment.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    appointment.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {appointment.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{appointment.doctor_specialization}</p>
                            </div>
                        </div>

                        <div className="pl-2 border-l-2 border-gray-200 ml-1 mt-3 mb-3">
                            <p className="text-sm text-gray-700 italic">{appointment.reason}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm mt-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={16} className="text-gray-400" />
                                <span>{formatDate(appointment.appointment_time)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock size={16} className="text-gray-400" />
                                <span>{formatTime(appointment.appointment_time)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                                {getTypeIcon()}
                                <span>{appointment.appointment_type}</span>
                            </div>

                            {appointment.appointment_location && (
                                <div className="flex items-center gap-2 text-gray-600 col-span-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>{appointment.appointment_location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column with date info and actions */}
                    <div className="flex flex-col items-center ml-2 pl-4 border-l min-w-[100px] text-center">
                        {!isPast ? (
                            <>
                                {daysUntil === 0 ? (
                                    <div className="mb-1 text-red-600 font-medium text-lg">Today</div>
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold text-gray-800">{daysUntil}</div>
                                        <div className="text-xs text-gray-500 mb-1">days left</div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="mb-1 text-gray-500">
                                {Math.abs(daysUntil)} days ago
                            </div>
                        )}

                        <div className="flex flex-col gap-2 mt-2 w-full">
                            <Button
                                onClick={handleCreateChat}
                                disabled={isLoading}
                                className={`w-full px-3 py-1.5 rounded-md text-sm
                                    ${isLoading
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {isLoading ? 'Opening...' : 'Chat'}
                            </Button>

                            {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && !isPast && (
                                <>
                                    <Link href={`/appointments/${appointment.schedule_id}/reschedule`}>
                                        <button className="w-full px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 text-sm">
                                            Reschedule
                                        </button>
                                    </Link>

                                    {appointment.appointment_type === 'Virtual' && appointment.meeting_link && (
                                        <a
                                            href={appointment.meeting_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center justify-center gap-1"
                                        >
                                            <Video size={14} />
                                            Join
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}