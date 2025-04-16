"use client";

import React, { useEffect, useState } from "react";
import {  Check, X, Video, MapPin, MessageCircle } from "lucide-react";
import { DoctorAppointment, fetchAppointments } from "@/service/doctors/doctor";
import { useRouter } from "next/navigation";
import { createChat } from "@/app/actions/chat";
import { updateAppointmentStatus } from "@/app/actions/appointments";

// Skeleton Row Component
const SkeletonRow = () => (
    <tr className="animate-pulse bg-white">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="ml-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-40"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
        </td>
    </tr>
);

// Confirmation Modal Component
const ConfirmationModal = ({
                               isOpen,
                               onClose,
                               onConfirm,
                               title,
                               message
                           }: {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    title: string,
    message: string
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
    const [modalType, setModalType] = useState<'confirm' | 'cancel' | 'chat' | null>(null);

    useEffect(() => {
        const loadAppointments = async () => {
            try {
                setIsLoading(true);
                const fetchedAppointments = await fetchAppointments();
                setAppointments(fetchedAppointments || []);
            } catch (error) {
                console.error("Failed to fetch appointments", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAppointments();
    }, []);

    // Get appropriate icon for appointment type
    const getTypeIcon = (appointment: DoctorAppointment) => {
        switch (appointment.appointment_type) {
            case "Virtual":
                return <Video size={16} className="text-blue-500" />;
            default:
                return <MapPin size={16} className="text-red-500" />;
        }
    };

    // Handle chat creation
    const handleCreateChat = async () => {
        if (!selectedAppointment) return;

        const chatRequest = {
            patient_id: selectedAppointment.patient_id,
            doctor_id: selectedAppointment.doctor_id,
            appointment_id: selectedAppointment.id,
        };

        setIsLoading(true);
        try {
            if (!chatRequest.patient_id || !chatRequest.doctor_id || !chatRequest.appointment_id) {
                throw new Error("Missing required information");
            }

            await createChat(chatRequest);
            router.push("/doctors/inbox");
        } catch (error) {
            console.error(error);
            alert("Failed to start chat. Please try again.");
        } finally {
            setIsLoading(false);
            setModalType(null);
            setSelectedAppointment(null);
        }
    };

    // Mark appointment as confirmed or canceled
    const changeAppointmentStatus = async (status: 'CONFIRMED' | 'CANCELED') => {
        if (!selectedAppointment) return;

        setIsLoading(true);
        try {
            const response = await updateAppointmentStatus(
                selectedAppointment.id,
                status,
                selectedAppointment.schedule_id
            );

            if (!response.ok) {
                throw new Error("Failed to update appointment status");
            }

            // Refresh appointments
            const updatedAppointments = await fetchAppointments();
            setAppointments(updatedAppointments || []);
        } catch (error) {
            console.error(error);
            alert("Failed to update appointment status. Please try again.");
        } finally {
            setIsLoading(false);
            setModalType(null);
            setSelectedAppointment(null);
        }
    };

    // Open modal for specific action
    const openModal = (appointment: DoctorAppointment, type: 'confirm' | 'cancel' | 'chat') => {
        setSelectedAppointment(appointment);
        setModalType(type);
    };

    // Close modal
    const closeModal = () => {
        setModalType(null);
        setSelectedAppointment(null);
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-8">
            {/* Confirmation Modals */}
            {selectedAppointment && modalType && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={closeModal}
                    onConfirm={() => {
                        switch(modalType) {
                            case 'confirm':
                                changeAppointmentStatus('CONFIRMED');
                                break;
                            case 'cancel':
                                changeAppointmentStatus('CANCELED');
                                break;
                            case 'chat':
                                handleCreateChat();
                                break;
                        }
                    }}
                    title={
                        modalType === 'confirm' ? "Confirm Appointment" :
                            modalType === 'cancel' ? "Cancel Appointment" :
                                "Start Chat"
                    }
                    message={
                        modalType === 'confirm' ? `Are you sure you want to confirm the appointment with ${selectedAppointment.patient_name}?` :
                            modalType === 'cancel' ? `Are you sure you want to cancel the appointment with ${selectedAppointment.patient_name}?` :
                                `Do you want to start a chat with ${selectedAppointment.patient_name}?`
                    }
                />
            )}

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Appointments</h1>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <SkeletonRow key={index} />
                            ))
                        ) : appointments.length > 0 ? (
                            appointments.map(appointment => (
                                <tr key={appointment.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={appointment.patient_image_url || '/default-avatar.png'}
                                                    alt={appointment.patient_name}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{appointment.patient_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(appointment.appointment_time).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">{appointment.reason || 'No reason provided'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {getTypeIcon(appointment)}
                                            <span className="text-sm text-gray-500">{appointment.appointment_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {appointment.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => openModal(appointment, 'confirm')}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Confirm Appointment"
                                                    >
                                                        <Check className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(appointment, 'cancel')}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Cancel Appointment"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => openModal(appointment, 'chat')}
                                                className="text-purple-600 hover:text-purple-900"
                                                title="Start Chat"
                                            >
                                                <MessageCircle className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    No appointments found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}