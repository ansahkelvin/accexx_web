"use client";

import React, { useEffect, useState } from "react";
import {  Check, X, Video, MapPin, MessageCircle } from "lucide-react";
import { fetchAppointments } from "@/service/doctors/doctor";
import { DoctorAppointmentResponse } from "@/types/doctor";
import { useRouter } from "next/navigation";
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
    const [appointments, setAppointments] = useState<DoctorAppointmentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointmentResponse | null>(null);
    const [modalType, setModalType] = useState<'confirm' | 'cancel' | null>(null);

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

    // Get appropriate icon for appointment type (based on timeSlot properties)
    const getTypeIcon = (appointment: DoctorAppointmentResponse) => {
        // You would need to check if the timeSlot has virtual meeting properties
        // For now, assuming if there's a meeting link or similar property
        const isVirtual = appointment.timeSlot.startTime && appointment.timeSlot.endTime;
        return isVirtual ? <Video size={16} className="text-blue-500" /> : <MapPin size={16} className="text-red-500" />;
    };

    // Mark appointment as confirmed or canceled
    const changeAppointmentStatus = async (status: 'CONFIRMED' | 'CANCELED') => {
        if (!selectedAppointment) return;

        setIsLoading(true);
        try {
            console.log("Updating appointment status:", selectedAppointment.id, status);
            const response = await updateAppointmentStatus(
                selectedAppointment.id,
                status,
                selectedAppointment.timeSlot.id
            );
            console.log("Update appointment status response:", response);

            if (!response.ok) {
                console.error("Update appointment status failed:", response.error);
                throw new Error(response.error || "Failed to update appointment status");
            }

            console.log("Appointment status updated successfully");
            // Refresh appointments
            const updatedAppointments = await fetchAppointments();
            setAppointments(updatedAppointments || []);
        } catch (error) {
            console.error("Error updating appointment status:", error);
            alert("Failed to update appointment status. Please try again.");
        } finally {
            setIsLoading(false);
            setModalType(null);
            setSelectedAppointment(null);
        }
    };

    // Open modal for specific action
    const openModal = (appointment: DoctorAppointmentResponse, type: 'confirm' | 'cancel') => {
        setSelectedAppointment(appointment);
        setModalType(type);
    };

    // Close modal
    const closeModal = () => {
        setModalType(null);
        setSelectedAppointment(null);
    };

    // Format date and time
    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                        }
                    }}
                    title={
                        modalType === 'confirm' ? "Confirm Appointment" :
                            "Cancel Appointment"
                    }
                    message={
                        modalType === 'confirm' ? `Are you sure you want to confirm the appointment with ${selectedAppointment.user.fullName}?` :
                            `Are you sure you want to cancel the appointment with ${selectedAppointment.user.fullName}?`
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
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
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
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium">
                                                    {appointment.user.fullName.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{appointment.user.fullName}</div>
                                                <div className="text-sm text-gray-500">{appointment.user.phoneNumber}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {formatDateTime(appointment.appointmentDateTime)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{appointment.notes || 'No notes'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {appointment.timeSlot.durationMinutes} min
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                            appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            appointment.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                                            appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            {appointment.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => openModal(appointment, 'confirm')}
                                                        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition"
                                                        title="Confirm"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(appointment, 'cancel')}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {appointment.canCancel && appointment.status !== 'CANCELED' && appointment.status !== 'COMPLETED' && (
                                                <button
                                                    onClick={() => openModal(appointment, 'cancel')}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                                                    title="Cancel"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
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