"use server"

import {BASE_URL} from "@/config/config";
import {cookies} from "next/headers";
import {DoctorDetails} from "@/types/types";

export interface Appointment {
    id: string;
    schedule_id: string;
    status: "confirmed" | "pending" | "canceled";
    appointment_type: "in_person" | "virtual";
    appointment_location?: string;
    appointment_location_latitude?: number;
    appointment_location_longitude?: number;
    doctor_id: string;
    patient_id: string;
    appointment_time: string; // ISO date format
    reason: string;
    meeting_link?: string;
}

export interface AppointmentStats {
    total_appointments: number;
    confirmed_appointments: number;
    pending_appointments: number;
    canceled_appointments: number;
    today_appointments: Appointment[];
}

export interface DoctorAppointment {
    id: string;
    doctor_id: string;
    patient_id: string;
    schedule_id: string;
    appointment_time: string; // ISO date format
    status: "Confirmed" | "Pending" | "Canceled";
    reason: string;
    appointment_type: "In person" | "Virtual";
    meeting_link?: string;
    appointment_location?: string;
    appointment_location_latitude?: number;
    appointment_location_longitude?: number;
    doctor_name: string;
    doctor_image_url: string;
    doctor_specialization: string;
    patient_name: string;
    patient_image_url: string;
}



export const fetchDoctorDetails = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const endpoint = `${BASE_URL}/users/doctor/details`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
        
    });
    if(!response.ok) {
        return null;
    }
    const user: DoctorDetails = await response.json();
    return user;
}

export const fetchDashboard = async () => {
    const cookieStore = await cookies();
    const accessToken =  cookieStore.get("access_token")?.value;
    const endpoint = `${BASE_URL}/dashboard/doctors`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })
    if(!response.ok) {
        return null;
    }
    const appointmentStats: AppointmentStats = await response.json();
    
    return appointmentStats;
}

export const fetchAppointments = async () => {
    const cookieStore = await cookies();
    const accessToken =  cookieStore.get("access_token")?.value;
    const endpoint = `${BASE_URL}/appointments/doctor`;
    
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })
    
    if(!response.ok) {
        return null;
    }
    const appointments: DoctorAppointment[] = await response.json();
    return appointments;
}