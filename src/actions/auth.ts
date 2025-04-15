"use server"
import { cookies } from 'next/headers';
import {BASE_URL} from "@/config/config";
import {redirect} from "next/navigation";

interface AuthResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    user_role: "doctor" | "patient"; // Explicit role types
    user_id: string;
}

export async function login(formData: FormData) {
    try {
        // Add username field from email
        formData.append('username', formData.get('email') as string);
        formData.delete('email');

        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Login failed');
        }

        const data: AuthResponse = await res.json();
        const isProduction = process.env.NODE_ENV === "production";


        // Set secure HTTP-only cookies
        const cookieStore = await cookies();
        cookieStore.set('access_token', data.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        cookieStore.set('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        cookieStore.set('user_id', data.user_id, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        cookieStore.set('user_role', data.user_role, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return { success: true, data };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}


export async function logoutAction() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    try {
        // Call backend to invalidate the token
        const res = await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken?.value}`,
            },
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        // Clear all auth-related cookies
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        cookieStore.delete('user_role');
        cookieStore.delete('user_id');

        redirect('/login');
    }
}

export async function registerPatient(formData: FormData) {
    try {
        
        const response = await fetch(`${BASE_URL}/auth/patient/register`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("Registration failed:", response.status, errorData);
            throw new Error(errorData?.detail || `Registration failed with status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function registerDoctor(formData: FormData) {
    try{
        const response = await fetch(`${BASE_URL}/auth/doctor/register`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("Registration failed:", response.status, errorData);
            throw new Error(errorData?.detail || `Registration failed with status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.log(error);
        throw error;
    }
}