"use server"

import {cookies} from "next/headers";
import {BASE_URL} from "@/config/config";
import {
    AllDoctor, AppointmentRequestData, AppointmentStatus,
    DashboardData,
    DoctorDetails,
    MedicalAppointment,
    NearbyDoctor,
    TopDoctor,
    User
} from "@/types/types";

export async function fetchUserPatientDetails(){
    try{
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

       if(!accessToken){
           return null;
       }

        const response = await fetch(`${BASE_URL}/users/patient/details`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            cache: "no-store"
        });

        if (!response.ok) {
            return null; // Avoid redirect in server components
        }

        const userData: User = await response.json();
        return userData;


    }catch(err){
        console.log(err);
        throw err;
    }
}

export async function fetchPatientDashboard() {
    try{
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if(!accessToken){
            return null;
        }
        const response = await fetch(`${BASE_URL}/dashboard/patients`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
        if (!response.ok) {
            return null;
        }

        const patient: DashboardData = await response.json();
        return patient;

    }catch(err){
        throw err;
    }
}

export async function fetchPatientAppointment() {
    try{
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if(!accessToken){
            return null;
        }

        const response = await fetch(`${BASE_URL}/appointments/patient`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
        if (!response.ok) {
            return null;
        }
        const appointments: MedicalAppointment[] = await response.json();
        return appointments;
    }catch(err){
        throw err;
    }
}

export async function fetchTopDoctors(): Promise<TopDoctor[] | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if(!accessToken) {
            return null;
        }

        const response = await fetch(`${BASE_URL}/doctors/top`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        // Return doctors with proper type
        return await response.json();
    } catch(err) {
        throw err;
    }
}

export async function fetchNearbyDoctors(): Promise<NearbyDoctor[] | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if(!accessToken) {
            return null;
        }

        const response = await fetch(`${BASE_URL}/doctors/nearby?latitude=51.5191327&longitude=-0.146291&radius=70`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        // Return doctors with proper type
        const data = await response.json();

        return data["nearby_doctors"] as NearbyDoctor[];
    } catch(err) {
        throw err;
    }
}

export async function fetchAllDoctors(): Promise<AllDoctor[] | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if(!accessToken) {
            return null;
        }

        const response = await fetch(`${BASE_URL}/doctors/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        // Return doctors with proper type
        return await response.json();
    } catch(err) {
        throw err;
    }
}

export async function fetchDoctorDetails(id: string) {
    try{
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;
        if(!accessToken) {
            return null;
        }
        const response = await fetch(`${BASE_URL}/doctors/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
        if (!response.ok) {
            return null;
        }
        const res: DoctorDetails = await response.json();
        console.log(res);
        return res;

    }catch (err) {
        throw err;
    }
}




export async function bookAppointment(
    appointmentData: AppointmentRequestData
) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value
        if(!accessToken) {
            return null;
        }
        const user_id = cookieStore.get("user_id")?.value
        const formattedData = {
            doctor_id: appointmentData.doctor_id,
            patient_id: user_id,
            schedule_id: appointmentData.schedule_id,
            appointment_time: appointmentData.appointment_time.toISOString(), // Convert TS Date to ISO string for Python datetime
            status: appointmentData.status || AppointmentStatus.PENDING,
            reason: appointmentData.reason,
            appointment_type: appointmentData.appointment_type,
            meeting_link: appointmentData.meeting_link,
            appointment_location: appointmentData.appointment_location,
            appointment_location_latitude: appointmentData.appointment_location_latitude,
            appointment_location_longitude: appointmentData.appointment_location_longitude
        };

        // Send the request to the backend API
        const response = await fetch(`${BASE_URL}/appointments/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`


            },
            body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to book appointment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error booking appointment:', error);
        throw error;
    }
}