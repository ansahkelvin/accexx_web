import { RequestCookies, ResponseCookies } from "next/dist/server/web/spec-extension/cookies";

type CookieStoreType = RequestCookies | ResponseCookies;

type CookieData = {
    access_token?: string;
    refresh_token?: string;
    user_id?: string;
    user_role?: string;
    [key: string]: string | undefined;
};

export function setCookies(cookieStore: CookieStoreType, data: CookieData): void {
    // Cookie configuration mapping
    const cookieConfig: Record<string, { maxAge: number }> = {
        'access_token': { maxAge: 60 * 60 * 24 }, // 24 hours
        'refresh_token': { maxAge: 60 * 60 * 24 * 30 }, // 30 days
        'user_id': { maxAge: 60 * 60 * 24 * 30 }, // 30 days
        'user_role': { maxAge: 60 * 60 * 24 * 30 }, // 30 days
    };

    // Common options for all cookies
    const commonOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
    };

    // Set each cookie if the data contains it
    Object.keys(cookieConfig).forEach(key => {
        if (data[key]) {
            cookieStore.set(key, data[key], {
                ...commonOptions,
                maxAge: cookieConfig[key].maxAge,
            });
        }
    });
}