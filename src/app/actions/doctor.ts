"use server"

import {cookies} from "next/headers";
import {BASE_URL} from "@/config/config";
import {DoctorDetails} from "@/types/doctor";

export async function fetchUserDoctor(){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const user_id = cookieStore.get("user_id")?.value;
    
    if (!user_id || !accessToken) {
        throw new Error("Authentication required");
    }
    
    try {
        const response = await fetch(`${BASE_URL}/doctors/profile`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            }
        })
        if (!response.ok) {
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
        
        console.log(user);
        return user;
        
    }catch (e) {
        console.error(e);
    }
}