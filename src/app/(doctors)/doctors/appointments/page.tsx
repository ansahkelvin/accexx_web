"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Calendar, User, Clock, Search } from "lucide-react";
import { DoctorAppointment, fetchAppointments } from "@/service/doctors/doctor";
import AppointmentsCalendar from "@/components/AppointmentCalendar";

export default function AppointmentsPage() {
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentView, setCurrentView] = useState<"list" | "calendar">("list");
    const [appointments, setAppointments] = useState<DoctorAppointment[] | null>(null);

    useEffect(() => {
        const fetchDoctorAppointments = async () => {
            try {
                const response = await fetchAppointments();
                if (response) setAppointments(response);
            } catch (err) {
                console.error("Error fetching appointments:", err);
            }
        };
        fetchDoctorAppointments();
    }, []);

    // Filter appointments efficiently using useMemo
    const filteredAppointments = useMemo(() => {
        if (!appointments) return [];

        return appointments.filter((appointment) => {
            const statusMatch = filter === "all" || appointment.status.toLowerCase() === filter.toLowerCase();
            const searchMatch =
                searchQuery.trim() === "" ||
                appointment.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                appointment.appointment_time.toLowerCase().includes(searchQuery.toLowerCase());

            return statusMatch && searchMatch;
        });
    }, [appointments, filter, searchQuery]);

    // Group appointments by date
    const groupedAppointments = useMemo(() => {
        return filteredAppointments.reduce((groups, appointment) => {
            const date = new Date(appointment.appointment_time).toLocaleDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(appointment);
            return groups;
        }, {} as Record<string, DoctorAppointment[]>);
    }, [filteredAppointments]);

    // Status colors mapping
    const getStatusColor = useCallback((status: string) => {
        const statusColors: Record<string, string> = {
            confirmed: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            canceled: "bg-red-100 text-red-800",
            completed: "bg-blue-100 text-blue-800",
        };
        return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
    }, []);

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                            placeholder="Search appointments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {["list", "calendar"].map((view) => (
                            <button
                                key={view}
                                className={`px-4 py-2 rounded-md border transition ${
                                    currentView === view
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white border-gray-300 text-gray-700"
                                }`}
                                onClick={() => setCurrentView(view as "list" | "calendar")}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-2 flex-wrap">
                {["all", "confirmed", "pending", "canceled", "completed"].map((status) => (
                    <button
                        key={status}
                        className={`px-4 py-2 rounded-md transition ${
                            filter === status ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => setFilter(status)}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {currentView === "list" ? (
                /* List View */
                <div>
                    {Object.keys(groupedAppointments).length > 0 ? (
                        Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
                            <div key={date} className="mb-6">
                                <div className="flex items-center mb-4">
                                    <Calendar size={18} className="text-blue-500 mr-2" />
                                    <h2 className="text-lg font-semibold text-gray-700">{date}</h2>
                                </div>
                                <div className="bg-white rounded-lg shadow">
                                    <div className="divide-y divide-gray-200">
                                        {dateAppointments.map((appointment) => (
                                            <div key={appointment.id} className="p-4 hover:bg-gray-50 transition">
                                                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                                    <div className="flex items-center mb-2 md:mb-0">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                                            <User size={20} className="text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{appointment.patient_name}</h3>
                                                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2 sm:gap-4 mt-1">
                                                                <div className="flex items-center">
                                                                    <Clock size={14} className="mr-1" />
                                                                    <span>{new Date(appointment.appointment_time).toLocaleTimeString()}</span>
                                                                </div>
                                                                <span className="hidden sm:block text-gray-300">•</span>
                                                                <span>45 min</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                    </span>
                                                </div>
                                                {appointment.reason && (
                                                    <div className="mt-2 pl-14">
                                                        <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">{appointment.reason}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="mx-auto h-16 w-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
                                <Calendar size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                            <p className="text-gray-500 mb-6">There are no appointments matching your search criteria.</p>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => setFilter("all")}>
                                Reset filters
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <AppointmentsCalendar appointments={filteredAppointments} />
            )}
        </div>
    );
}
