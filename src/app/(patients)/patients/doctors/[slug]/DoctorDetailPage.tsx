'use client';

import { toast } from 'react-hot-toast'; // or your preferred toast library
import { useState } from 'react';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, ClockIcon, VideoIcon, UserIcon, PhoneIcon, MailIcon, CheckCircleIcon } from 'lucide-react';
import { format } from 'date-fns';
import {AppointmentRequestData, AppointmentStatus, AppointmentType, DoctorDetails, Schedule} from "@/types/types";
import {bookAppointment} from "@/app/actions/user";



// Create a client component that takes the slug as a prop, not params
export default function DoctorDetailPageClient({ doctor, patientId }: { doctor: DoctorDetails, patientId: string }) {
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [appointmentReason, setAppointmentReason] = useState('');
    const [appointmentType, setAppointmentType] = useState<'VIRTUAL' | 'IN_PERSON'>('VIRTUAL');
    const [isBooking, setIsBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);



    // Group schedules by date
    const groupedSchedules = () => {
        if (!doctor) return {};

        const grouped: Record<string, Schedule[]> = {};
        doctor.schedule.forEach(schedule => {
            const date = new Date(schedule.start_time).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(schedule);
        });

        return grouped;
    };

    const handleScheduleSelect = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
    };

    const handleBookAppointment = async () => {
        if (!doctor || !selectedSchedule) return;


        setIsBooking(true);

        const appointmentPayload: AppointmentRequestData = {
            doctor_id: doctor.id,
            patient_id: patientId,
            schedule_id: selectedSchedule.id,
            appointment_time: new Date(selectedSchedule.start_time), // Convert string to Date object
            status: AppointmentStatus.PENDING,
            reason: appointmentReason,
            appointment_type: appointmentType as AppointmentType, // Use proper enum type casting
            meeting_link: appointmentType === 'VIRTUAL' ? 'https://meet.example.com/dr-waymo' : '', // Empty string instead of undefined
            appointment_location: appointmentType === 'IN_PERSON' ? doctor.work_address : '', // Empty string instead of undefined
            appointment_location_latitude: appointmentType === 'IN_PERSON' ? doctor.work_address_latitude : 0, // 0 instead of undefined
            appointment_location_longitude: appointmentType === 'IN_PERSON' ? doctor.work_address_longitude : 0 // 0 instead of undefined
        };

        try {
            // Mock successful booking
            console.log('Booking appointment with payload:', appointmentPayload);

            // Simulate API delay
            const response = await bookAppointment(appointmentPayload);
            console.log(response)




            setBookingSuccess(true);
            // Show success toast
            toast.success("Appointment booked successfully!");

            // Redirect to appointments page



        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    const dateLabels = Object.keys(groupedSchedules());
    const schedulesForSelectedDate = selectedDate ? groupedSchedules()[selectedDate] : [];

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Doctor Quick Info Card */}

                <div className="w-full rounded-xl mb-10 overflow-hidden bg-white shadow-sm">
                    {/* Banner image */}
                    <div className="relative h-64 w-full">
                        <Image
                            src={"https://images.unsplash.com/photo-1596522354390-cf8320c02db3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                            alt="Doctor consultation"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>


                        {/* Profile image overlay */}
                        <div className="absolute bottom-10 left-8">
                            <div className="h-40 w-40 rounded-full bg-mint-100 p-1 shadow-lg">
                                <div className="h-full w-full rounded-full overflow-hidden border-4 border-white shadow-inner">
                                    <Image
                                        src={doctor.profile_image}
                                        alt={doctor.name}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content section */}
                    <div className="pt-10 pb-6 px-8">
                        {/* Doctor name and specialty */}
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">{doctor.name}</h1>
                            <div className="flex items-center ml-4">
                                <span className="inline-flex items-center px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
                                  <span className="mr-1.5">•</span> {doctor.specialization}
                                </span>
                            </div>
                        </div>

                        {/* Hospital and location */}
                        <p className="text-gray-700 mt-2 text-sm">{doctor.work_address}</p>

                        {/* Stats section */}
                        <div className="flex items-center mt-4 space-x-6">
                            <div className="flex items-center">
                                <ClockIcon className="h-5 w-5 text-gray-500" />
                                <span className="ml-2 text-gray-700 text-sm">Full-time</span>
                            </div>

                        </div>

                        {/* No divider or medical actions */}
                    </div>
                </div>


                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Doctor Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6">
                            <div className="p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">About Dr. {doctor.name.split(' ')[0]}</h2>
                                <p className="text-gray-700 leading-relaxed text-sm">{doctor.bio}</p>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-xl overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div className="ml-3">
                                            <h3 className="text-gray-700 font-medium text-sm">Address</h3>
                                            <p className="text-gray-600 text-sm">123 Medical Center, {doctor.work_address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div className="ml-3 text-sm">
                                            <h3 className="text-gray-700 font-medium">Phone</h3>
                                            <p className="text-gray-600">Not Available</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <MailIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div className="ml-3 text-sm">
                                            <h3 className="text-gray-700 font-medium">Email</h3>
                                            <p className="text-gray-600">Not Available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Appointment Booking */}
                    <div className="lg:col-span-2">
                        {bookingSuccess ? (
                            <div className="bg-white shadow-md rounded-xl overflow-hidden">
                                <div className="bg-green-50 px-6 py-8 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        Your appointment with Dr. {doctor.name} has been scheduled. You will receive a confirmation email shortly.
                                    </p>

                                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 max-w-md mx-auto text-left">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-800">Appointment Details</h3>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start">
                                                <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                                                <div className="ml-3">
                                                    <p className="text-gray-600 text-sm">Date</p>
                                                    <p className="text-gray-900">
                                                        {new Date(selectedSchedule!.start_time).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                                                <div className="ml-3">
                                                    <p className="text-gray-600 text-sm">Time</p>
                                                    <p className="text-gray-900">
                                                        {format(new Date(selectedSchedule!.start_time), 'h:mm a')} - {format(new Date(selectedSchedule!.end_time), 'h:mm a')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                {appointmentType === 'VIRTUAL' ? (
                                                    <VideoIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                                                ) : (
                                                    <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                                                )}
                                                <div className="ml-3">
                                                    <p className="text-gray-600 text-sm">Type</p>
                                                    <p className="text-gray-900">{appointmentType === 'VIRTUAL' ? 'Virtual Consultation' : 'In-Person Visit'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setBookingSuccess(false);
                                            setSelectedSchedule(null);
                                            setAppointmentReason('');
                                        }}
                                        className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Book Another Appointment
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white shadow-md rounded-xl overflow-hidden">
                                <div className="border-b border-gray-200">
                                    <div className="p-6">
                                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                            <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
                                            Book an Appointment
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-600">Select a date and time slot to schedule your appointment with Dr. {doctor.name}</p>
                                    </div>
                                </div>

                                <div className="border-b border-gray-200 overflow-x-auto">
                                    <div className="flex whitespace-nowrap min-w-full overflow-x-auto scrollbar-hide pb-1">
                                        {dateLabels.map(dateLabel => {
                                            const date = new Date(dateLabel);
                                            const isToday = date.toDateString() === new Date().toDateString();
                                            const isSelected = dateLabel === selectedDate;

                                            return (
                                                <button
                                                    key={dateLabel}
                                                    onClick={() => setSelectedDate(dateLabel)}
                                                    className={`py-4 px-3 text-center focus:outline-none transition w-24 flex-shrink-0 ${
                                                        isSelected
                                                            ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <p className="font-medium">
                                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                    </p>
                                                    <p className={`text-lg mt-1 ${isToday ? 'bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-sm font-medium' : ''}`}>
                                                        {date.toLocaleDateString('en-US', { day: 'numeric' })}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {date.toLocaleDateString('en-US', { month: 'short' })}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time Slots Grid */}
                                <div className="p-6">
                                    <h3 className="text-gray-700 text-sm font-medium mb-4">Available time slots on {new Date(selectedDate || '').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {schedulesForSelectedDate && schedulesForSelectedDate.length > 0 ? (
                                            schedulesForSelectedDate.map(schedule => (
                                                <button
                                                    key={schedule.id}
                                                    disabled={schedule.is_booked}
                                                    onClick={() => !schedule.is_booked && handleScheduleSelect(schedule)}
                                                    className={`py-3 px-4 rounded-lg border transition focus:outline-none text-center ${
                                                        schedule.is_booked
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                                            : selectedSchedule?.id === schedule.id
                                                                ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200'
                                                                : 'hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <ClockIcon className={`h-4 w-4 mr-1.5 ${
                                                            schedule.is_booked
                                                                ? 'text-gray-400'
                                                                : selectedSchedule?.id === schedule.id
                                                                    ? 'text-blue-600'
                                                                    : 'text-gray-500'
                                                        }`} />
                                                        <span>
                                                          {format(new Date(schedule.start_time), 'h:mm a')}
                                                        </span>
                                                                </div>
                                                            {schedule.is_booked && ( 
                                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                          Booked
                                                        </span>
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-8">
                                                <p className="text-gray-500">No available slots for this date. Please select another date.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Appointment Details Form */}
                                    {selectedSchedule && (
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-md py-3 text-gray-700 font-bold mb-2">Appointment Type</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {/*<label*/}
                                                        {/*    className={`border rounded-lg p-4 text-sm flex items-center cursor-pointer transition ${*/}
                                                        {/*        appointmentType === 'VIRTUAL'*/}
                                                        {/*            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-200'*/}
                                                        {/*            : 'hover:bg-gray-50'*/}
                                                        {/*    }`}*/}
                                                        {/*>*/}
                                                        {/*    <input*/}
                                                        {/*        type="radio"*/}
                                                        {/*        name="appointmentType"*/}
                                                        {/*        value="VIRTUAL"*/}
                                                        {/*        checked={appointmentType === 'VIRTUAL'}*/}
                                                        {/*        onChange={() => setAppointmentType('VIRTUAL')}*/}
                                                        {/*        className="h-4 w-4 text-blue-600 focus:ring-blue-500"*/}
                                                        {/*    />*/}
                                                        {/*    <div className="ml-3 text-sm">*/}
                                                        {/*        <span className="block text-gray-900 font-medium">Virtual Visit</span>*/}
                                                        {/*        <span className="block text-gray-500 text-sm">Consult with the doctor online</span>*/}
                                                        {/*    </div>*/}
                                                        {/*    <VideoIcon className="ml-auto h-5 w-5 text-blue-500" />*/}
                                                        {/*</label>*/}

                                                        <label
                                                            className={`border rounded-lg p-4 flex items-center cursor-pointer transition ${
                                                                appointmentType === 'IN_PERSON'
                                                                    ? 'bg-green-50 border-green-500 ring-1 ring-green-200'
                                                                    : 'hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="appointmentType"
                                                                value="IN_PERSON"
                                                                checked={appointmentType === 'IN_PERSON'}
                                                                onChange={() => setAppointmentType('IN_PERSON')}
                                                                className="h-4 w-4 text-green-600 focus:ring-green-500"
                                                            />
                                                            <div className="ml-3 text-sm py-1">
                                                                <span className="block text-gray-900 font-medium">In Person Visit</span>
                                                                <span className="block text-gray-500 text-sm">Visit the doctor&#39;s office</span>
                                                            </div>
                                                            <UserIcon className="ml-auto h-5 w-5 text-green-500" />
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="reason" className="block text-sm text-gray-700 font-medium mb-2">Reason for Visit</label>
                                                    <textarea
                                                        id="reason"
                                                        value={appointmentReason}
                                                        onChange={(e) => setAppointmentReason(e.target.value)}
                                                        placeholder="Briefly describe your symptoms or reason for the appointment..."
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                        rows={4}
                                                    />
                                                </div>

                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={handleBookAppointment}
                                                        disabled={isBooking || !appointmentReason.trim()}
                                                        className={`inline-flex items-center justify-center py-3 px-6 rounded-lg font-medium transition ${
                                                            isBooking || !appointmentReason.trim()
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                        }`}
                                                    >
                                                        {isBooking ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            'Confirm Appointment'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
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