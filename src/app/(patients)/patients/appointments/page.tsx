"use client"
import React, { useEffect, useState } from 'react';
import {
    Calendar,
    AlertCircle,
    Search, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { fetchPatientAppointment } from "@/app/actions/user";
import AppointmentCard from "@/components/card/AppointmentCard";
import { createReviewData, updateAppointmentStatus } from "@/app/actions/appointments";
import GroupedAppointmentCard from "@/components/card/GroupedAppointmentCard";

// Type definition for appointment data
interface Appointment {
    id: string;
    doctor_id: string;
    patient_id: string;
    schedule_id: string;
    appointment_time: string;
    status: "Confirmed" | "Canceled" | "Rescheduled" | "Completed" | "Pending";
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
    has_review: boolean;
}

interface GroupedDoctorAppointments {
    doctor_id: string;
    doctor_name: string;
    doctor_specialization: string;
    doctor_image_url?: string;
    appointments: Appointment[];
}

export default function AppointmentsPage() {
    // State for appointments data
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedDate, /* setSelectedDate */] = useState<Date | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grouped" | "individual">("grouped");

    // Define the ReviewData interface for reviews
    interface ReviewData {
        appointment_id: string;
        patient_id: string;
        doctor_id: string;
        rating: number;
        review: string;
    }

    // Direct function to update appointment status
    const handleUpdateAppointmentStatus = async (appointmentId: string, status: string, scheduleId: string) => {
        try {
            const response = await updateAppointmentStatus(appointmentId, status, scheduleId);
            return response;
        } catch (error) {
            console.error("Error updating appointment status:", error);
            return {
                ok: false,
                error: "Failed to update appointment status"
            };
        }
    };

    // Direct function to submit reviews
    const handleSubmitReview = async (reviewData: ReviewData) => {
        try {
            const response = await createReviewData(reviewData);
            return response;
        } catch (error) {
            console.error("Error submitting review:", error);
            return {
                success: false,
                error: "Failed to submit review"
            };
        }
    };

    // Fetch appointments data from API
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const data = await fetchPatientAppointment();
                if (!data) {
                    setAppointments([]);
                    return;
                }
                setAppointments(data);
                setFilteredAppointments(data);
                setError(null);
            } catch (err) {
                setError('Error loading appointments. Please try again later.');
                console.error('Error fetching appointments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // Apply filters
    useEffect(() => {
        let result = [...appointments];

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                app =>
                    app.doctor_name.toLowerCase().includes(query) ||
                    app.doctor_specialization.toLowerCase().includes(query) ||
                    app.reason.toLowerCase().includes(query) ||
                    (app.appointment_location && app.appointment_location.toLowerCase().includes(query))
            );
        }

        if (selectedDate) {
            result = result.filter(app => {
                const appDate = new Date(app.appointment_time);
                return appDate.toDateString() === selectedDate.toDateString();
            });
        }

        // Filter by status
        if (statusFilter) {
            result = result.filter(app => app.status === statusFilter);
        }

        // Filter by appointment type
        if (typeFilter) {
            result = result.filter(app => app.appointment_type === typeFilter);
        }

        setFilteredAppointments(result);
    }, [appointments, searchQuery, selectedDate, statusFilter, typeFilter]);

    // Format date helpers
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    // Get the day count until appointment
    const getDaysUntil = (dateString: string): number => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentDate = new Date(dateString);
        appointmentDate.setHours(0, 0, 0, 0);

        const diffTime = appointmentDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Get upcoming and past appointments
    const upcomingAppointments = filteredAppointments
        .filter(app => !selectedDate && new Date(app.appointment_time).getTime() > Date.now())
        .sort((a, b) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime());

    const pastAppointments = filteredAppointments
        .filter(app => new Date(app.appointment_time).getTime() <= Date.now())
        .sort((a, b) => new Date(b.appointment_time).getTime() - new Date(a.appointment_time).getTime());

    // Group appointments by doctor
    const groupAppointmentsByDoctor = (appointments: Appointment[]): GroupedDoctorAppointments[] => {
        const groupedMap = new Map<string, GroupedDoctorAppointments>();

        appointments.forEach(appointment => {
            if (!groupedMap.has(appointment.doctor_id)) {
                groupedMap.set(appointment.doctor_id, {
                    doctor_id: appointment.doctor_id,
                    doctor_name: appointment.doctor_name,
                    doctor_specialization: appointment.doctor_specialization,
                    doctor_image_url: appointment.doctor_image_url,
                    appointments: []
                });
            }

            groupedMap.get(appointment.doctor_id)?.appointments.push(appointment);
        });

        return Array.from(groupedMap.values());
    };

    // Group appointments for the grouped view
    const groupedUpcomingAppointments = groupAppointmentsByDoctor(upcomingAppointments);
    const groupedPastAppointments = groupAppointmentsByDoctor(pastAppointments);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600">Loading your appointments...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-4xl mx-auto my-12 px-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
                    <h3 className="text-lg font-semibold mb-2 text-red-700">Unable to Load Appointments</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">My Appointments</h1>
                            <p className="text-gray-600 pt-1">Manage your upcoming and past appointments</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("grouped")}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        viewMode === "grouped"
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    Grouped
                                </button>
                                <button
                                    onClick={() => setViewMode("individual")}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        viewMode === "individual"
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    Individual
                                </button>
                            </div>

                            <Link href="/patients/doctors">
                                <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    New Appointment
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Search and filter bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by doctor, reason, or location"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <select
                                value={statusFilter || ''}
                                onChange={(e) => setStatusFilter(e.target.value || null)}
                                className="p-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Canceled">Canceled</option>
                                <option value="Completed">Completed</option>
                            </select>

                            <select
                                value={typeFilter || ''}
                                onChange={(e) => setTypeFilter(e.target.value || null)}
                                className="p-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Types</option>
                                <option value="Virtual">Virtual</option>
                                <option value="In person">In Person</option>
                                <option value="Home visit">Home Visit</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <div className="space-y-8">
                    {/* Empty state */}
                    {filteredAppointments.length === 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                                <Calendar className="text-indigo-500" size={24} />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No appointments found</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                {selectedDate ?
                                    `You don't have any appointments on ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.` :
                                    'No appointments match your current filters. Try adjusting your search criteria.'
                                }
                            </p>
                            <Link href="/patients/doctors">
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    Schedule New Appointment
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Upcoming appointments section */}
                    {upcomingAppointments.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-800">
                                    {selectedDate
                                        ? `Appointments on ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
                                        : 'Upcoming Appointments'
                                    }
                                </h2>
                            </div>

                            {/* Display mode: Grouped */}
                            {viewMode === "grouped" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {groupedUpcomingAppointments.map((group) => (
                                        <GroupedAppointmentCard
                                            key={group.doctor_id}
                                            groupedAppointments={group}
                                            formatDate={formatDate}
                                            formatTime={formatTime}
                                            getDaysUntil={getDaysUntil}
                                            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                                            onSubmitReview={handleSubmitReview}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Display mode: Individual */}
                            {viewMode === "individual" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {upcomingAppointments.map(appointment => (
                                        <AppointmentCard
                                            key={appointment.id || appointment.schedule_id}
                                            appointment={appointment}
                                            formatDate={formatDate}
                                            formatTime={formatTime}
                                            getDaysUntil={getDaysUntil}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Past appointments section - only show if no date selected */}
                    {!selectedDate && pastAppointments.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-800">Past Appointments</h2>
                            </div>

                            {/* Display mode: Grouped */}
                            {viewMode === "grouped" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {groupedPastAppointments.map((group) => (
                                        <GroupedAppointmentCard
                                            key={group.doctor_id}
                                            groupedAppointments={group}
                                            formatDate={formatDate}
                                            formatTime={formatTime}
                                            getDaysUntil={getDaysUntil}
                                            isPast
                                            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                                            onSubmitReview={handleSubmitReview}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Display mode: Individual */}
                            {viewMode === "individual" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {pastAppointments.map(appointment => (
                                        <AppointmentCard
                                            key={appointment.id || appointment.schedule_id}
                                            appointment={appointment}
                                            formatDate={formatDate}
                                            formatTime={formatTime}
                                            getDaysUntil={getDaysUntil}
                                            isPast
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}