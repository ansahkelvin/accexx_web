export interface User {
    id: string;
    email: string;
    address: string;
    latitude: number;  // Changed from string to number
    longitude: number; // Changed from string to number
    name: string;
    profile_image: string;
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

export interface UpcomingAppointment {
    appointment_id: string;
    appointment_time: string;
    status: string;
    appointment_type: string;
    doctor: Doctor; // Doctor details included
}

export interface DashboardData {
    latest_appointment: Appointment;
    appointment_count: number;
    file_counts: number;
    upcoming_appointments: UpcomingAppointment[]; // Corrected type to match API response
    recent_documents: Document[];
}
