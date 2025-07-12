import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BASE_URL } from "@/config/config";

export async function POST() {
    const cookieStore = await cookies(); // FIXED: cookies() is now awaited
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refreshToken })
        });

        if (!res.ok) {
            const response = NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
            response.cookies.set("access_token", "", { maxAge: -1 });
            response.cookies.set("refresh_token", "", { maxAge: -1 });
            response.cookies.set("user_role", "", { maxAge: -1 });
            response.cookies.set("user_id", "", { maxAge: -1 });
            return response;
        }

        const data = await res.json();
        const response = NextResponse.json({ success: true });

        response.cookies.set("access_token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        response.cookies.set("refresh_token", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        response.cookies.set("user_id", data.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        // Map backend roles to frontend roles
        const frontendRole = data.role === 'USER' ? 'patient' : 'doctor';
        response.cookies.set("user_role", frontendRole, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return response;
    } catch (error) {
        console.error("Token refresh error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
