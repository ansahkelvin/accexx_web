"use server"

import {cookies} from "next/headers";
import {BASE_URL} from "@/config/config";
import {
    AllDoctor, AppointmentRequestData, AppointmentStatus,
    DashboardData,
    MedicalAppointment,
    NearbyDoctor,
    TopDoctor,
    User
} from "@/types/types";
import { DoctorDetails } from "@/types/doctor";

export async function fetchUserPatientDetails(){
    try{
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

       if(!accessToken){
           return null;
       }

        const response = await fetch(`${BASE_URL}/users/profile`, {
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
        const response = await fetch(`${BASE_URL}/appointments/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
        if (!response.ok) {
            return null;
        }

        const appointments = await response.json();
        // Transform the response to match DashboardData interface
        const patient: DashboardData = {
            latest_appointment: appointments[0] || null,
            appointment_count: appointments.length,
            file_counts: 0, // This would need to come from documents endpoint
            upcoming_appointments: appointments.filter((apt: any) => 
                new Date(apt.appointmentDateTime) > new Date()
            ).slice(0, 5),
            recent_documents: [] // This would need to come from documents endpoint
        };
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

        const response = await fetch(`${BASE_URL}/appointments/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
        if (!response.ok) {
            return null;
        }
        const appointments = await response.json();
        // Transform the response to match MedicalAppointment interface
        const medicalAppointments: MedicalAppointment[] = appointments.map((apt: any) => ({
            id: apt.id,
            doctor_id: apt.doctor.id,
            patient_id: apt.user.id,
            schedule_id: apt.timeSlot.id,
            appointment_time: apt.appointmentDateTime,
            status: apt.status,
            reason: apt.notes || '',
            appointment_type: apt.timeSlot.isVirtual ? 'Virtual' : 'In person',
            meeting_link: apt.timeSlot.meetingLink || '',
            appointment_location: apt.timeSlot.location || '',
            appointment_location_latitude: apt.timeSlot.latitude || 0,
            appointment_location_longitude: apt.timeSlot.longitude || 0,
            doctor_name: apt.doctor.fullName,
            doctor_image_url: apt.doctor.profileImage,
            doctor_specialization: apt.doctor.specialization,
            patient_name: apt.user.fullName,
            patient_image_url: apt.user.profileImage,
            has_review: false // This would need to come from reviews endpoint
        }));
        return medicalAppointments;
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

        const response = await fetch(`${BASE_URL}/doctors/public/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        const doctors = await response.json();
        // Filter and transform to get top doctors (you might want to add rating logic)
        const topDoctors: TopDoctor[] = doctors
            .filter((doctor: any) => doctor.isVerified)
            .slice(0, 10)
            .map((doctor: any) => ({
                id: doctor.id,
                name: doctor.fullName,
                work_address: doctor.appointmentAddress,
                work_address_longitude: doctor.longitude,
                work_address_latitude: doctor.latitude,
                profile_image: doctor.profileImage,
                specialization: doctor.specialization,
                rating: doctor.rating || 0
            }));

        return topDoctors;
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

        // Get all doctors and filter by distance
        const response = await fetch(`${BASE_URL}/doctors/public/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        const doctors = await response.json();
        
        // Calculate distance from London coordinates (you might want to get user's location)
        const userLat = 51.5191327;
        const userLng = -0.146291;
        
        const nearbyDoctors: NearbyDoctor[] = doctors
            .filter((doctor: any) => doctor.isVerified)
            .map((doctor: any) => {
                const distance = calculateDistance(
                    userLat, userLng,
                    doctor.latitude, doctor.longitude
                );
                return {
                    id: doctor.id,
                    name: doctor.fullName,
                    specialization: doctor.specialization,
                    profile_image: doctor.profileImage,
                    distance: distance
                };
            })
            .filter((doctor: NearbyDoctor) => doctor.distance <= 70) // Within 70km
            .sort((a: NearbyDoctor, b: NearbyDoctor) => a.distance - b.distance)
            .slice(0, 10);

        return nearbyDoctors;
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

        const response = await fetch(`${BASE_URL}/doctors/public/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        const doctors = await response.json();
        const allDoctors: AllDoctor[] = doctors
            .filter((doctor: any) => doctor.isVerified)
            .map((doctor: any) => ({
                id: doctor.id,
                name: doctor.fullName,
                work_address: doctor.appointmentAddress,
                work_address_longitude: doctor.longitude,
                work_address_latitude: doctor.latitude,
                profile_image: doctor.profileImage,
                specialization: doctor.specialization,
                rating: doctor.rating || 0,
                rating_count: doctor.ratingCount || 0
            }));

        return allDoctors;
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
        const doctor = await response.json();
        
        // Transform to match DoctorDetails interface
        const doctorDetails: DoctorDetails = {
            id: doctor.id,
            name: doctor.fullName,
            work_address: doctor.appointmentAddress,
            work_address_longitude: doctor.longitude,
            work_address_latitude: doctor.latitude,
            profile_image: doctor.profileImage,
            specialization: doctor.specialization,
            bio: doctor.bio,
            gmc_number: doctor.gmcNumber,
            role: doctor.role,
            email: doctor.email
        };
        
        console.log(doctorDetails);
        return doctorDetails;

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
        
        const formattedData = {
            doctorId: appointmentData.doctor_id,
            timeSlotId: appointmentData.schedule_id,
            notes: appointmentData.reason
        };

        // Send the request to the backend API
        const response = await fetch(`${BASE_URL}/appointments/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to book appointment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error booking appointment:', error);
        throw error;
    }
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
}