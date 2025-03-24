'use client';

import React, { useEffect, useState} from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, Filter, Plus, ChevronRight } from 'lucide-react';
import {AppointmentStats, fetchDashboard} from "@/service/doctors/doctor";


// TypeScript interfaces
interface Appointment {
    id: number;
    patientName: string;
    patientAvatar?: string;
    time: string;
    status: 'confirmed' | 'pending' | 'canceled';
    issue: string;
    duration: number;
}

interface Stats {
    today: {
        total: number;
        confirmed: number;
        pending: number;
        canceled: number;
    };
    week: {
        total: number;
        confirmed: number;
        pending: number;
        canceled: number;
    };
    month: {
        total: number;
        confirmed: number;
        pending: number;
        canceled: number;
    };
}

export default function DoctorDashboard() {
    
    const [dashboardData, setDashboardData] = useState<AppointmentStats | null >(null);

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try{
                const appointments = await fetchDashboard();
                if (appointments) {
                    setDashboardData(appointments)
                }
                console.log(appointments);
            }catch (e) {
                console.error(e);
            }
        }
        fetchAppointmentDetails().then()
    }, []);
    
    
    
    // Sample data - in a real app this would come from an API
    const appointments: Appointment[] = [
        { id: 1, patientName: "Emma Johnson", time: "09:00 AM", status: "confirmed", issue: "Annual checkup", duration: 30 },
        { id: 2, patientName: "Michael Chen", time: "10:30 AM", status: "confirmed", issue: "Headache consultation", duration: 45 },
        { id: 3, patientName: "Sarah Williams", time: "01:00 PM", status: "pending", issue: "Skin rash", duration: 30 },
        { id: 4, patientName: "Robert Davis", time: "02:30 PM", status: "confirmed", issue: "Follow-up appointment", duration: 20 },
        { id: 5, patientName: "James Wilson", time: "04:00 PM", status: "canceled", issue: "Throat infection", duration: 30 },
    ];

    const stats: Stats = {
        today: { total: 8, confirmed: 5, pending: 2, canceled: 1 },
        week: { total: 32, confirmed: 24, pending: 5, canceled: 3 },
        month: { total: 120, confirmed: 98, pending: 12, canceled: 10 }
    };


    return (
        <div className="flex h-screen bg-gray-50 text-sm">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-6">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-blue-50 border border-blue-100">
                                    <Calendar size={18} className="text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardData?.total_appointments}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-green-50 border border-green-100">
                                    <CheckCircle size={18} className="text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Confirmed</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardData?.confirmed_appointments}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-yellow-50 border border-yellow-100">
                                    <Clock size={18} className="text-yellow-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Pending</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardData?.pending_appointments}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-red-50 border border-red-100">
                                    <XCircle size={18} className="text-red-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Canceled</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardData?.canceled_appointments}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        {/* Appointments List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                        <h3 className="text-lg md:text-xl font-medium text-gray-500">Today&#39;s Appointments</h3>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {appointments.map((appointment) => (
                                        <div key={appointment.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                <div className="flex items-center mb-2 sm:mb-0">
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                        <User size={18} className="text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm md:text-base font-medium text-gray-800">{appointment.patientName}</h4>
                                                        <div className="flex items-center space-x-2 mt-0.5">
                                                            <span className="text-sm text-gray-500">{appointment.issue}</span>
                                                            <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                                                {appointment.duration} min
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                                                    <div className="flex items-center sm:flex-col sm:items-end">
                                                        <div className="flex items-center sm:mb-1">
                                                            <Clock size={16} className="text-gray-400 mr-1 sm:hidden" />
                                                            <span className="text-sm font-medium text-gray-700">{appointment.time}</span>
                                                        </div>
                                                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                                                            appointment.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                                appointment.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                                                                    'bg-red-50 text-red-600 border border-red-100'
                                                        }`}>
                                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <button className="ml-3 p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-3 border-t border-gray-100">
                                    <button className="w-full py-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                        View all appointments
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}