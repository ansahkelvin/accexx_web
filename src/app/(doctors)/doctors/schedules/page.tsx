'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Plus,
    X,
    Check,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    TrashIcon,
    CalendarDays,
    FileText
} from 'lucide-react';
import { format, isSameDay, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';
import { TimeSlotResponse, TimeSlotRequest } from "@/types/doctor";
import { createSchedule, deleteSchedule, fetchDoctorSchedules, createBatchSchedule } from "@/service/doctors/doctor";
import { Button } from "@/components/ui/button";

interface TimeSlot {
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    id: string;
    status: string;
    notes?: string;
}

export default function SchedulesPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [timeSlots, setTimeSlots] = useState<TimeSlotResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreatingSchedule, setIsCreatingSchedule] = useState<boolean>(false);
    const [isCreatingBatch, setIsCreatingBatch] = useState<boolean>(false);
    const [newSchedule, setNewSchedule] = useState<TimeSlotRequest>({
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '09:30',
        durationMinutes: 30,
        notes: ''
    });

    // Calculate duration in minutes between two time strings
    const calculateDuration = (startTime: string, endTime: string): number => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        return endTotalMinutes - startTotalMinutes;
    };

    const fetchSchedules = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchDoctorSchedules();
            if (response === null) {
                setError("Error fetching doctor schedules.");
                return;
            }
            setTimeSlots(response);
        } catch (error) {
            console.error(error);
            setError('Failed to load schedules. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch schedules on component mount
    useEffect(() => {
        fetchSchedules();
    }, []);

    // Handle creating a new schedule
    const handleCreateSchedule = async () => {
        setError(null);

        // Ensure required fields exist
        if (!newSchedule.date || !newSchedule.startTime || !newSchedule.endTime) {
            setError("Date, start time and end time are required.");
            return;
        }

        // Calculate duration
        const duration = calculateDuration(newSchedule.startTime, newSchedule.endTime);
        if (duration <= 0) {
            setError("End time must be after start time");
            return;
        }

        setIsLoading(true);
        try {
            const scheduleRequest: TimeSlotRequest = {
                ...newSchedule,
                durationMinutes: duration
            };

            const response = await createSchedule(scheduleRequest);
            if (!response) {
                setError("Error creating schedule.");
                return;
            }

            await fetchSchedules();
            setIsCreatingSchedule(false);
            // Reset form
            setNewSchedule({
                date: format(new Date(), 'yyyy-MM-dd'),
                startTime: '09:00',
                endTime: '09:30',
                durationMinutes: 30,
                notes: ''
            });
        } catch (error) {
            console.error(error);
            setError("Failed to create schedule. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle creating batch schedules
    const handleCreateBatchSchedule = async () => {
        setError(null);

        // Create multiple slots for the selected date
        const slots: TimeSlotRequest[] = [];
        const startHour = 9; // 9 AM
        const endHour = 17; // 5 PM
        const slotDuration = 30; // 30 minutes

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += slotDuration) {
                const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const endMinute = minute + slotDuration;
                const endHourAdjusted = hour + Math.floor(endMinute / 60);
                const endMinuteAdjusted = endMinute % 60;
                const endTime = `${endHourAdjusted.toString().padStart(2, '0')}:${endMinuteAdjusted.toString().padStart(2, '0')}`;

                slots.push({
                    date: newSchedule.date,
                    startTime,
                    endTime,
                    durationMinutes: slotDuration,
                    notes: `Regular consultation slot`
                });
            }
        }

        setIsLoading(true);
        try {
            const response = await createBatchSchedule(slots);
            if (!response) {
                setError("Error creating batch schedules.");
                return;
            }

            await fetchSchedules();
            setIsCreatingBatch(false);
        } catch (error) {
            console.error(error);
            setError("Failed to create batch schedules. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter time slots for the selected date
    const filteredTimeSlots = timeSlots.filter(slot => {
        const slotDate = parseISO(slot.date);
        return isSameDay(slotDate, selectedDate);
    });

    // Generate week days for the calendar view
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday start
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Group time slots by hour for timeline view
    const timelineTimeSlots = timeSlots.reduce((acc, slot) => {
        const startDateTime = parseISO(slot.startDateTime);
        const endDateTime = parseISO(slot.endDateTime);
        const day = format(startDateTime, 'yyyy-MM-dd');

        if (!acc[day]) {
            acc[day] = [];
        }

        acc[day].push({
            id: slot.id,
            startTime: startDateTime,
            endTime: endDateTime,
            isBooked: slot.status === 'BOOKED',
            status: slot.status,
            notes: slot.notes
        });

        return acc;
    }, {} as Record<string, TimeSlot[]>);

    // Create office hour slots (9 AM to 5 PM)
    const getOfficeHours = () => {
        const hours: { hour: number; label: string }[] = [];
        for (let i = 9; i <= 17; i++) {
            hours.push({
                hour: i,
                label: format(new Date().setHours(i, 0, 0, 0), 'h:mm a')
            });
        }
        return hours;
    };

    const officeHours = getOfficeHours();
    
    const deleteDoctorSchedule = async (timeSlotId: string) => {
        const success = await deleteSchedule(timeSlotId);
        if (!success) {
            setError("Error deleting schedule.");
        } else {
            await fetchSchedules();
        }
    }

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-blue-100 text-blue-800';
            case 'BOOKED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                        onClick={() => setIsCreatingSchedule(true)}
                    >
                        <Plus size={16} />
                        <span>Add Time Slot</span>
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1"
                        onClick={() => setIsCreatingBatch(true)}
                    >
                        <CalendarDays size={16} />
                        <span>Add Day Schedule</span>
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
                    <AlertCircle size={20} className="flex-shrink-0 mr-2" />
                    <div>{error}</div>
                    <button
                        className="ml-auto pl-2 text-red-600 hover:text-red-800"
                        onClick={() => setError(null)}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Weekly Calendar View */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <button
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                            onClick={() => setSelectedDate(subDays(selectedDate, 7))}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                        </h2>
                        <button
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                            onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 p-4">
                    {weekDays.map((day, index) => {
                        const isToday = isSameDay(day, new Date());
                        const isSelected = isSameDay(day, selectedDate);
                        const daySlots = timeSlots.filter(slot =>
                            isSameDay(parseISO(slot.date), day)
                        );

                        return (
                            <div
                                key={index}
                                className={`text-center p-2 rounded-md ${isSelected ? 'bg-blue-50 border border-blue-200' : ''} ${isToday ? 'font-bold' : ''} cursor-pointer hover:bg-gray-50`}
                                onClick={() => setSelectedDate(day)}
                            >
                                <div className="text-sm font-medium">{format(day, 'E')}</div>
                                <div className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center ${isToday ? 'bg-blue-600 text-white' : ''}`}>
                                    {format(day, 'd')}
                                </div>
                                <div className="mt-1 flex justify-center">
                                    <span className={`h-2 w-2 rounded-full ${daySlots.length > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots for Selected Day */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading schedules...</p>
                    </div>
                ) : filteredTimeSlots.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {filteredTimeSlots.map((slot) => (
                            <div key={slot.id} className="px-6 py-4 flex items-center">
                                <div className={`p-2 rounded-full ${slot.status === 'BOOKED' ? 'bg-green-100' : 'bg-blue-100'} mr-4`}>
                                    <Clock size={20} className={slot.status === 'BOOKED' ? 'text-green-600' : 'text-blue-600'} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {slot.formattedStartTime} - {slot.durationText}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {slot.status === 'BOOKED' ? 'Booked appointment' : 'Available for booking'}
                                    </p>
                                    {slot.notes && (
                                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                                            <FileText size={12} />
                                            {slot.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="ml-auto flex gap-2 items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                                        {slot.status}
                                    </span>
                                    {slot.status === 'AVAILABLE' && (
                                        <Button 
                                            className="bg-red-700 rounded-full w-8 h-8 p-0" 
                                            onClick={() => deleteDoctorSchedule(slot.id)}
                                        >
                                            <TrashIcon className="text-white" size={16} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="mx-auto h-16 w-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
                            <Calendar size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No time slots available</h3>
                        <p className="text-gray-500 mb-6">There are no schedules set for this date.</p>
                        <div className="flex gap-2 justify-center">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={() => setIsCreatingSchedule(true)}
                            >
                                Add Time Slot
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                onClick={() => setIsCreatingBatch(true)}
                            >
                                Add Day Schedule
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Timeline View */}
            <div className="bg-white rounded-lg shadow mt-6 overflow-x-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Weekly Schedule Overview</h3>
                </div>

                <div className="p-4 min-w-[800px]">
                    <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-2">
                        {/* Time column */}
                        <div className="col-span-1">
                            <div className="h-10"></div> {/* Empty header cell */}
                            {officeHours.map((hour, idx) => (
                                <div key={idx} className="h-12 flex items-center justify-end pr-2 text-sm text-gray-500">
                                    {hour.label}
                                </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {weekDays.map((day, dayIdx) => (
                            <div key={dayIdx} className="col-span-1">
                                <div className="h-10 text-center font-medium text-gray-700 border-b border-gray-200 mb-1">
                                    {format(day, 'E d')}
                                </div>

                                <div className="relative">
                                    {officeHours.map((hour, hourIdx) => (
                                        <div
                                            key={hourIdx}
                                            className="h-12 border-t border-gray-100 relative"
                                        >
                                            {/* Show slots for this day and hour */}
                                            {timelineTimeSlots[format(day, 'yyyy-MM-dd')]?.map((slot, slotIdx) => {
                                                // Only render if the slot starts within this hour
                                                if (slot.startTime.getHours() === hour.hour) {
                                                    const durationMins = (slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60);
                                                    const heightPerMin = 12 * 60 / 60; // 12 = height of hour cell in px, 60 = mins per hour
                                                    const slotHeight = (durationMins / 60) * heightPerMin;

                                                    return (
                                                        <div
                                                            key={slotIdx}
                                                            className={`absolute left-0 right-0 rounded-sm px-1 ${
                                                                slot.status === 'BOOKED' ? 'bg-green-100 border-l-4 border-green-500' : 'bg-blue-100 border-l-4 border-blue-500'
                                                            }`}
                                                            style={{
                                                                top: `${(slot.startTime.getMinutes() / 60) * heightPerMin}px`,
                                                                height: `${slotHeight}px`,
                                                            }}
                                                        >
                                                            <div className="text-xs truncate font-medium pt-0.5">
                                                                {format(slot.startTime, 'h:mm')}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Schedule Modal */}
            {isCreatingSchedule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Add New Time Slot</h2>
                            <button
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => setIsCreatingSchedule(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newSchedule.date}
                                        onChange={(e) =>
                                            setNewSchedule({...newSchedule, date: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newSchedule.startTime}
                                            onChange={(e) => {
                                                const newStartTime = e.target.value;
                                                const newEndTime = newStartTime ? 
                                                    new Date(`2000-01-01T${newStartTime}:00`).getTime() + (30 * 60 * 1000) : 
                                                    new Date(`2000-01-01T${newStartTime}:00`).getTime();
                                                const endTimeStr = new Date(newEndTime).toTimeString().slice(0, 5);
                                                
                                                setNewSchedule({
                                                    ...newSchedule,
                                                    startTime: newStartTime,
                                                    endTime: endTimeStr
                                                });
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newSchedule.endTime}
                                            onChange={(e) =>
                                                setNewSchedule({...newSchedule, endTime: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Add any notes about this time slot..."
                                        value={newSchedule.notes}
                                        onChange={(e) =>
                                            setNewSchedule({...newSchedule, notes: e.target.value})}
                                    />
                                </div>

                                <div className="bg-blue-50 p-4 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        This time slot will be available for patients to book appointments.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsCreatingSchedule(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                    onClick={handleCreateSchedule}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} className="mr-1" />
                                            <span>Create Schedule</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Batch Schedule Modal */}
            {isCreatingBatch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Add Day Schedule</h2>
                            <button
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => setIsCreatingBatch(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newSchedule.date}
                                        onChange={(e) =>
                                            setNewSchedule({...newSchedule, date: e.target.value})}
                                    />
                                </div>

                                <div className="bg-green-50 p-4 rounded-md">
                                    <p className="text-sm text-green-800">
                                        This will create 30-minute time slots from 9:00 AM to 5:00 PM for the selected date.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsCreatingBatch(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                                    onClick={handleCreateBatchSchedule}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CalendarDays size={16} className="mr-1" />
                                            <span>Create Day Schedule</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}