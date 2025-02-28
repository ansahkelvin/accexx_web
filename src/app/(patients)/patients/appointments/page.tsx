'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Clock, User, Search, Filter, MoreHorizontal, MapPin, Bell, AlertCircle } from 'lucide-react';

// TypeScript interfaces
interface Appointment {
    id: number;
    title: string;
    date: string;
    time: string;
    doctor: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    location?: string;
    notes?: string;
    duration?: string;
    reminderSet?: boolean;
}

interface CalendarDay {
    day: number | string;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasAppointment: boolean;
    date: string;
}

export default function AppointmentPage() {
    // Sample appointment data with additional fields
    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: 1,
            title: 'Annual Checkup',
            date: '2024-08-05',
            time: '09:00 AM',
            doctor: 'Dr. Emily Johnson',
            status: 'Confirmed',
            location: 'Main Hospital, Room 305',
            duration: '45 minutes',
            reminderSet: true,
            notes: 'Bring previous medical records and insurance card'
        },
        {
            id: 2,
            title: 'Dental Cleaning',
            date: '2024-08-07',
            time: '11:30 AM',
            doctor: 'Dr. Michael Lee',
            status: 'Pending',
            location: 'Dental Clinic, 2nd Floor',
            duration: '30 minutes',
            reminderSet: false
        },
        {
            id: 3,
            title: 'Eye Examination',
            date: '2024-08-12',
            time: '02:15 PM',
            doctor: 'Dr. Sarah Chen',
            status: 'Confirmed',
            location: 'Vision Center, Suite 12',
            duration: '1 hour',
            reminderSet: true
        },
        {
            id: 4,
            title: 'Physical Therapy',
            date: '2024-08-15',
            time: '10:00 AM',
            doctor: 'Dr. Robert Wilson',
            status: 'Confirmed',
            location: 'Rehabilitation Center',
            duration: '1 hour 15 minutes',
            reminderSet: true,
            notes: 'Wear comfortable clothing and athletic shoes'
        },
        {
            id: 5,
            title: 'Vaccination',
            date: '2024-08-20',
            time: '03:45 PM',
            doctor: 'Dr. Emily Johnson',
            status: 'Pending',
            location: 'Community Health Center',
            duration: '15 minutes',
            reminderSet: false
        }
    ]);

    // Search functionality
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments);

    // Calendar current month/year
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // Filter appointments for a specific date
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Day labels with unique keys
    const dayLabels = [
        { key: 'mon', label: 'M' },
        { key: 'tue', label: 'T' },
        { key: 'wed', label: 'W' },
        { key: 'thu', label: 'T' },
        { key: 'fri', label: 'F' },
        { key: 'sat', label: 'S' },
        { key: 'sun', label: 'S' }
    ];

    // Apply filters whenever search term or selected date changes
    useEffect(() => {
        let result = appointments;

        // Filter by date if selected
        if (selectedDate) {
            result = result.filter(appointment => appointment.date === selectedDate);
        }

        // Filter by search term
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            result = result.filter(appointment =>
                appointment.title.toLowerCase().includes(term) ||
                appointment.doctor.toLowerCase().includes(term) ||
                (appointment.location && appointment.location.toLowerCase().includes(term))
            );
        }

        setFilteredAppointments(result);
    }, [appointments, selectedDate, searchTerm]);

    // Generate calendar days
    const generateCalendarDays = (): CalendarDay[] => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
        let firstDayOfWeek = firstDay.getDay();
        // Adjust for Monday as first day of week
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const daysInMonth = lastDay.getDate();
        const days: CalendarDay[] = [];

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push({
                day: '',
                isCurrentMonth: false,
                isToday: false,
                hasAppointment: false,
                date: ''
            });
        }

        // Add all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const formattedDate = formatDate(date);

            // Check if this day has appointments
            const hasAppointment = appointments.some(appointment => appointment.date === formattedDate);

            days.push({
                day: i,
                isCurrentMonth: true,
                isToday: isToday(date),
                hasAppointment,
                date: formattedDate
            });
        }

        return days;
    };

    // Format date as YYYY-MM-DD
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Check if date is today
    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Navigation for calendar
    const prevMonth = (): void => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = (): void => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Format month and year for display
    const formatMonthYear = (date: Date): string => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Format date display
    const formatDisplayDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // Delete appointment
    const deleteAppointment = (id: number): void => {
        setAppointments(appointments.filter(appointment => appointment.id !== id));
    };

    // Get days until appointment
    const getDaysUntil = (dateString: string): number => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentDate = new Date(dateString);
        appointmentDate.setHours(0, 0, 0, 0);

        const differenceInTime = appointmentDate.getTime() - today.getTime();
        return Math.ceil(differenceInTime / (1000 * 3600 * 24));
    };

    // Set reminder
    const toggleReminder = (id: number): void => {
        setAppointments(appointments.map(appointment =>
            appointment.id === id
                ? { ...appointment, reminderSet: !appointment.reminderSet }
                : appointment
        ));
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Top navigation bar */}
            <nav className="border-b py-4 px-6">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-medium">Appointments</h1>
                        <p className="font-light text-sm pt-1">Manage all your appointments here</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search appointments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="py-2 px-4 pl-10 text-sm rounded-full bg-gray-50 focus:bg-gray-100 focus:outline-none"
                            />
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            className="bg-black text-white rounded-full p-2 transition-colors hover:bg-gray-800"
                            title="New Appointment"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar */}
                <div className="lg:w-72 order-2 lg:order-1">
                    {/* Calendar */}
                    <div className="mb-8 border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm text-gray-500 font-medium uppercase tracking-wider">Calendar</h2>
                            <div className="flex">
                                <button
                                    onClick={prevMonth}
                                    className="p-1 text-gray-500 hover:text-black"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={nextMonth}
                                    className="p-1 text-gray-500 hover:text-black"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-light text-lg mb-4">{formatMonthYear(currentMonth)}</h3>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                            {dayLabels.map(day => (
                                <div key={day.key} className="text-xs text-gray-400">
                                    {day.label}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {generateCalendarDays().map((day, index) => (
                                <div
                                    key={`day-${index}`}
                                    className={`
                                        aspect-square flex items-center justify-center text-sm
                                        ${day.isCurrentMonth ? 'cursor-pointer hover:bg-gray-50' : 'text-gray-300 cursor-default'} 
                                        ${day.isToday ? 'font-medium border border-gray-300' : ''}
                                        ${selectedDate === day.date ? 'bg-black text-white rounded-full hover:bg-black' : ''}
                                        ${day.hasAppointment && selectedDate !== day.date ? 'after:block after:w-1 after:h-1 after:bg-black after:rounded-full after:absolute after:bottom-1' : ''}
                                        relative
                                    `}
                                    onClick={() => day.isCurrentMonth && day.date ? setSelectedDate(day.date) : null}
                                >
                                    {day.day}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedDate(null)}
                            className="mt-4 text-sm text-gray-500 hover:text-black"
                        >
                            View all appointments
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mb-8 border-t pt-6">
                        <h2 className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Filter size={14} />
                            <span>Filters</span>
                        </h2>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-black" />
                                <span className="text-sm">Confirmed only</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-black" />
                                <span className="text-sm">This week</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-black" />
                                <span className="text-sm">Dr. Emily Johnson</span>
                            </label>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div>
                        <h2 className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-4">Overview</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Total</span>
                                    <span className="font-medium">{appointments.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Confirmed</span>
                                    <span className="font-medium text-green-600">{appointments.filter(a => a.status === 'Confirmed').length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Pending</span>
                                    <span className="font-medium text-amber-600">{appointments.filter(a => a.status === 'Pending').length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Cancelled</span>
                                    <span className="font-medium text-red-600">{appointments.filter(a => a.status === 'Cancelled').length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="flex-1 order-1 lg:order-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium">
                            {selectedDate ? `Appointments for ${formatDisplayDate(selectedDate)}` : 'All appointments'}
                            {searchTerm && ` matching "${searchTerm}"`}
                        </h2>
                        <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-black">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    {filteredAppointments.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center border border-dashed rounded-lg">
                            <p className="text-gray-500 mb-2">No appointments found</p>
                            <button
                                className="text-sm underline"
                            >
                                Add new appointment
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAppointments.map(appointment => {
                                const daysUntil = getDaysUntil(appointment.date);
                                return (
                                    <div
                                        key={appointment.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 group transition-all duration-200 hover:shadow-md"
                                    >
                                        <div className="flex justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-medium">{appointment.title}</h3>
                                                    <span className={`
                                                        text-xs px-2 py-0.5 rounded-full
                                                        ${appointment.status === 'Confirmed' ? 'bg-green-50 text-green-700' :
                                                        appointment.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                                            'bg-red-50 text-red-700'}
                                                    `}>
                                                        {appointment.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Clock size={14} />
                                                        <span>{appointment.time}</span>
                                                        {appointment.duration && <span> • {appointment.duration}</span>}
                                                    </div>

                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <User size={14} />
                                                        <span>{appointment.doctor}</span>
                                                    </div>

                                                    {appointment.location && (
                                                        <div className="flex items-center gap-1 text-gray-600">
                                                            <MapPin size={14} />
                                                            <span>{appointment.location}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Calendar size={14} />
                                                        <span>{formatDisplayDate(appointment.date)}</span>
                                                    </div>
                                                </div>

                                                {appointment.notes && (
                                                    <div className="mt-2 text-sm text-gray-500 border-t pt-2">
                                                        <p>{appointment.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right side info panel */}
                                            <div className="w-32 flex flex-col items-center justify-center border-l pl-4 ml-4">
                                                <div className="text-center mb-2">
                                                    {daysUntil === 0 ? (
                                                        <div className="text-red-600 font-medium">Today</div>
                                                    ) : daysUntil < 0 ? (
                                                        <div className="text-gray-400">{Math.abs(daysUntil)} days ago</div>
                                                    ) : (
                                                        <>
                                                            <div className="text-2xl font-bold">{daysUntil}</div>
                                                            <div className="text-xs text-gray-500">days left</div>
                                                        </>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => toggleReminder(appointment.id)}
                                                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                                        appointment.reminderSet
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <Bell size={12} />
                                                    {appointment.reminderSet ? 'Reminder on' : 'Set reminder'}
                                                </button>

                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100"
                                                        title="Edit appointment"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAppointment(appointment.id)}
                                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                                                        title="Cancel appointment"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming appointment notification */}
            {appointments.some(a => getDaysUntil(a.date) >= 0 && getDaysUntil(a.date) <= 2) && (
                <div className="fixed bottom-4 right-4 max-w-xs bg-black text-white p-4 rounded-lg shadow-lg z-40">
                    <div className="flex gap-3 items-start">
                        <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-medium mb-1">Upcoming Appointment</h4>
                            <p className="text-sm text-gray-300 mb-2">
                                You have an appointment in the next 48 hours. Be sure to prepare any necessary documents.
                            </p>
                            <button className="text-xs underline text-gray-300 hover:text-white">
                                View details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}