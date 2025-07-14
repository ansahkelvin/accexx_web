export interface User {
    id: string;
    email: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    name?: string;
    fullName?: string;
    phoneNumber?: string;
    isEmailVerified?: boolean;
    dateOfBirth?: string;
    profile_image?: string;
    profilePicture?: string;
    profileImage?: string;
}

export interface Document {
    id: string;
    patient_id: string;
    doctor_id: string | null; // Explicitly nullable
    file_url: string;
    uploaded_at: string; // ISO Date string
    name: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Doctor {
    id: string;
    name: string;
    profile_image: string;
    // New API response structure
    fullName?: string;
    specialization?: string;
    profilePicture?: string;
}

export interface Appointment {
    doctor_id: string;
    patient_id: string;
    appointment_time: string;
    reason: string;
    meeting_link: string;
    appointment_location_latitude: number;
    appointment_location_longitude: number;
    id: string;
    schedule_id: string;
    status: string;
    appointment_type: string;
    appointment_location: string;
}

// New API response structure for upcoming appointments
export interface NewUpcomingAppointment {
    id: string;
    user: {
        id: string;
        fullName: string;
        phoneNumber: string;
    };
    doctor: {
        id: string;
        fullName: string;
        specialization: string;
        profilePicture: string;
    };
    timeSlot: {
        id: string;
        date: string;
        startTime: string;
        endTime: string;
        durationMinutes: number;
    };
    appointmentDateTime: string;
    notes: string;
    status: "CONFIRMED" | "COMPLETED" | "PENDING" | "CANCELLED";
    canCancel: boolean;
}

export interface UpcomingAppointment {
    appointment_id: string;
    appointment_time: string;
    status: string;
    appointment_type: string;
    doctor: Doctor; // Doctor details included
}

export interface DashboardData {
    latest_appointment: (Appointment | NewUpcomingAppointment) | null;
    appointment_count: number;
    file_counts: number;
    upcoming_appointments: (UpcomingAppointment | NewUpcomingAppointment)[]; // Support both old and new API responses
    recent_documents: Document[];
}


export interface MedicalAppointment {
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


export interface Schedule {
    id: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

export interface DoctorDetails {
    id: string;
    name: string;
    work_address: string;
    work_address_longitude: number;
    work_address_latitude: number;
    profile_image: string;
    specialization: string;
    bio: string;
    gmc_number: string;
    role: string;
    email: string;
    phoneNumber?: string;
    isVerified?: boolean;
    availableSlotsCount?: number;
    bookedSlotsCount?: number;
    totalSlotsCount?: number;
    schedule?: Schedule[];
}


export enum AppointmentStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    REJECTED = "rejected"
}

export enum AppointmentType {
    VIRTUAL = "VIRTUAL",
    IN_PERSON = "IN_PERSON"
}

export interface AppointmentRequestData {
    doctor_id: string;
    patient_id: string;
    schedule_id: string;
    appointment_time: Date;
    status?: AppointmentStatus;
    reason: string;
    appointment_type: AppointmentType;
    meeting_link: string;
    appointment_location: string;
    appointment_location_latitude: number;
    appointment_location_longitude: number;
}


// Define types for the API responses
export interface AllDoctor {
    id: string;
    name: string;
    work_address: string;
    work_address_longitude: number;
    work_address_latitude: number;
    profile_image: string;
    specialization: string;
    rating: number;
    rating_count: number;
}

export interface TopDoctor {
    id: string;
    name: string;
    work_address: string;
    work_address_longitude: number;
    work_address_latitude: number;
    profile_image: string;
    specialization: string;
    rating: number;
}

export interface NearbyDoctor {
    id: string;
    name: string;
    specialization: string;
    profile_image: string;
    distance: number;
}



import { ReactNode } from 'react';

export interface NavItem {
    href: string;
    icon: ReactNode;
    label: string;
}

export interface SidebarContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export interface SidebarProps {
    navItems: NavItem[];
}

export interface SidebarProviderProps {
    children: ReactNode;
}

