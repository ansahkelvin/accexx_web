"use server"

import { cookies } from "next/headers";

interface AuthTokenResult {
    token: string | null;
    userId: string | null;
}

/**
 * Get the authentication token for WebSocket connections
 * @returns Authentication token details
 */
export async function getAuthToken(): Promise<AuthTokenResult> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const userId = cookieStore.get("user_id")?.value;

    return {
        token: accessToken || null,
        userId: userId || null
    };
}