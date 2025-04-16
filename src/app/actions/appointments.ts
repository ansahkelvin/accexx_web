'use server'

import {BASE_URL} from "@/config/config";
import {cookies} from "next/headers";
import {ReviewData} from "@/components/card/AppointmentCard";


export const createReviewData = async (rawData: ReviewData) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    try {
        const response = await fetch(`${BASE_URL}/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(rawData),
        });

        if (!response.ok) {
            console.error("Failed to submit review:", response.status, response.statusText);
            return { success: false, error: `HTTP error: ${response.status}` };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (err) {
        console.error("Error submitting review:", err);
        return { success: false, error: String(err) };
    }
}

export const updateAppointmentStatus = async (appointmentId: string, status: string, scheduleId: string) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    try {
        // Using query parameter instead of body since the backend expects it as a query parameter
        const response = await fetch(`${BASE_URL}/appointments/${appointmentId}/status?appointment_status=${status}&schedule_id=${scheduleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to update appointment status:", response.status, response.statusText);
            return { ok: false, error: `HTTP error: ${response.status}` };
        }

        const data = await response.json();
        return { ok: true, data };
    } catch (err) {
        console.error("Error updating appointment status:", err);
        return { ok: false, error: String(err) };
    }
}