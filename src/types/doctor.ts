

export interface DoctorSchedules {
    start_time: Date;
    end_time: Date;
    id?: string;
    doctor_id: string;
    is_booked: boolean;
}

export interface IPatients {
    id: string;
    name: string;
    email: string;
    profile_image?: string;
}

export interface DoctorDetails {
    id: string;
    email: string;
    name: string;
    gmc_number: string;
    specialization: string;
    bio: string;
    work_address: string;
    work_address_latitude: number;
    work_address_longitude: number;
    role: string;
    profile_image: string;
    phoneNumber?: string;
}

// New types to match the API response structure
export interface AppointmentUser {
    id: string;
    fullName: string;
    phoneNumber: string;
}

export interface AppointmentDoctor {
    id: string;
    fullName: string;
    specialization: string;
    profilePicture: string;
}

export interface AppointmentTimeSlot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
}

export interface DoctorAppointmentResponse {
    id: string;
    user: AppointmentUser;
    doctor: AppointmentDoctor;
    timeSlot: AppointmentTimeSlot;
    appointmentDateTime: string;
    notes: string;
    status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
    canCancel: boolean;
}

export interface AppointmentStats {
    total_appointments: number;
    confirmed_appointments: number;
    pending_appointments: number;
    canceled_appointments: number;
    completed_appointments: number;
    today_appointments: DoctorAppointmentResponse[];
}

// New types for time slots API
export interface TimeSlotRequest {
    date: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    notes?: string;
}

export interface TimeSlotResponse {
    id: string;
    doctorId: string;
    doctorName: string;
    date: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    status: "AVAILABLE" | "BOOKED" | "CANCELLED";
    isActive: boolean;
    isAvailable: boolean;
    notes?: string;
    startDateTime: string;
    endDateTime: string;
    formattedStartTime: string;
    durationText: string;
}

export interface DoctorWithSlotsResponse {
    doctor: {
        id: string;
        email: string;
        fullName: string;
        specialization: string;
        profilePicture: string;
        bio: string;
        isVerified: boolean;
        latitude: number;
        longitude: number;
        appointmentAddress: string;
        availableSlotsCount: number;
        bookedSlotsCount: number;
        totalSlotsCount: number;
    };
    availableSlots: TimeSlotResponse[];
    totalAvailableSlots: number;
}
