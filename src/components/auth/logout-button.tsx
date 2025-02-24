'use client'

import { LogOut } from 'lucide-react';
import { useTransition } from 'react';
import { logoutAction } from '@/actions/auth';

interface LogoutButtonProps {
    variant?: 'icon' | 'full';
    className?: string;
}

export function LogoutButton({ variant = 'full', className = '' }: LogoutButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleLogout = async () => {
        startTransition(() => {
            logoutAction();
        });
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleLogout}
                disabled={isPending}
                className={`p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                aria-label="Logout"
            >
                {isPending ? (
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <LogOut className="w-5 h-5" />
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {isPending ? (
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            ) : (
                <LogOut className="w-5 h-5" />
            )}
            <span>Logout</span>
        </button>
    );
}