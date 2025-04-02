"use client"
import React, {useEffect, useMemo, useState} from 'react';
import {
    Calendar,
    MapPin,
    Video,
    Home,
    AlertCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    X,
    ListFilter
} from 'lucide-react';
import Link from 'next/link';
import { fetchPatientAppointment } from "@/app/actions/user";
import AppointmentCard from "@/components/card/AppointmentCard";

// Type definition for appointment data coming from API
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

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasAppointment: boolean;
}

export default function AppointmentsPage() {
    // State for appointments data
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState<string | null>(null);

    // Add these variables and helper functions to your component
    const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [calendarDate, setCalendarDate] = useState<Date>(new Date());

    const isSameDay = (date1: Date, date2: Date): boolean => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

// Navigate through calendar
    const navigateCalendar = (direction: 'prev' | 'next'): void => {
        if (calendarViewMode === 'day') {
            // Navigate one day
            const newDate = new Date(calendarDate);
            newDate.setDate(calendarDate.getDate() + (direction === 'next' ? 1 : -1));
            setCalendarDate(newDate);
        } else if (calendarViewMode === 'week') {
            // Navigate one week
            const newDate = new Date(calendarDate);
            newDate.setDate(calendarDate.getDate() + (direction === 'next' ? 7 : -7));
            setCalendarDate(newDate);
        } else {
            // Navigate one month
            const newDate = new Date(calendarDate);
            newDate.setMonth(calendarDate.getMonth() + (direction === 'next' ? 1 : -1));
            setCalendarDate(newDate);
        }
    };

// Type for calendar day
    interface CalendarDayInfo {
        date: Date;
        isCurrentMonth: boolean;
        isToday: boolean;
    }

// Get days for month view
    const generateMonthDays = (): CalendarDayInfo[] => {
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();

        // First day of the month
        const firstDayOfMonth = new Date(year, month, 1);

        // Last day of the month
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Day of week for the first day (0 = Sunday, 1 = Monday, etc)
        const firstDayOfWeek = firstDayOfMonth.getDay();

        // Array to hold all calendar days
        const days: CalendarDayInfo[] = [];

        // Add days from previous month to fill the first row
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();

        for (let i = 0; i < firstDayOfWeek; i++) {
            const day = prevMonthDays - firstDayOfWeek + i + 1;
            days.push({
                date: new Date(year, month - 1, day),
                isCurrentMonth: false,
                isToday: isSameDay(new Date(year, month - 1, day), new Date()),
            });
        }

        // Add days from current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true,
                isToday: isSameDay(new Date(year, month, i), new Date()),
            });
        }

        // Add days from next month to fill the last row
        const daysNeeded = 42 - days.length; // 6 rows of 7 days
        for (let i = 1; i <= daysNeeded; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
                isToday: isSameDay(new Date(year, month + 1, i), new Date()),
            });
        }

        return days;
    };

// Get week days for week view
    const getWeekDays = (date: Date): Date[] => {
        const result: Date[] = [];
        const startDate = getWeekStartDate(date);

        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            result.push(day);
        }

        return result;
    };

// Get the start of the week
    const getWeekStartDate = (date: Date): Date => {
        const result = new Date(date);
        const day = result.getDay();
        result.setDate(result.getDate() - day); // Start from Sunday
        return result;
    };

// Get the end of the week
    const getWeekEndDate = (date: Date): Date => {
        const result = new Date(date);
        const day = result.getDay();
        result.setDate(result.getDate() + (6 - day)); // End on Saturday
        return result;
    };

// Check if date is today
    const isToday = (date: Date): boolean => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

// Check if the week contains today
    const isCurrentWeek = (date: Date): boolean => {
        const today = new Date();
        const weekStart = getWeekStartDate(date);
        const weekEnd = getWeekEndDate(date);
        return today >= weekStart && today <= weekEnd;
    };

    // Filtered appointments based on the current calendar view
    const selectedCalendarAppointments = useMemo<Appointment[]>(() => {
        if (calendarViewMode === 'day') {
            return appointments.filter(app => {
                const appDate = new Date(app.appointment_time);
                return isSameDay(appDate, calendarDate);
            });
        } else if (calendarViewMode === 'week') {
            const weekStart = getWeekStartDate(calendarDate);
            const weekEnd = getWeekEndDate(calendarDate);
            return appointments.filter(app => {
                const appDate = new Date(app.appointment_time);
                return appDate >= weekStart && appDate <= weekEnd;
            });
        } else {
            // Month view
            return appointments.filter(app => {
                const appDate = new Date(app.appointment_time);
                return appDate.getMonth() === calendarDate.getMonth() &&
                    appDate.getFullYear() === calendarDate.getFullYear();
            });
        }
    }, [appointments, calendarDate, calendarViewMode]);


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

    // Filter appointments based on search, date, status, and type
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

        // Filter by selected date
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

    // Generate calendar days for the current month
    const generateCalendarDays = (): CalendarDay[] => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // First day of the month
        const firstDayOfMonth = new Date(year, month, 1);

        // Last day of the month
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Day of week for the first day (0 = Sunday, 1 = Monday, etc)
        const firstDayOfWeek = firstDayOfMonth.getDay();

        // Array to hold all calendar days
        const days: CalendarDay[] = [];

        // Add days from previous month
        const daysFromPrevMonth = firstDayOfWeek;
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();

        for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
            const date = new Date(year, month - 1, i);
            days.push({
                date,
                isCurrentMonth: false,
                isToday: isSameDay(date, new Date()),
                hasAppointment: hasAppointmentOnDate(date)
            });
        }

        // Add days from current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const date = new Date(year, month, i);
            days.push({
                date,
                isCurrentMonth: true,
                isToday: isSameDay(date, new Date()),
                hasAppointment: hasAppointmentOnDate(date)
            });
        }

        // Add days from next month to complete the grid (6 rows of 7 days)
        const totalDaysNeeded = 42; // 6 rows x 7 days
        const daysFromNextMonth = totalDaysNeeded - days.length;

        for (let i = 1; i <= daysFromNextMonth; i++) {
            const date = new Date(year, month + 1, i);
            days.push({
                date,
                isCurrentMonth: false,
                isToday: isSameDay(date, new Date()),
                hasAppointment: hasAppointmentOnDate(date)
            });
        }

        return days;
    };

    // Helper to check if a date has appointments
    const hasAppointmentOnDate = (date: Date): boolean => {
        return appointments.some(app => {
            const appDate = new Date(app.appointment_time);
            return isSameDay(appDate, date);
        });
    };

    // Helper to check if two dates are the same day


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

    // Navigate to previous month
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Day labels for calendar
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">My Appointments</h1>
                            <p className="text-gray-600 pt-1">Manage your upcoming and past appointments</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/patients/doctors">
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                                    <Plus size={16} />
                                    <span>New Appointment</span>
                                </button>
                            </Link>

                            <div className="flex p-1 bg-gray-100 rounded-lg">
                                <button
                                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                    onClick={() => setViewMode('list')}
                                    aria-label="List view"
                                >
                                    <ListFilter size={18} />
                                </button>
                                <button
                                    className={`p-2 rounded-md ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                    onClick={() => setViewMode('calendar')}
                                    aria-label="Calendar view"
                                >
                                    <CalendarDays size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search and filter bar */}
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
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
                                <option value="">Status</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Completed">Completed</option>
                            </select>

                            <select
                                value={typeFilter || ''}
                                onChange={(e) => setTypeFilter(e.target.value || null)}
                                className="p-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All types</option>
                                <option value="In person">In person</option>
                                <option value="Virtual">Virtual</option>
                                <option value="Home visit">Home visit</option>
                            </select>

                            {(statusFilter || typeFilter || searchQuery || selectedDate) && (
                                <button
                                    onClick={() => {
                                        setStatusFilter(null);
                                        setTypeFilter(null);
                                        setSearchQuery('');
                                        setSelectedDate(null);
                                    }}
                                    className="p-2 text-gray-600 hover:text-gray-900 rounded-lg"
                                    aria-label="Clear filters"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Calendar sidebar (always visible on large screens) */}
                    <div className="lg:w-80 space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-medium text-gray-800">
                                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>
                                <div className="flex gap-1">
                                    <button
                                        onClick={prevMonth}
                                        className="p-1 rounded-md hover:bg-gray-100"
                                        aria-label="Previous month"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextMonth}
                                        className="p-1 rounded-md hover:bg-gray-100"
                                        aria-label="Next month"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {dayLabels.map(day => (
                                    <div key={day} className="text-xs text-center text-gray-500 font-medium py-1">
                                        {day.charAt(0)}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {generateCalendarDays().map((day, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(day.isCurrentMonth ? day.date : null)}
                                        className={`
                      aspect-square flex items-center justify-center rounded-md text-sm relative
                      ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                      ${day.isToday ? 'border border-indigo-300' : ''}
                      ${selectedDate && isSameDay(day.date, selectedDate) ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}
                    `}
                                        disabled={!day.isCurrentMonth}
                                    >
                                        {day.date.getDate()}
                                        {day.hasAppointment && !selectedDate && (
                                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {selectedDate && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                      })}
                    </span>
                                        <button
                                            onClick={() => setSelectedDate(null)}
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {filteredAppointments.length}
                                        {filteredAppointments.length === 1 ? ' appointment' : ' appointments'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Stats card */}
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h2 className="font-medium text-gray-800 mb-3">Overview</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total</span>
                                    <span className="font-medium">{appointments.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Upcoming</span>
                                    <span className="font-medium text-indigo-600">
                    {appointments.filter(a => getDaysUntil(a.appointment_time) >= 0 && a.status !== 'Cancelled').length}
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Confirmed</span>
                                    <span className="font-medium text-green-600">
                    {appointments.filter(a => a.status === 'Confirmed').length}
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pending</span>
                                    <span className="font-medium text-amber-600">
                    {appointments.filter(a => a.status === 'Pending').length}
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cancelled</span>
                                    <span className="font-medium text-red-600">
                    {appointments.filter(a => a.status === 'Cancelled').length}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1">
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
                                <Link href="/appointments/new">
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                        Schedule New Appointment
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* List view */}
                        {viewMode === 'list' && filteredAppointments.length > 0 && (
                            <div className="space-y-4">
                                {/* Upcoming appointments section */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-medium text-gray-800 mb-4">
                                        {selectedDate
                                            ? `Appointments on ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
                                            : 'Upcoming Appointments'
                                        }
                                    </h2>
                                    <div className="space-y-4">
                                        {filteredAppointments
                                            .filter(app => !selectedDate && getDaysUntil(app.appointment_time) >= 0)
                                            .sort((a, b) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime())
                                            .map(appointment => (
                                                <AppointmentCard
                                                    key={appointment.schedule_id}
                                                    appointment={appointment}
                                                    formatDate={formatDate}
                                                    formatTime={formatTime}
                                                    getDaysUntil={getDaysUntil}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>

                                {/* Past appointments section - only show if no date selected */}
                                {!selectedDate && (
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-800 mb-4">Past Appointments</h2>
                                        <div className="space-y-4">
                                            {filteredAppointments
                                                .filter(app => getDaysUntil(app.appointment_time) < 0)
                                                .sort((a, b) => new Date(b.appointment_time).getTime() - new Date(a.appointment_time).getTime())
                                                .map(appointment => (
                                                    <AppointmentCard
                                                        key={appointment.schedule_id}
                                                        appointment={appointment}
                                                        formatDate={formatDate}
                                                        formatTime={formatTime}
                                                        getDaysUntil={getDaysUntil}
                                                        isPast
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Calendar view - simplified implementation */}
                        {/* Calendar view - full implementation */}
                        {viewMode === 'calendar' && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6">
                                    {/* Calendar header with view options */}
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-medium text-gray-800">Calendar View</h2>
                                        <div className="flex items-center gap-2">
                                            <div className="flex p-1 bg-gray-100 rounded-lg">
                                                <button
                                                    className={`px-3 py-1 text-sm rounded-md ${calendarViewMode === 'month' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                                    onClick={() => setCalendarViewMode('month')}
                                                >
                                                    Month
                                                </button>
                                                <button
                                                    className={`px-3 py-1 text-sm rounded-md ${calendarViewMode === 'week' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                                    onClick={() => setCalendarViewMode('week')}
                                                >
                                                    Week
                                                </button>
                                                <button
                                                    className={`px-3 py-1 text-sm rounded-md ${calendarViewMode === 'day' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                                    onClick={() => setCalendarViewMode('day')}
                                                >
                                                    Day
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => navigateCalendar('prev')}
                                                    className="p-1 rounded-md hover:bg-gray-100"
                                                    aria-label="Previous"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button
                                                    onClick={() => setCalendarDate(new Date())}
                                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                                                >
                                                    Today
                                                </button>
                                                <button
                                                    onClick={() => navigateCalendar('next')}
                                                    className="p-1 rounded-md hover:bg-gray-100"
                                                    aria-label="Next"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current period display */}
                                    <div className="text-xl font-medium text-gray-800 mb-4">
                                        {calendarViewMode === 'month' &&
                                            calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        {calendarViewMode === 'week' &&
                                            `${getWeekStartDate(calendarDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${getWeekEndDate(calendarDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                        {calendarViewMode === 'day' &&
                                            calendarDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>

                                    {/* Month View */}
                                    {calendarViewMode === 'month' && (
                                        <div className="overflow-hidden">
                                            {/* Day headers */}
                                            <div className="grid grid-cols-7 gap-px bg-gray-200">
                                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                    <div key={day} className="bg-gray-50 py-2 text-center text-sm text-gray-500 font-medium">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar grid */}
                                            <div className="grid grid-cols-7 gap-px bg-gray-200">
                                                {generateMonthDays().map((day, idx) => {
                                                    // Find appointments for this day
                                                    const dayAppointments = appointments.filter(app => {
                                                        const appDate = new Date(app.appointment_time);
                                                        return isSameDay(appDate, day.date);
                                                    });

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`bg-white min-h-[120px] p-2 ${
                                                                day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                                                            } ${
                                                                day.isToday ? 'bg-indigo-50' : ''
                                                            }`}
                                                            onClick={() => setSelectedDate(day.date)}
                                                        >
                                                            <div className={`text-right mb-1 ${
                                                                day.isToday ? 'font-bold' : ''
                                                            }`}>
                                                                {day.date.getDate()}
                                                            </div>

                                                            <div className="space-y-1">
                                                                {dayAppointments.slice(0, 3).map(app => (
                                                                    <div
                                                                        key={app.schedule_id}
                                                                        className={`text-xs px-2 py-1 truncate rounded ${
                                                                            app.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                                                app.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                                                    app.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                                        'bg-gray-100 text-gray-800'
                                                                        }`}
                                                                        title={`${app.doctor_name} - ${app.reason}`}
                                                                    >
                                                                        {formatTime(app.appointment_time)} {app.doctor_name}
                                                                    </div>
                                                                ))}

                                                                {dayAppointments.length > 3 && (
                                                                    <div className="text-xs text-center text-gray-500 mt-1">
                                                                        + {dayAppointments.length - 3} more
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Week View */}
                                    {calendarViewMode === 'week' && (
                                        <div className="overflow-x-auto">
                                            <div className="min-w-[800px]">
                                                {/* Time labels */}
                                                <div className="grid grid-cols-8 gap-px bg-gray-200">
                                                    <div className="bg-gray-50 w-20"></div>
                                                    {getWeekDays(calendarDate).map((date, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`bg-gray-50 py-2 text-center ${
                                                                isToday(date) ? 'bg-indigo-50 font-medium' : ''
                                                            }`}
                                                        >
                                                            <div className="text-gray-500 text-sm">
                                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                            </div>
                                                            <div className="text-gray-800">
                                                                {date.getDate()}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Time slots */}
                                                <div className="relative">
                                                    {[...Array(24)].map((_, hour) => (
                                                        <div key={hour} className="grid grid-cols-8 gap-px bg-gray-200">
                                                            {/* Hour label */}
                                                            <div className="bg-gray-50 w-20 text-right pr-2 py-2">
                                                                <span className="text-xs text-gray-500">
                                                                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                                                </span>
                                                            </div>

                                                            {/* Day columns */}
                                                            {getWeekDays(calendarDate).map((date, dayIdx) => {
                                                                // Find appointments for this day and hour
                                                                const hourAppointments = appointments.filter(app => {
                                                                    const appDate = new Date(app.appointment_time);
                                                                    return isSameDay(appDate, date) && appDate.getHours() === hour;
                                                                });

                                                                return (
                                                                    <div
                                                                        key={dayIdx}
                                                                        className={`bg-white h-16 relative border-b border-gray-100 ${
                                                                            isToday(date) ? 'bg-indigo-50/30' : ''
                                                                        }`}
                                                                    >
                                                                        {hourAppointments.map(app => (
                                                                            <div
                                                                                key={app.schedule_id}
                                                                                className={`absolute left-0 right-0 mx-1 p-1 rounded text-xs shadow-sm border-l-2 ${
                                                                                    app.status === 'Confirmed' ? 'bg-green-50 border-green-500' :
                                                                                        app.status === 'Pending' ? 'bg-amber-50 border-amber-500' :
                                                                                            app.status === 'Cancelled' ? 'bg-red-50 border-red-500' :
                                                                                                'bg-gray-50 border-gray-500'
                                                                                }`}
                                                                                style={{
                                                                                    top: `${(new Date(app.appointment_time).getMinutes() / 60) * 100}%`,
                                                                                    height: '80%', // Approximate for simplicity
                                                                                }}
                                                                                title={`${formatTime(app.appointment_time)} - ${app.doctor_name} - ${app.reason}`}
                                                                            >
                                                                                <div className="font-medium truncate">{formatTime(app.appointment_time)} {app.doctor_name}</div>
                                                                                <div className="truncate text-gray-600">{app.reason}</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ))}

                                                    {/* Current time indicator */}
                                                    {isCurrentWeek(calendarDate) && (
                                                        <div
                                                            className="absolute left-0 right-0 border-t-2 border-red-500 z-10 flex items-center"
                                                            style={{
                                                                top: `${(new Date().getHours() + new Date().getMinutes() / 60) * 4}rem`,
                                                            }}
                                                        >
                                                            <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Day View */}
                                    {/* Day View */}
                                    {calendarViewMode === 'day' && (
                                        <div className="relative overflow-hidden">
                                            <div className="grid grid-cols-1 gap-px bg-gray-200">
                                                {[...Array(24)].map((_, hour) => {
                                                    // Find appointments for this hour
                                                    const hourAppointments = appointments.filter(app => {
                                                        const appDate = new Date(app.appointment_time);
                                                        return isSameDay(appDate, calendarDate) && appDate.getHours() === hour;
                                                    });

                                                    return (
                                                        <div key={hour} className="grid grid-cols-12 gap-px bg-white border-b border-gray-100">
                                                            {/* Hour label */}
                                                            <div className="col-span-1 text-right pr-3 py-4">
                                                                  <span className="text-sm text-gray-500">
                                                                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                                                  </span>
                                                            </div>

                                                            {/* Appointments */}
                                                            <div className="col-span-11 min-h-[6rem] relative">
                                                                {hourAppointments.map(app => (
                                                                    <div
                                                                        key={app.schedule_id}
                                                                        className={`absolute left-0 right-0 mx-2 p-3 rounded shadow-sm border-l-4 ${
                                                                            app.status === 'Confirmed' ? 'bg-green-50 border-green-500' :
                                                                                app.status === 'Pending' ? 'bg-amber-50 border-amber-500' :
                                                                                    app.status === 'Cancelled' ? 'bg-red-50 border-red-500' :
                                                                                        'bg-gray-50 border-gray-500'
                                                                        }`}
                                                                        style={{
                                                                            top: `${(new Date(app.appointment_time).getMinutes() / 60) * 100}%`,
                                                                            height: '80%', // Approximate for simplicity
                                                                        }}
                                                                    >
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                                                {/* eslint-disable @next/next/no-img-element */}
                                                                                {app.doctor_image_url ? (
                                                                                    <img
                                                                                        src={app.doctor_image_url}
                                                                                        alt={app.doctor_name}
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Dr</div>
                                                                                )}
                                                                            </div>

                                                                            <div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="font-medium">{formatTime(app.appointment_time)}</span>
                                                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                                                        app.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                                                            app.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                                                                app.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                                                    'bg-gray-100 text-gray-700'
                                                                                        }`}>
                                                                                      {app.status}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="font-medium">{app.doctor_name}</div>
                                                                                <div className="text-sm text-gray-600">{app.doctor_specialization}</div>
                                                                                <div className="text-sm text-gray-700 mt-1">{app.reason}</div>

                                                                                <div className="flex items-center gap-4 mt-2 text-sm">
                                                                                    <div className="flex items-center gap-1 text-gray-600">
                                                                                        {app.appointment_type === 'In person' && <MapPin size={14} />}
                                                                                        {app.appointment_type === 'Virtual' && <Video size={14} />}
                                                                                        {app.appointment_type === 'Home visit' && <Home size={14} />}
                                                                                        <span>{app.appointment_type}</span>
                                                                                    </div>

                                                                                    {app.appointment_location && (
                                                                                        <div className="flex items-center gap-1 text-gray-600">
                                                                                            <MapPin size={14} />
                                                                                            <span>{app.appointment_location}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                {/* Actions */}
                                                                                <div className="flex gap-2 mt-3">
                                                                                    <Link href={`/appointments/${app.schedule_id}`}>
                                                                                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
                                                                                            Details
                                                                                        </button>
                                                                                    </Link>

                                                                                    {app.status !== 'Cancelled' && app.status !== 'Completed' && getDaysUntil(app.appointment_time) >= 0 && (
                                                                                        <>
                                                                                            <Link href={`/appointments/${app.schedule_id}/reschedule`}>
                                                                                                <button className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 text-sm">
                                                                                                    Reschedule
                                                                                                </button>
                                                                                            </Link>

                                                                                            {app.appointment_type === 'Virtual' && app.meeting_link && (
                                                                                                <a
                                                                                                    href={app.meeting_link}
                                                                                                    target="_blank"
                                                                                                    rel="noopener noreferrer"
                                                                                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-1"
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
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Current time indicator - contained within its parent with z-index */}
                                                {isSameDay(calendarDate, new Date()) && (
                                                    <div className="absolute inset-x-0 z-10 pointer-events-none">
                                                        <div
                                                            className="relative flex items-center"
                                                            style={{
                                                                top: `${(new Date().getHours() + new Date().getMinutes() / 60) * 6}rem`
                                                            }}
                                                        >
                                                            <div className="absolute w-full border-t-2 border-red-500"></div>
                                                            <div className="absolute left-0 w-3 h-3 -ml-1.5 rounded-full bg-red-500"></div>
                                                            <div className="absolute left-3 bg-white text-xs text-red-500 font-medium px-1">
                                                                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Empty state */}
                                    {selectedCalendarAppointments.length === 0 && (
                                        <div className="bg-gray-50 rounded-lg p-8 text-center mt-4">
                                            <Calendar className="mx-auto mb-3 text-gray-400" size={32} />
                                            <h3 className="text-lg font-medium mb-2">No appointments found</h3>
                                            <p className="text-gray-500 mb-4">
                                                {calendarViewMode === 'day'
                                                    ? `No appointments scheduled for ${calendarDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`
                                                    : calendarViewMode === 'week'
                                                        ? 'No appointments scheduled for this week.'
                                                        : 'No appointments scheduled for this month.'}
                                            </p>
                                            <Link href="/appointments/new">
                                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                                    Schedule New Appointment
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Appointment card component

// Additional icon component
const RefreshCw = ({ size = 24, className = "" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );
};

// Additional icon component
const Plus = ({ size = 24, className = "" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 5v14M5 12h14"/>
        </svg>
    );
}