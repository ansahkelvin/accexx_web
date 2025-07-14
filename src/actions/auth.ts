"use server"
import { cookies } from 'next/headers';
import {BASE_URL} from "@/config/config";
import {redirect} from "next/navigation";

interface AuthResponse {
    token: string;
    refreshToken: string;
    type: string;
    id: string;
    email: string;
    fullName: string;
    role: "USER" | "DOCTOR" | "ADMIN";
}

export async function login(formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        console.log('Login attempt:', { email, BASE_URL });

        // Try both endpoints to determine user type
        let loginEndpoint = '/auth/user/login';
        let response;

        // First try user login
        try {
            console.log('Trying user login at:', `${BASE_URL}${loginEndpoint}`);
            response = await fetch(`${BASE_URL}${loginEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'Accexx-Frontend/1.0',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
                cache: 'no-store',
            });

            console.log('User login response status:', response.status);

            if (!response.ok) {
                // If user login fails, try doctor login
                loginEndpoint = '/auth/doctor/login';
                console.log('Trying doctor login at:', `${BASE_URL}${loginEndpoint}`);
                response = await fetch(`${BASE_URL}${loginEndpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'User-Agent': 'Accexx-Frontend/1.0',
                    },
                    body: JSON.stringify({
                        email,
                        password
                    }),
                    cache: 'no-store',
                });
                console.log('Doctor login response status:', response.status);
            }
        } catch (error) {
            console.error('Network error during login:', error);
            throw new Error(`Network error during login: ${error}`);
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Login failed:', response.status, response.statusText, errorText);
            
            let errorMessage = 'Login failed';
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch (e) {
                errorMessage = errorText || `Login failed with status: ${response.status}`;
            }
            
            throw new Error(errorMessage);
        }

        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        let data: AuthResponse;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error('Invalid response format from server');
        }

        console.log('Login successful:', { email: data.email, role: data.role });

        const isProduction = process.env.NODE_ENV === "production";

        // Set secure HTTP-only cookies
        const cookieStore = await cookies();
        cookieStore.set('access_token', data.token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        cookieStore.set('refresh_token', data.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        cookieStore.set('user_id', data.id, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        
        // Map backend roles to frontend roles
        const frontendRole = data.role === 'USER' ? 'patient' : 'doctor';
        cookieStore.set('user_role', frontendRole, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return { success: true, data: { ...data, user_role: frontendRole } };
    } catch (error) {
        console.error('Login error:', error);
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
            throw new Error(error.message || 'Logout failed');
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
        const userData = {
            fullName: formData.get('fullName') as string,
            email: formData.get('email') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            password: formData.get('password') as string,
            address: formData.get('address') as string,
            dateOfBirth: formData.get('dateOfBirth') as string,
        };
        
        const response = await fetch(`${BASE_URL}/auth/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Registration failed:", response.status, errorText);
            throw new Error(`Registration failed: ${errorText}`);
        }

        // Handle text response instead of JSON
        const responseText = await response.text();
        console.log('Registration successful:', responseText);
        
        return { success: true, message: responseText };

    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function registerDoctor(formData: FormData) {
    try {
        // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
        const response = await fetch(`${BASE_URL}/auth/doctor/register`, {
            method: 'POST',
            body: formData, // Send FormData directly for multipart/form-data
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Registration failed:", response.status, errorText);
            throw new Error(`Registration failed: ${errorText}`);
        }

        // Handle text response instead of JSON
        const responseText = await response.text();
        console.log('Doctor registration successful:', responseText);
        
        return { success: true, message: responseText };

    } catch (error) {
        console.error('Doctor registration error:', error);
        throw error;
    }
}