"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, UserRound, CalendarCheck, ClipboardList } from 'lucide-react'
import Image from "next/image";


interface LoginResponse {
    user: {
        id: string
        email: string
        name: string
        role: string
        avatar: string
        patient: {
            id: string
            userId: string
            address: string
            latitude: number
            longitude: number
            medicalHistory: string | null
            createdAt: string
            updatedAt: string
        }
    }
    accessToken: string
    refreshToken: string
}

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const formData = new FormData(e.currentTarget)
            const email = formData.get('email')
            const password = formData.get('password')

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Login failed')
            }

            const data: LoginResponse = await res.json()

            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)

            router.push('/dashboard')

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        } finally {
            setLoading(false)
        }
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

                    {error && (
                        <div className="p-4 text-sm rounded-lg bg-red-50 text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6 mt-8">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#9871ff] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Don&#39;t have an account?{' '}
                            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </a>
                        </p>
                    </form>
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
    )
}