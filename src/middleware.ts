import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/forgot-password', '/services', '/about', '/for-doctors', '/faq', '/contact', "/"];

export function middleware(request: NextRequest) {

    const accessToken = request.cookies.get('access_token');
    const userRole = request.cookies.get('user_role');
    const { pathname } = request.nextUrl;

    // Allow access to public routes
    if (publicRoutes.includes(pathname)) {
        // If user is already authenticated, redirect to their role-specific dashboard
        if (accessToken) {
            const redirectPath = userRole?.value === 'doctor' ? '/doctor' : '/patients';
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
        return NextResponse.next();
    }

    if (!accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based route protection
    if (userRole?.value === 'doctor' && !pathname.startsWith('/doctor')) {
        return NextResponse.redirect(new URL('/doctor', request.url));
    }

    if (userRole?.value === 'patient' && !pathname.startsWith('/patients')) {
        return NextResponse.redirect(new URL('/patients', request.url));
    }
    return NextResponse.next();

}

export const config = {
    matcher: [
        /*
         * Match all routes except:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        '/((?!api|_next|_static|.*\\..*|/).*)',
        '/',
    ],
};
