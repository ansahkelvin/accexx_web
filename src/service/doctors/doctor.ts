"use server"

import {BASE_URL} from "@/config/config";
import {cookies} from "next/headers";
import {DoctorDetails} from "@/types/doctor";
import {DoctorSchedules, IPatients} from "@/types/doctor";

export interface Appointment {
    id: string;
    timeSlotId: string;
    status: "CONFIRMED" | "PENDING" | "CANCELED" | "COMPLETED";
    appointmentType: "IN_PERSON" | "VIRTUAL";
    appointmentLocation?: string;
    appointmentLocationLatitude?: number;
    appointmentLocationLongitude?: number;
    doctorId: string;
    userId: string;
    appointmentDateTime: string; // ISO date format
    notes: string;
    meetingLink?: string;
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
    doctorId: string;
    userId: string;
    timeSlotId: string;
    appointmentDateTime: string; // ISO date format
    status: "CONFIRMED" | "PENDING" | "CANCELED" | "COMPLETED";
    notes: string;
    appointmentType: "IN_PERSON" | "VIRTUAL";
    meetingLink?: string;
    appointmentLocation?: string;
    appointmentLocationLatitude?: number;
    appointmentLocationLongitude?: number;
    doctorName: string;
    doctorImageUrl: string;
    doctorSpecialization: string;
    patientName: string;
    patientImageUrl: string;
}

export const fetchDoctorDetails = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const endpoint = `${BASE_URL}/doctors/profile`;
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
    const doctor = await response.json();
    
    // Transform to match DoctorDetails interface
    const user: DoctorDetails = {
        id: doctor.id,
        name: doctor.fullName,
        email: doctor.email,
        gmc_number: doctor.gmcNumber,
        specialization: doctor.specialization,
        bio: doctor.bio,
        work_address: doctor.appointmentAddress,
        work_address_latitude: doctor.latitude,
        work_address_longitude: doctor.longitude,
        role: doctor.role,
        profile_image: doctor.profileImage
    };
    
    return user;
}

export const editDoctorDetails = async (doctor: DoctorDetails, imageFile?: File) => {
    // Get Access to the cookie store
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        console.error("No access token found");
        return null;
    }

    // Create the request body for JSON
    const requestBody = {
        fullName: doctor.name,
        email: doctor.email,
        address: doctor.work_address,
        appointmentAddress: doctor.work_address,
        latitude: doctor.work_address_latitude,
        longitude: doctor.work_address_longitude,
        bio: doctor.bio,
        specialization: doctor.specialization,
        gmcNumber: doctor.gmc_number,
        profileImage: doctor.profile_image
    };

    const endpoint = `${BASE_URL}/doctors/profile`;

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("Failed to update doctor details:", response.status, response.statusText, errorData);
            return null;
        }

        // Return the updated doctor data
        return await response.json();
    } catch (error) {
        console.error("Error updating doctor details:", error);
        return null;
    }
}

export const fetchDashboard = async () => {
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
    const appointments = await response.json();
    
    // Transform appointments to match AppointmentStats interface
    const appointmentStats: AppointmentStats = {
        total_appointments: appointments.length,
        confirmed_appointments: appointments.filter((apt: any) => apt.status === 'CONFIRMED').length,
        pending_appointments: appointments.filter((apt: any) => apt.status === 'PENDING').length,
        canceled_appointments: appointments.filter((apt: any) => apt.status === 'CANCELED').length,
        today_appointments: appointments.filter((apt: any) => {
            const today = new Date().toDateString();
            const aptDate = new Date(apt.appointmentDateTime).toDateString();
            return aptDate === today;
        })
    };
    
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
    const appointments = await response.json();
    
    // Transform to match DoctorAppointment interface
    const doctorAppointments: DoctorAppointment[] = appointments.map((apt: any) => ({
        id: apt.id,
        doctorId: apt.doctor.id,
        userId: apt.user.id,
        timeSlotId: apt.timeSlot.id,
        appointmentDateTime: apt.appointmentDateTime,
        status: apt.status,
        notes: apt.notes || '',
        appointmentType: apt.timeSlot.isVirtual ? 'VIRTUAL' : 'IN_PERSON',
        meetingLink: apt.timeSlot.meetingLink,
        appointmentLocation: apt.timeSlot.location,
        appointmentLocationLatitude: apt.timeSlot.latitude,
        appointmentLocationLongitude: apt.timeSlot.longitude,
        doctorName: apt.doctor.fullName,
        doctorImageUrl: apt.doctor.profileImage,
        doctorSpecialization: apt.doctor.specialization,
        patientName: apt.user.fullName,
        patientImageUrl: apt.user.profileImage
    }));
    
    return doctorAppointments;
}

export const fetchDoctorSchedules = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    const endpoint = `${BASE_URL}/time-slots`;
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
    
    const timeSlots = await response.json();
    
    // Transform to match DoctorSchedules interface
    const schedules: DoctorSchedules[] = timeSlots.map((slot: any) => ({
        id: slot.id,
        doctor_id: slot.doctorId,
        start_time: new Date(slot.date + 'T' + slot.startTime),
        end_time: new Date(slot.date + 'T' + slot.startTime + ' +' + slot.durationMinutes + ' minutes'),
        is_booked: slot.isBooked
    }));
    
    return schedules;
}

export const createSchedule = async (schedule: DoctorSchedules) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    // Transform DoctorSchedules to match the new API format
    const timeSlotData = {
        date: schedule.start_time.toISOString().split('T')[0],
        startTime: schedule.start_time.toTimeString().split(' ')[0].substring(0, 5),
        durationMinutes: Math.round((schedule.end_time.getTime() - schedule.start_time.getTime()) / (1000 * 60)),
        notes: ''
    };
    
    const endpoint = `${BASE_URL}/time-slots`;
    const response = await fetch(endpoint, {
        body: JSON.stringify(timeSlotData),
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })
    if(!response.ok) {
        return null;
    }
    return response.json();
}

export const updateSchedule = async (schedule: DoctorSchedules) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    // Transform DoctorSchedules to match the new API format
    const timeSlotData = {
        date: schedule.start_time.toISOString().split('T')[0],
        startTime: schedule.start_time.toTimeString().split(' ')[0].substring(0, 5),
        durationMinutes: Math.round((schedule.end_time.getTime() - schedule.start_time.getTime()) / (1000 * 60)),
        notes: ''
    };
    
    const endpoint = `${BASE_URL}/time-slots/${schedule.id}`;
    const response = await fetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(timeSlotData),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })
    
    if (!response.ok) {
        return null;
    }
    
    return response.json();
}

export const deleteSchedule = async (schedule: DoctorSchedules) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    console.log(schedule)
    const endpoint = `${BASE_URL}/time-slots/${schedule.id}`;
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })
    if(response.status !== 204) {
        return null;
    }
    return "Deleted successfully.";
}

export const fetchDoctorPatient = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
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
    const appointments = await response.json();
    
    // Extract unique patients from appointments
    const uniquePatients = new Map();
    appointments.forEach((apt: any) => {
        if (!uniquePatients.has(apt.user.id)) {
            uniquePatients.set(apt.user.id, {
                id: apt.user.id,
                name: apt.user.fullName,
                email: apt.user.email,
                profile_image: apt.user.profileImage
            });
        }
    });
    
    const patients: IPatients[] = Array.from(uniquePatients.values());
    return patients;
}

