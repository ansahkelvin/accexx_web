import Image from "next/image";
import { UserRound, CalendarCheck, ClipboardList } from 'lucide-react';
import { redirect } from 'next/navigation';
import { login } from '@/actions/auth';
import {JSX} from "react";
import {FormState} from "@/types/auth";
import {LoginForm} from "@/components/auth/login-form";

export default function LoginPage(): JSX.Element {
    async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
        'use server'

        const result = await login(formData);

        if (result.success) {
            redirect('/patients');
        }

        return { error: result.error || 'Login failed' };
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center space-y-2">
                        <div className="flex justify-center">
                            <Image src="/logo.png" alt="logo" width={120} height={120} className="mb-2"/>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome to Accexx 247</h1>
                        <p className="text-gray-500">Your Health, Our Priority</p>
                    </div>

                    <LoginForm action={loginAction} />
                </div>
            </div>

            {/* Right Side - Image and Info */}
            <div className="hidden lg:block w-1/2 bg-[#9871ff] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9871ff]/80 to-[#9871ff]/60 z-10"></div>
                <Image
                    src="/banner.webp"
                    alt="Healthcare"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="relative z-20 p-12 h-full flex flex-col justify-center text-white">
                    <h2 className="text-4xl font-bold mb-6">Your Health Journey Starts Here</h2>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <UserRound className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Expert Doctors</h3>
                                <p className="text-white/80 text-sm">Connect with qualified healthcare professionals</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <CalendarCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Easy Appointments</h3>
                                <p className="text-white/80 text-sm">Book and manage your appointments effortlessly</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <ClipboardList className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Health Records</h3>
                                <p className="text-white/80 text-sm">Access your medical history anytime, anywhere</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}