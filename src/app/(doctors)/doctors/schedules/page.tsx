'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

// TypeScript interfaces
interface Schedule {
    id: string;
    doctor_id: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

interface ScheduleRequest {
    doctor_id: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

interface TimeSlot {
    startTime: Date;
    endTime: Date;
    isBooked?: boolean;
    id?: string;
}

export default function SchedulesPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreatingSchedule, setIsCreatingSchedule] = useState<boolean>(false);
    const [newSchedule, setNewSchedule] = useState<{
        startTime: string;
        endTime: string;
        date: string;
    }>({
        startTime: '09:00',
        endTime: '09:30',
        date: format(new Date(), 'yyyy-MM-dd'),
    });

    const doctorId = '123e4567-e89b-12d3-a456-426614174000'; // Would come from auth context in real app

    // Mock schedules for demo - this would be replaced with API calls
    const mockSchedules: Schedule[] = [
        {
            id: '1',
            doctor_id: doctorId,
            start_time: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
            end_time: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
            is_booked: true
        },
        {
            id: '2',
            doctor_id: doctorId,
            start_time: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
            end_time: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
            is_booked: false
        },
        {
            id: '3',
            doctor_id: doctorId,
            start_time: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
            end_time: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(),
            is_booked: false
        },
        {
            id: '4',
            doctor_id: doctorId,
            start_time: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
            end_time: new Date(new Date().setHours(13, 30, 0, 0)).toISOString(),
            is_booked: true
        },
        {
            id: '5',
            doctor_id: doctorId,
            start_time: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
            end_time: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
            is_booked: false
        },
        {
            id: '6',
            doctor_id: doctorId,
            start_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
            end_time: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
            is_booked: false
        },
        // Tomorrow's schedules
        {
            id: '7',
            doctor_id: doctorId,
            start_time: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9, 0, 0, 0)).toISOString(),
            end_time: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9, 30, 0, 0)).toISOString(),
            is_booked: false
        },
        {
            id: '8',
            doctor_id: doctorId,
            start_time: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 0, 0, 0)).toISOString(),
            end_time: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 30, 0, 0)).toISOString(),
            is_booked: true
        }
    ];

    // Fetch schedules - this would use actual API in production
    useEffect(() => {
        const fetchSchedules = async () => {
            setIsLoading(true);
            try {
                // In a real app, this would be an API call
                // const response = await fetch(`/api/schedules?doctor_id=${doctorId}`);
                // if (!response.ok) throw new Error('Failed to fetch schedules');
                // const data = await response.json();
                // setSchedules(data);

                // Using mock data for demo
                setTimeout(() => {
                    setSchedules(mockSchedules);
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                console.error(error);
                setError('Failed to load schedules. Please try again.');
                setIsLoading(false);
            }
        };

        fetchSchedules().then();
    }, []);

    // Handle creating a new schedule
    const handleCreateSchedule = async () => {
        // Validate time inputs
        if (newSchedule.startTime >= newSchedule.endTime) {
            setError('End time must be after start time');
            return;
        }

        setIsLoading(true);
        try {
            const startDateTime = new Date(`${newSchedule.date}T${newSchedule.startTime}`);
            const endDateTime = new Date(`${newSchedule.date}T${newSchedule.endTime}`);

            const scheduleRequest: ScheduleRequest = {
                doctor_id: doctorId,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                is_booked: false
            };

            // In a real app, this would be an API call
            /*
            const response = await fetch('/api/schedules/new', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(scheduleRequest)
            });

            if (!response.ok) throw new Error('Failed to create schedule');
            const data = await response.json();
            setSchedules(prev => [...prev, data]);
            */

            // Using mock data for demo
            const newId = (Math.max(...schedules.map(s => parseInt(s.id))) + 1).toString();
            const newScheduleData: Schedule = {
                id: newId,
                ...scheduleRequest
            };

            setSchedules(prev => [...prev, newScheduleData]);
            setIsCreatingSchedule(false);
            setNewSchedule({
                startTime: '09:00',
                endTime: '09:30',
                date: format(new Date(), 'yyyy-MM-dd'),
            });
            setError(null);
        } catch (error) {
            console.error(error);
            setError('Failed to create schedule. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter schedules for the selected date
    const filteredSchedules = schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.start_time);
        return isSameDay(scheduleDate, selectedDate);
    });

    // Generate week days for the calendar view
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday start
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Group schedules by hour for timeline view
    const timelineSchedules = schedules.reduce((acc, schedule) => {
        const startTime = new Date(schedule.start_time);
        const endTime = new Date(schedule.end_time);
        const day = format(startTime, 'yyyy-MM-dd');

        if (!acc[day]) {
            acc[day] = [];
        }

        acc[day].push({
            id: schedule.id,
            startTime,
            endTime,
            isBooked: schedule.is_booked
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

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                    onClick={() => setIsCreatingSchedule(true)}
                >
                    <Plus size={16} />
                    <span>Add Time Slot</span>
                </button>
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
                        const daySchedules = schedules.filter(s =>
                            isSameDay(new Date(s.start_time), day)
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
                                    <span className={`h-2 w-2 rounded-full ${daySchedules.length > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
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
                ) : filteredSchedules.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {filteredSchedules.map((schedule) => (
                            <div key={schedule.id} className="px-6 py-4 flex items-center">
                                <div className={`p-2 rounded-full ${schedule.is_booked ? 'bg-green-100' : 'bg-blue-100'} mr-4`}>
                                    <Clock size={20} className={schedule.is_booked ? 'text-green-600' : 'text-blue-600'} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {format(new Date(schedule.start_time), 'h:mm a')} - {format(new Date(schedule.end_time), 'h:mm a')}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {schedule.is_booked ? 'Booked appointment' : 'Available for booking'}
                                    </p>
                                </div>
                                <div className="ml-auto flex">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      schedule.is_booked ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {schedule.is_booked ? 'Booked' : 'Available'}
                  </span>
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
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            onClick={() => setIsCreatingSchedule(true)}
                        >
                            Add Time Slot
                        </button>
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
                                            {timelineSchedules[format(day, 'yyyy-MM-dd')]?.map((slot, slotIdx) => {
                                                // Only render if the slot starts within this hour
                                                if (slot.startTime.getHours() === hour.hour) {
                                                    const durationMins = (slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60);
                                                    const heightPerMin = 12 * 60 / 60; // 12 = height of hour cell in px, 60 = mins per hour
                                                    const slotHeight = (durationMins / 60) * heightPerMin;

                                                    return (
                                                        <div
                                                            key={slotIdx}
                                                            className={`absolute left-0 right-0 rounded-sm px-1 ${
                                                                slot.isBooked ? 'bg-green-100 border-l-4 border-green-500' : 'bg-blue-100 border-l-4 border-blue-500'
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
                                        onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newSchedule.startTime}
                                            onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newSchedule.endTime}
                                            onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                                        />
                                    </div>
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
        </div>
    );
}