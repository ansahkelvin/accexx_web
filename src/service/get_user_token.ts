"use server"

import {cookies} from "next/headers";

/**
 * Get the authentication token for WebSocket connections
 * @returns {Promise<{token: string|null, userId: string|null}>}
 */
export async function getAuthToken() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const userId = cookieStore.get("user_id")?.value;

    return {
        token: accessToken || null,
        userId: userId || null
    };
}