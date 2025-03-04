"use server"

import {cookies} from "next/headers";
import {BASE_URL} from "@/config/config";
import {DashboardData, User} from "@/types/types";



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

export async function fetchUserAppointments(){

    try{
        const cookieStore = await cookies();
        const ACCESS_TOKEN = cookieStore.get("access_token")?.value;
        const USER_ID = cookieStore.get("user_id")?.value;

        const response = await fetch(`${BASE_URL}/users/appointments/${USER_ID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ACCESS_TOKEN}`
            }
        })

        if (!response.ok) {
            return null;
        }


    }
    catch(err){
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