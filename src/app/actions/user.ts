"use server"

import {cookies} from "next/headers";
import {BASE_URL} from "@/config/config";
import {
    AllDoctor, AppointmentRequestData, AppointmentStatus,
    DashboardData,
    MedicalAppointment,
    NearbyDoctor,
    TopDoctor,
    User,
    DoctorDetails
} from "@/types/types";

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
        console.log("API Response for user profile:", userData);
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
            upcoming_appointments: appointments.filter((apt: any) => {
                // Filter for upcoming appointments (not completed and in the future)
                const appointmentDate = new Date(apt.appointmentDateTime);
                const now = new Date();
                return apt.status !== "COMPLETED" && appointmentDate > now;
            }).slice(0, 5),
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
                profile_image: doctor.profilePicture,
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

        // Get user's location from profile or use default London coordinates
        const userProfile = await fetchUserPatientDetails();
        const userLat = userProfile?.latitude || 51.5191327; // Default to London
        const userLng = userProfile?.longitude || -0.146291;
        
        // Fetch nearby doctors using the new endpoint
        const response = await fetch(
            `${BASE_URL}/doctors/public/near-you?latitude=${userLat}&longitude=${userLng}&radiusKm=50`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok) {
            return null;
        }

        const doctors = await response.json();
        
        // Transform to match NearbyDoctor interface
        const nearbyDoctors: NearbyDoctor[] = doctors.map((doctor: any) => ({
            id: doctor.id,
            name: doctor.fullName,
            specialization: doctor.specialization,
            profile_image: doctor.profilePicture,
            distance: doctor.distance || 0 // Assuming the API returns distance
        }));

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
        
        // Transform to match AllDoctor interface with new API structure
        const allDoctors: AllDoctor[] = doctors
            .filter((doctor: any) => doctor.isVerified)
            .map((doctor: any) => ({
                id: doctor.id,
                name: doctor.fullName,
                work_address: doctor.appointmentAddress,
                work_address_longitude: doctor.longitude,
                work_address_latitude: doctor.latitude,
                profile_image: doctor.profilePicture,
                specialization: doctor.specialization,
                rating: doctor.rating || 0,
                rating_count: doctor.rating_count || 0
            }));

        return allDoctors;
    } catch(err) {
        throw err;
    }
}

export async function fetchDoctorDetails(id: string) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            return null;
        }

        const response = await fetch(`${BASE_URL}/doctors/public/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        const doctor = await response.json();
        
        // Transform to match DoctorDetails interface with new API structure
        const doctorDetails: DoctorDetails = {
            id: doctor.id,
            name: doctor.fullName,
            work_address: doctor.appointmentAddress,
            work_address_longitude: doctor.longitude,
            work_address_latitude: doctor.latitude,
            profile_image: doctor.profilePicture,
            specialization: doctor.specialization,
            bio: doctor.bio,
            gmc_number: doctor.gmcNumber || '',
            role: doctor.role || 'Doctor',
            email: doctor.email,
            isVerified: doctor.isVerified,
            availableSlotsCount: doctor.availableSlotsCount,
            bookedSlotsCount: doctor.bookedSlotsCount,
            totalSlotsCount: doctor.totalSlotsCount,
            schedule: doctor.schedule || [] // Provide empty array as fallback
        };

        return doctorDetails;
    } catch(err) {
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

export async function fetchDoctorSchedules(doctorId: string, date?: string) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            return null;
        }

        // If date is provided, get available slots for that specific date
        const endpoint = date 
            ? `${BASE_URL}/time-slots/doctor/${doctorId}/available?date=${date}`
            : `${BASE_URL}/time-slots/doctor/${doctorId}`;

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch doctor schedules:", response.status, response.statusText);
            return null;
        }

        const schedules = await response.json();
        return schedules;
    } catch (error) {
        console.error("Error fetching doctor schedules:", error);
        return null;
    }
}

export async function fetchAvailableTimeSlots(doctorId: string, date: string) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            console.error("No access token found");
            return null;
        }

        const endpoint = `${BASE_URL}/time-slots/doctor/${doctorId}/available?date=${date}`;
        console.log("Fetching available time slots from:", endpoint);

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to fetch available time slots:", response.status, response.statusText, errorText);
            return null;
        }

        const timeSlots = await response.json();
        console.log("Available time slots response:", timeSlots);
        return timeSlots;
    } catch (error) {
        console.error("Error fetching available time slots:", error);
        return null;
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

export async function updateUserProfile(profileData: Partial<User>) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            throw new Error("No access token found");
        }

        console.log("Updating user profile with data:", profileData);

        const response = await fetch(`${BASE_URL}/users/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(profileData),
        });

        console.log("Update profile response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to update profile:", errorData);
            throw new Error(errorData.message || 'Failed to update profile');
        }

        const updatedUser = await response.json();
        console.log("Profile updated successfully:", updatedUser);
        return updatedUser;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}