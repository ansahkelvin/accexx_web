'use client';
import React, { useState } from 'react';
import { Calendar, User, Clock, Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

// TypeScript interfaces
interface Appointment {
    id: number;
    patientName: string;
    patientAvatar?: string;
    patientEmail?: string;
    patientPhone?: string;
    time: string;
    date: string;
    status: 'confirmed' | 'pending' | 'canceled' | 'completed';
    issue: string;
    duration: number;
    notes?: string;
}

export default function AppointmentsPage() {
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');

    // Sample appointment data - would come from API in real app
    const appointments: Appointment[] = [
        {
            id: 1,
            patientName: "Emma Johnson",
            patientEmail: "emma.j@example.com",
            patientPhone: "+1 (555) 123-4567",
            time: "09:00 AM",
            date: "Feb 28, 2025",
            status: "confirmed",
            issue: "Annual checkup",
            duration: 30,
            notes: "Patient has a history of hypertension"
        },
        {
            id: 2,
            patientName: "Michael Chen",
            patientEmail: "m.chen@example.com",
            patientPhone: "+1 (555) 234-5678",
            time: "10:30 AM",
            date: "Feb 28, 2025",
            status: "confirmed",
            issue: "Headache consultation",
            duration: 45,
            notes: "Recurring migraines for past 3 months"
        },
        {
            id: 3,
            patientName: "Sarah Williams",
            patientEmail: "sarah.w@example.com",
            patientPhone: "+1 (555) 345-6789",
            time: "01:00 PM",
            date: "Feb 28, 2025",
            status: "pending",
            issue: "Skin rash",
            duration: 30
        },
        {
            id: 4,
            patientName: "Robert Davis",
            patientEmail: "r.davis@example.com",
            patientPhone: "+1 (555) 456-7890",
            time: "02:30 PM",
            date: "Feb 28, 2025",
            status: "confirmed",
            issue: "Follow-up appointment",
            duration: 20,
            notes: "Post-surgery follow-up"
        },
        {
            id: 5,
            patientName: "James Wilson",
            patientEmail: "j.wilson@example.com",
            patientPhone: "+1 (555) 567-8901",
            time: "04:00 PM",
            date: "Feb 28, 2025",
            status: "canceled",
            issue: "Throat infection",
            duration: 30
        },
        {
            id: 6,
            patientName: "Patricia Moore",
            patientEmail: "p.moore@example.com",
            patientPhone: "+1 (555) 678-9012",
            time: "09:30 AM",
            date: "Mar 1, 2025",
            status: "confirmed",
            issue: "Diabetes check",
            duration: 40,
            notes: "Bring latest blood work results"
        },
        {
            id: 7,
            patientName: "Jennifer Taylor",
            patientEmail: "j.taylor@example.com",
            patientPhone: "+1 (555) 789-0123",
            time: "11:00 AM",
            date: "Mar 1, 2025",
            status: "confirmed",
            issue: "Vaccination",
            duration: 15
        },
        {
            id: 8,
            patientName: "Thomas Anderson",
            patientEmail: "t.anderson@example.com",
            patientPhone: "+1 (555) 890-1234",
            time: "03:30 PM",
            date: "Mar 1, 2025",
            status: "pending",
            issue: "Back pain",
            duration: 45,
            notes: "Chronic lower back pain for 6 weeks"
        },
        {
            id: 9,
            patientName: "Linda Martinez",
            patientEmail: "l.martinez@example.com",
            patientPhone: "+1 (555) 901-2345",
            time: "10:15 AM",
            date: "Feb 27, 2025",
            status: "completed",
            issue: "Blood pressure check",
            duration: 20
        },
        {
            id: 10,
            patientName: "David Brown",
            patientEmail: "d.brown@example.com",
            patientPhone: "+1 (555) 012-3456",
            time: "02:00 PM",
            date: "Feb 27, 2025",
            status: "completed",
            issue: "Allergy consultation",
            duration: 30,
            notes: "Seasonal allergies"
        }
    ];

    // Filter appointments based on status and search query
    const filteredAppointments = appointments.filter(appointment => {
        // First filter by status
        const statusMatch = filter === 'all' || appointment.status === filter;

        // Then filter by search query (patient name or issue)
        const searchMatch =
            searchQuery === '' ||
            appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.issue.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && searchMatch;
    });

    // Group appointments by date for the list view
    const groupedAppointments = filteredAppointments.reduce((groups, appointment) => {
        const date = appointment.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(appointment);
        return groups;
    }, {} as Record<string, Appointment[]>);

    // Function to get appropriate status color
    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={"p-6"}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search appointments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded-md border ${currentView === 'list' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700'}`}
                            onClick={() => setCurrentView('list')}
                        >
                            List
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md border ${currentView === 'calendar' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700'}`}
                            onClick={() => setCurrentView('calendar')}
                        >
                            Calendar
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1">
                            <Plus size={16} />
                            <span>New</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${filter === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('confirmed')}
                    >
                        Confirmed
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${filter === 'canceled' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('canceled')}
                    >
                        Canceled
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {currentView === 'list' ? (
                /* List View */
                <div>
                    {Object.keys(groupedAppointments).length > 0 ? (
                        Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
                            <div key={date} className="mb-6">
                                <div className="flex items-center mb-4">
                                    <Calendar size={18} className="text-blue-500 mr-2" />
                                    <h2 className="text-lg font-semibold text-gray-700">{date}</h2>
                                </div>
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="divide-y divide-gray-200">
                                        {dateAppointments.map((appointment) => (
                                            <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                                                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                                    <div className="flex items-center mb-2 md:mb-0">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                                            <User size={20} className="text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                                                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2 sm:gap-4 mt-1">
                                                                <div className="flex items-center">
                                                                    <Clock size={14} className="mr-1" />
                                                                    <span>{appointment.time}</span>
                                                                </div>
                                                                <span className="hidden sm:block text-gray-300">•</span>
                                                                <span>{appointment.issue}</span>
                                                                <span className="hidden sm:block text-gray-300">•</span>
                                                                <span>{appointment.duration} min</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between md:justify-end">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                                                        <div className="flex ml-4">
                                                            <button className="text-gray-400 hover:text-blue-500 p-1">
                                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                </svg>
                                                            </button>
                                                            <button className="text-gray-400 hover:text-red-500 p-1 ml-1">
                                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {appointment.notes && (
                                                    <div className="mt-2 pl-14">
                                                        <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">{appointment.notes}</p>
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
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={() => {
                                    setFilter('all');
                                    setSearchQuery('');
                                }}
                            >
                                Reset filters
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Calendar View - Simplified for this example */
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">February 2025</h2>
                        <div className="flex space-x-2">
                            <button className="p-1 rounded-full hover:bg-gray-100">
                                <ChevronLeft size={20} className="text-gray-600" />
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-100">
                                <ChevronRight size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {/* First row with empty days */}
                        {[null, null, null, null, 1, 2, 3].map((day, i) => (
                            <div
                                key={i}
                                className={`h-24 border rounded-md ${
                                    day === 28 ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                                } ${!day ? 'bg-gray-50' : ''}`}
                            >
                                {day && (
                                    <>
                                        <div className="p-1 text-right">
                      <span className={`text-sm ${day === 28 ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                        {day}
                      </span>
                                        </div>
                                        {day === 28 && (
                                            <div className="px-1">
                                                <div className="bg-green-100 text-green-800 text-xs p-1 rounded mb-1 truncate">
                                                    9:00 AM - Emma J.
                                                </div>
                                                <div className="bg-green-100 text-green-800 text-xs p-1 rounded mb-1 truncate">
                                                    10:30 AM - Michael C.
                                                </div>
                                                <div className="bg-yellow-100 text-yellow-800 text-xs p-1 rounded truncate">
                                                    + 3 more
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Sample data for the rest of the month */}
                        {Array.from({ length: 28 }, (_, i) => i + 4).map((day) => (
                            <div
                                key={day}
                                className={`h-24 border rounded-md ${
                                    day === 28 ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                                }`}
                            >
                                <div className="p-1 text-right">
                  <span className={`text-sm ${day === 28 ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                    {day > 31 ? day - 31 : day}
                  </span>
                                </div>
                                {day === 27 && (
                                    <div className="px-1">
                                        <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded mb-1 truncate">
                                            10:15 AM - Linda M.
                                        </div>
                                        <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded truncate">
                                            2:00 PM - David B.
                                        </div>
                                    </div>
                                )}
                                {day === 29 && (
                                    <div className="px-1">
                                        <div className="bg-green-100 text-green-800 text-xs p-1 rounded mb-1 truncate">
                                            9:30 AM - Patricia M.
                                        </div>
                                        <div className="bg-green-100 text-green-800 text-xs p-1 rounded truncate">
                                            11:00 AM - Jennifer T.
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}