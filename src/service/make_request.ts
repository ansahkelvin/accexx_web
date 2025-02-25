'use server'

import { cookies } from "next/headers";

// Define result type that properly uses T
type RequestResult<T> = {
    data?: T;
    status: number;
    success: boolean;
    authError?: boolean;
};

export async function makeRequest<T>(
    url: string,
    method: string,
    body?: Record<string, unknown>
):  Promise<RequestResult<T>>  {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // Initial request with token if available
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken ? `Bearer ${accessToken}` : ""
        },
        body: body ? JSON.stringify(body) : undefined
    });

    // If unauthorized, call your API route to handle token refresh
    if (response.status === 401) {
        const refreshResponse = await fetch('http://localhost:3000/api/auth/refresh', {
            method: 'POST',
        });

        if (!refreshResponse.ok) {
            return {
                status: 401,
                success: false,
                authError: true
            };
        }

        // Get the new token from the cookie (already set by the API route)
        const newAccessToken =  (await cookies()).get("access_token")?.value;

        // Retry with new token
        const newResponse = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${newAccessToken}`
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!newResponse.ok) {
            return {
                status: newResponse.status,
                success: false
            };
        }

        return {
            data: await newResponse.json(),
            status: newResponse.status,
            success: true
        };
    }

    if (!response.ok) {
        return {
            status: response.status,
            success: false
        };
    }

    const data = await response.json();
    return {
        data: data as T,
        status: response.status,
        success: true
    };
}