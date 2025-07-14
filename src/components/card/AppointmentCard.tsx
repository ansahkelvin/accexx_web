import { Home, MapPin, Video, Star, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createReviewData, updateAppointmentStatus } from "@/app/actions/appointments";
import { toast } from "@/hooks/use-toast";

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

export interface ReviewData {
    appointment_id: string;
    patient_id: string;
    doctor_id: string;
    rating: number;
    review: string;
}

export default function AppointmentCard({
                                            appointment,
                                            formatDate,
                                            formatTime,
                                            getDaysUntil,
                                            isPast = false,
                                        }: {
    appointment: Appointment;
    formatDate: (date: string) => string;
    formatTime: (date: string) => string;
    getDaysUntil: (date: string) => number;
    isPast?: boolean;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const daysUntil = getDaysUntil(appointment.appointment_time);

    // Get appropriate icon for appointment type
    const getTypeIcon = () => {
        switch (appointment.appointment_type) {
            case "Virtual":
                return <Video size={16} className="text-blue-500" />;
            case "Home visit":
                return <Home size={16} className="text-green-500" />;
            default:
                return <MapPin size={16} className="text-red-500" />;
        }
    };

    // Mark appointment as completed
    const changeAppointmentStatus = async (status: string) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            console.log("Updating appointment status:", appointment.id, status);
            const response = await updateAppointmentStatus(appointment.id, status, appointment.schedule_id);
            console.log("Update appointment status response:", response);

            if (!response.ok) {
                console.error("Update appointment status failed:", response.error);
                throw new Error(response.error || "Failed to update appointment status");
            }

            console.log("Appointment status updated successfully");
            // Force a hard refresh to ensure data is updated
            window.location.href = "/patients/appointments";
        } catch (error) {
            console.error("Error updating appointment status:", error);
            alert("Failed to update appointment status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    // Handle review submission
    const handleSubmitReview = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const reviewData: ReviewData = {
                appointment_id: appointment.id,
                patient_id: appointment.patient_id,
                doctor_id: appointment.doctor_id,
                rating,
                review,
            };

            const response = await createReviewData(reviewData);

            if (!response.success) {
                throw new Error("Failed to submit review");
            }

            setIsReviewOpen(false);
            setRating(0);
            setReview("");

            // Force a hard refresh to ensure data is updated
            window.location.href = "/patients/appointments";
            alert("Thank you for your review!");
        } catch (error) {
            console.error(error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div
                className={`
        bg-white rounded-lg overflow-hidden shadow-sm border transition-all h-full
        ${isPast ? "border-gray-100 opacity-80" : "border-gray-200 hover:shadow-md"}
      `}
            >
                <div className="relative">
                    <div className="h-32 bg-gray-100">
                        {appointment.doctor_image_url ? (
                            <img
                                src={appointment.doctor_image_url}
                                alt={appointment.doctor_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                <span className="text-lg font-medium">Dr</span>
                            </div>
                        )}
                    </div>

                    {/* Days until badge */}
                    {!isPast && (
                        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 shadow-sm">
                            {daysUntil === 0 ? (
                                <div className="text-red-600 font-medium text-xs">Today</div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-bold text-gray-800">{daysUntil}</span>
                                    <span className="text-xs text-gray-500">days</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute bottom-3 right-3">
            <span
                className={`text-xs px-2 py-0.5 rounded-full bg-opacity-90 ${
                    appointment.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : appointment.status === "Canceled"
                                ? "bg-red-100 text-red-700"
                                : appointment.status === "Completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                }`}
            >
              {appointment.status}
            </span>
                    </div>
                </div>

                <div className="p-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <span>{formatDate(appointment.appointment_time)}</span>
                        <span>•</span>
                        <span>{formatTime(appointment.appointment_time)}</span>
                    </div>

                    {/* Doctor info */}
                    <h3 className="font-medium text-gray-900 truncate">{appointment.doctor_name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{appointment.doctor_specialization}</p>

                    {/* Type */}
                    <div className="flex items-center gap-1.5 mb-3">
                        {getTypeIcon()}
                        <span className="text-xs text-gray-600">{appointment.appointment_type}</span>
                    </div>

                    {/* Action buttons */}
                    {!isPast &&
                        appointment.status !== "Canceled" &&
                        appointment.status !== "Completed" &&
                        (appointment.appointment_type === "Virtual" && appointment.meeting_link ? (
                            <a
                                href={appointment.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs flex items-center justify-center gap-1"
                            >
                                <Video size={14} />
                                Join Meeting
                            </a>
                        ) : (
                            <Button
                                onClick={() => setIsCancelOpen(true)}
                                className="w-full px-3 py-1.5 bg-red-600 rounded-md hover:bg-indigo-100 text-xs"
                            >
                                Cancel
                            </Button>
                        ))}

                    {/* Review button for past appointments with Completed status */}
                    {isPast && appointment.status === "Completed" && !appointment.has_review && (
                        <Button
                            onClick={() => setIsReviewOpen(true)}
                            className="w-full px-3 py-1.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-md text-xs flex items-center justify-center gap-1"
                        >
                            <Star size={14} />
                            Leave a Review
                        </Button>
                    )}

                    {/* Already reviewed indicator */}
                    {isPast && appointment.status === "Completed" && appointment.has_review && (
                        <div className="w-full px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs flex items-center justify-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            Review Submitted
                        </div>
                    )}

                    {/* Mark as completed button for past appointments with Pending or Confirmed status */}
                    {isPast &&
                        (appointment.status === "Pending" || appointment.status === "Confirmed") && (
                            <Button
                                onClick={() => changeAppointmentStatus("COMPLETED")}
                                disabled={isLoading}
                                className="w-full px-3 py-1.5 bg-[#9871ff] text-white hover:bg-[#8a61f9] rounded-md text-xs flex items-center justify-center gap-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin mr-1" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={14} />
                                        Mark as completed
                                    </>
                                )}
                            </Button>
                        )}
                </div>
            </div>

            {/* Review Dialog */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rate your experience with Dr. {appointment.doctor_name}</DialogTitle>
                        <DialogDescription>
                            Your feedback helps other patients find the right care.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {/* Star Rating */}
                        <div className="flex justify-center mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1"
                                >
                                    <Star
                                        size={32}
                                        className={`transition-colors ${
                                            star <= (hoverRating || rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Review Text */}
                        <Textarea
                            placeholder="Share your experience with the doctor..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="w-full min-h-24"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsReviewOpen(false)}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitReview}
                            disabled={isSubmitting || rating === 0}
                            className={`${
                                rating === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                            } text-white`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin mr-1" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Review"
                            )}
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
                            onClick={async () => {
                                try {
                                    await changeAppointmentStatus("CANCELED");
                                    setIsCancelOpen(false);
                                } catch (error: any) {
                                    const backendMsg = error?.message || error?.toString() || "Failed to cancel appointment.";
                                    toast({ title: "Unable to cancel appointment", description: backendMsg, variant: "destructive" });
                                }
                            }}
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
        </>
    );
}