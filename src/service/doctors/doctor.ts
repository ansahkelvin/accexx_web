"use server"

import {BASE_URL} from "@/config/config";
import {cookies} from "next/headers";
import {DoctorDetails, DoctorAppointmentResponse, AppointmentStats, TimeSlotRequest, TimeSlotResponse} from "@/types/doctor";
import {DoctorSchedules, IPatients} from "@/types/doctor";

// Keep the old interfaces for backward compatibility but mark as deprecated
/** @deprecated Use DoctorAppointmentResponse instead */
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
}

/** @deprecated Use DoctorAppointmentResponse instead */
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
        profile_image: doctor.profileImage,
        phoneNumber: doctor.phoneNumber
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
        profileImage: doctor.profile_image,
        phoneNumber: doctor.phoneNumber || "", // Include phone number if available
        password: "" // Include empty password as required by API
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

export const fetchDashboard = async (): Promise<AppointmentStats | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const endpoint = `${BASE_URL}/appointments/doctor`;
    
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        const appointments: DoctorAppointmentResponse[] = await response.json();
        
        // Calculate stats from the actual API response
        const appointmentStats: AppointmentStats = {
            total_appointments: appointments.length,
            confirmed_appointments: appointments.filter(apt => apt.status === 'CONFIRMED').length,
            pending_appointments: appointments.filter(apt => apt.status === 'PENDING').length,
            canceled_appointments: appointments.filter(apt => apt.status === 'CANCELED').length,
            completed_appointments: appointments.filter(apt => apt.status === 'COMPLETED').length,
            today_appointments: appointments.filter(apt => {
                const today = new Date().toDateString();
                const aptDate = new Date(apt.appointmentDateTime).toDateString();
                return aptDate === today;
            })
        };
        
        return appointmentStats;
    } catch (error) {
        console.error("Error fetching dashboard:", error);
        return null;
    }
}

export const fetchAppointments = async (): Promise<DoctorAppointmentResponse[] | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const endpoint = `${BASE_URL}/appointments/doctor`;
    
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            return null;
        }
        
        // Return the appointments directly without transformation
        const appointments: DoctorAppointmentResponse[] = await response.json();
        return appointments;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return null;
    }
}

export const fetchDoctorSchedules = async (): Promise<TimeSlotResponse[] | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    const endpoint = `${BASE_URL}/time-slots/doctor/all`;
    
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            return null;
        }
        
        const timeSlots: TimeSlotResponse[] = await response.json();
        return timeSlots;
    } catch (error) {
        console.error("Error fetching doctor schedules:", error);
        return null;
    }
}

export const createSchedule = async (timeSlotData: TimeSlotRequest): Promise<TimeSlotResponse | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    const endpoint = `${BASE_URL}/time-slots`;
    
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(timeSlotData)
        });
        
        if (!response.ok) {
            console.error("Failed to create time slot:", response.status, response.statusText);
            return null;
        }
        
        const timeSlot: TimeSlotResponse = await response.json();
        return timeSlot;
    } catch (error) {
        console.error("Error creating time slot:", error);
        return null;
    }
}

export const createBatchSchedule = async (timeSlotsData: TimeSlotRequest[]): Promise<TimeSlotResponse[] | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    const endpoint = `${BASE_URL}/time-slots/batch`;
    
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(timeSlotsData)
        });
        
        if (!response.ok) {
            console.error("Failed to create batch time slots:", response.status, response.statusText);
            return null;
        }
        
        const timeSlots: TimeSlotResponse[] = await response.json();
        return timeSlots;
    } catch (error) {
        console.error("Error creating batch time slots:", error);
        return null;
    }
}

export const updateSchedule = async (timeSlotId: string, timeSlotData: Partial<TimeSlotRequest>): Promise<TimeSlotResponse | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    const endpoint = `${BASE_URL}/time-slots/${timeSlotId}`;
    
    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(timeSlotData)
        });
        
        if (!response.ok) {
            console.error("Failed to update time slot:", response.status, response.statusText);
            return null;
        }
        
        const timeSlot: TimeSlotResponse = await response.json();
        return timeSlot;
    } catch (error) {
        console.error("Error updating time slot:", error);
        return null;
    }
}

export const deleteSchedule = async (timeSlotId: string): Promise<boolean> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    const endpoint = `${BASE_URL}/time-slots/${timeSlotId}`;
    
    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error("Error deleting time slot:", error);
        return false;
    }
}

export const fetchUpcomingSchedules = async (): Promise<TimeSlotResponse[] | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    const endpoint = `${BASE_URL}/time-slots/doctor/upcoming`;
    
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            return null;
        }
        
        const timeSlots: TimeSlotResponse[] = await response.json();
        return timeSlots;
    } catch (error) {
        console.error("Error fetching upcoming schedules:", error);
        return null;
    }
}

export const fetchAvailableSlotsForDate = async (date: string): Promise<TimeSlotResponse[] | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    const endpoint = `${BASE_URL}/time-slots/doctor/available?date=${date}`;
    
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            return null;
        }
        
        const timeSlots: TimeSlotResponse[] = await response.json();
        return timeSlots;
    } catch (error) {
        console.error("Error fetching available slots:", error);
        return null;
    }
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

