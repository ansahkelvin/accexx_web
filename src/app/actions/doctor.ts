"use server"

import {cookies} from "next/headers";
import {BASE_URL} from "@/config/config";
import {DoctorDetails} from "@/types/types";

export async function fetchUserDoctor(){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const user_id = cookieStore.get("user_id")?.value;
    
    if (!user_id || !accessToken) {
        throw new Error("Authentication required");
    }
    
    try {
        const response = await fetch(`${BASE_URL}/users/doctor/details`, {
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
        const user = await response.json() as DoctorDetails;
        console.log(user);
        return user;
        
    }catch (e) {
        console.error(e);
    }

}