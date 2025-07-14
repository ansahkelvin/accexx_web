import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, MapPin, Video, Star, Calendar, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

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

interface ReviewData {
    appointment_id: string;
    patient_id: string;
    doctor_id: string;
    rating: number;
    review: string;
}

interface UpdateAppointmentStatusResponse {
    ok: boolean;
    error?: string;
    data?: unknown;
}

interface SubmitReviewResponse {
    success: boolean;
    error?: string;
}

interface GroupedAppointmentCardProps {
    groupedAppointments: GroupedDoctorAppointments;
    formatDate: (date: string) => string;
    formatTime: (date: string) => string;
    getDaysUntil: (date: string) => number;
    isPast?: boolean;
    onUpdateAppointmentStatus?: (appointmentId: string, status: string, scheduleId: string) => Promise<UpdateAppointmentStatusResponse>;
    onSubmitReview?: (reviewData: ReviewData) => Promise<SubmitReviewResponse>;
}

export default function GroupedAppointmentCard({
                                                   groupedAppointments,
                                                   formatDate,
                                                   formatTime,
                                                   getDaysUntil,
                                                   isPast = false,
                                                   onUpdateAppointmentStatus,
                                                   onSubmitReview,
                                               }: GroupedAppointmentCardProps) {
    const router = useRouter();
    const { doctor_id, doctor_name, doctor_specialization, doctor_image_url, appointments } = groupedAppointments;

    // State for dialogs
    const [isAllAppointmentsOpen, setIsAllAppointmentsOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // State for review
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Sort appointments by date (ascending for upcoming, descending for past)
    const sortedAppointments = [...appointments].sort((a, b) => {
        const dateA = new Date(a.appointment_time).getTime();
        const dateB = new Date(b.appointment_time).getTime();
        return isPast ? dateB - dateA : dateA - dateB;
    });

    // Get closest upcoming appointment for some display purposes
    const primaryAppointment = sortedAppointments[0];
    const nextAppointmentDays = getDaysUntil(primaryAppointment.appointment_time);

    // Chat request data for the primary appointment
    const chatRequest = {
        patient_id: primaryAppointment.patient_id,
        doctor_id: primaryAppointment.doctor_id,
        appointment_id: primaryAppointment.id,
    };

    // Get appropriate icon for appointment type
    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Virtual":
                return <Video size={16} className="text-blue-500" />;
            case "Home visit":
                return <Home size={16} className="text-green-500" />;
            default:
                return <MapPin size={16} className="text-red-500" />;
        }
    };

    // Get color for appointment status
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "bg-green-100 text-green-700";
            case "Pending":
                return "bg-amber-100 text-amber-700";
            case "Canceled":
                return "bg-red-100 text-red-700";
            case "Completed":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Navigate to doctor details for booking again
    const handleNavigateToDoctorDetails = () => {
        router.push(`/patients/doctors/${doctor_id}`);
    };

  

   

    // Handle opening the review dialog
    const handleOpenReview = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setRating(0);
        setReview("");
        setIsReviewOpen(true);
    };

    // Handle opening the cancel dialog
    const handleOpenCancel = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsCancelOpen(true);
    };

    // Handle appointment status change
    const handleStatusChange = async (status: string) => {
        if (!selectedAppointment || !onUpdateAppointmentStatus) return;

        setIsLoading(true);
        try {
            await onUpdateAppointmentStatus(
                selectedAppointment.id,
                status,
                selectedAppointment.schedule_id
            );
            setIsCancelOpen(false);
            // Force refresh or update local state
            window.location.reload();
        } catch (error) {
            console.error('Error updating appointment status:', error);
            alert('Failed to update appointment status. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle review submission
    const handleSubmitReview = async () => {
        if (!selectedAppointment || !onSubmitReview || isSubmitting || rating === 0) return;

        setIsSubmitting(true);
        try {
            const reviewData: ReviewData = {
                appointment_id: selectedAppointment.id,
                patient_id: selectedAppointment.patient_id,
                doctor_id: selectedAppointment.doctor_id,
                rating,
                review,
            };

            await onSubmitReview(reviewData);
            setIsReviewOpen(false);
            // Force refresh or update local state
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col h-full">
            {/* Doctor Information Header */}
            <div className="relative">
                <div className="h-40 bg-gray-100">
                    {doctor_image_url ? (
                        <img
                            src={doctor_image_url}
                            alt={doctor_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            <span className="text-lg font-medium">Dr</span>
                        </div>
                    )}
                </div>

                {/* Appointment count badge */}
                <div className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 rounded-full px-2 py-1 shadow-sm">
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">{appointments.length} appointments</span>
                    </div>
                </div>

                {/* Days until badge for upcoming appointments */}
                {!isPast && (
                    <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 shadow-sm">
                        {nextAppointmentDays === 0 ? (
                            <div className="text-red-600 font-medium text-xs">Today</div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-gray-800">{nextAppointmentDays}</span>
                                <span className="text-xs text-gray-500">days until next</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 flex-grow flex flex-col">
                {/* Doctor info */}
                <h3 className="font-medium text-gray-900 text-lg">{doctor_name}</h3>
                <p className="text-sm text-gray-600 mb-3">{doctor_specialization}</p>

                {/* Appointments List */}
                <div className="space-y-2 mb-3 flex-grow">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Calendar size={16} />
                        {isPast ? "Past Appointments" : "Upcoming Appointments"}
                    </h4>

                    <div className="overflow-y-auto max-h-[120px] pr-1">
                        {sortedAppointments.slice(0, 3).map((appointment) => (
                            <div key={appointment.id} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                                <div className="flex-shrink-0 w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center">
                                    {getTypeIcon(appointment.appointment_type)}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <span className="text-sm font-medium text-gray-800 truncate">
                                            {formatDate(appointment.appointment_time)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatTime(appointment.appointment_time)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-600 flex-wrap">
                                        <span className="truncate max-w-[100px]">{appointment.appointment_type}</span>
                                        <span
                                            className={`px-1.5 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Show more link if there are more than 3 appointments */}
                    {appointments.length > 3 && (
                        <button
                            onClick={() => setIsAllAppointmentsOpen(true)}
                            className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
                        >
                            View all {appointments.length} appointments <ChevronRight size={14} />
                        </button>
                    )}
                </div>

                {/* Action buttons - always at the bottom */}
                <div className="pt-3 mt-auto border-t border-gray-100">
                    <div className="flex gap-2">
                       
                        {!isPast && (
                            <Button
                                onClick={handleNavigateToDoctorDetails}
                                className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700">
                                Book Again
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* All Appointments Dialog */}
            <Dialog open={isAllAppointmentsOpen} onOpenChange={setIsAllAppointmentsOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span>Appointments with {doctor_name}</span>
                        </DialogTitle>
                        <DialogDescription>
                            {doctor_specialization} • {appointments.length} appointments
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto pr-1">
                        {sortedAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="mb-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-500" />
                                        <span className="font-medium">{formatDate(appointment.appointment_time)}</span>
                                        <span className="text-sm text-gray-500">{formatTime(appointment.appointment_time)}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    {getTypeIcon(appointment.appointment_type)}
                                    <span className="text-sm text-gray-600">{appointment.appointment_type}</span>
                                    {appointment.appointment_location && (
                                        <>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                                {appointment.appointment_location}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {appointment.reason && (
                                    <div className="mb-3">
                                        <div className="text-xs text-gray-500 mb-1">Reason:</div>
                                        <p className="text-sm text-gray-700">{appointment.reason}</p>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex gap-2 mt-3">
                                    {!isPast && appointment.status !== "Canceled" && appointment.status !== "Completed" && (
                                        <>
                                            {appointment.appointment_type === "Virtual" && appointment.meeting_link ? (
                                                <a
                                                    href={appointment.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs flex items-center justify-center gap-1"
                                                >
                                                    <Video size={14} />
                                                    Join Meeting
                                                </a>
                                            ) : (
                                                <>
                                                 
                                                    <Button
                                                        onClick={() => handleOpenCancel(appointment)}
                                                        className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                        </>
                                    )}

                                 
                                    {/* Mark as completed button for past appointments with Pending or Confirmed status */}
                                    {isPast && (appointment.status === "Pending" || appointment.status === "Confirmed") && (
                                        <Button
                                            onClick={() => {
                                                setSelectedAppointment(appointment);
                                                handleStatusChange("COMPLETED");
                                            }}
                                            className="flex-1 px-3 py-1.5 bg-[#9871ff] text-white hover:bg-[#8a61f9] rounded-md text-xs flex items-center justify-center gap-1"
                                        >
                                            <CheckCircle size={14} />
                                            Mark as completed
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={() => setIsAllAppointmentsOpen(false)}
                            className="px-4 py-2"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Cancel Confirmation Dialog */}
            <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cancel Appointment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this appointment?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCancelOpen(false)} className="mr-2">
                            No, Keep Appointment
                        </Button>
                        <Button
                            onClick={() => handleStatusChange("CANCELED")}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin mr-1" />
                                    Processing...
                                </>
                            ) : (
                                "Yes, Cancel It"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}