export interface LoginResponse {
    success: boolean;
    error?: string;
    data?: {
        access_token: string;
        token_type: string;
        refresh_token: string;
        user_role: string;
        user_id: string;
    };
}

export interface FormState {
    error: string | null;
}