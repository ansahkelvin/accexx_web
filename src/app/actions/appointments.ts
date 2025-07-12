'use server'

import {BASE_URL} from "@/config/config";
import {cookies} from "next/headers";
import {ReviewData} from "@/components/card/AppointmentCard";

export const createReviewData = async (rawData: ReviewData) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    try {
        const response = await fetch(`${BASE_URL}/reviews`, {
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
        // Map status to the new API format
        let action = '';
        switch (status.toLowerCase()) {
            case 'confirmed':
                action = 'confirm';
                break;
            case 'canceled':
                action = 'cancel';
                break;
            case 'completed':
                action = 'complete';
                break;
            default:
                throw new Error(`Invalid status: ${status}`);
        }

        const response = await fetch(`${BASE_URL}/appointments/${appointmentId}/${action}`, {
            method: 'PUT',
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