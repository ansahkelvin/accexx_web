'use client';

import {JSX, useActionState} from 'react';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import {FormState} from "@/types/auth";
import SubmitButton from "@/components/ui/submit-button";


interface LoginFormProps {
    action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

export function LoginForm({ action }: LoginFormProps): JSX.Element {
    const [state, formAction] = useActionState<FormState, FormData>(action, { error: null });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <form action={formAction} className="space-y-6 mt-8">
            {state?.error && (
                <div className="p-4 text-sm rounded-lg bg-red-50 text-red-600">
                    {state.error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                </a>
            </div>

            <SubmitButton />

            <p className="text-center text-sm text-gray-600">
                Don&#39;t have an account?{' '}
                <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up
                </a>
            </p>
        </form>
    );
}