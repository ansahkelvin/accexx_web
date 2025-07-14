'use client';

import React, { useState } from 'react';
import { User, Phone, MapPin, Lock, Heart, Users, Activity, Shield, Mail, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerPatient } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegistrationFormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    address: string;
    dateOfBirth: string;
}

const RegistrationPage: React.FC = () => {
    const [formData, setFormData] = useState<RegistrationFormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        address: '',
        dateOfBirth: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const router = useRouter();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        // At least 8 characters with uppercase, lowercase, number and special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validatePhoneNumber = (phone: string): boolean => {
        // Basic phone validation - allows + and digits
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!validatePhoneNumber(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number and special character';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        } else {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 0 || age > 120) {
                newErrors.dateOfBirth = 'Please enter a valid date of birth';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData object to match the existing registerPatient function
            const submitFormData = new FormData();
            submitFormData.append('fullName', formData.fullName);
            submitFormData.append('email', formData.email);
            submitFormData.append('phoneNumber', formData.phoneNumber);
            submitFormData.append('password', formData.password);
            submitFormData.append('address', formData.address);
            submitFormData.append('dateOfBirth', formData.dateOfBirth);

            const response = await registerPatient(submitFormData);
            console.log('Registration successful:', response);

            // Navigate to login page after successful registration
            router.push('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setSubmissionError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left Side - Brand Section */}
            <div className="relative flex w-full lg:w-5/12 flex-col justify-between bg-[#9871ff] p-4 sm:p-6 lg:p-12 xl:p-16 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/4 top-1/4 h-1/3 w-1/3 rounded-full bg-white/10 sm:h-64 sm:w-64" />
                    <div className="absolute -right-1/4 bottom-1/4 h-1/3 w-1/3 rounded-full bg-white/10 sm:h-80 sm:w-80" />
                </div>

                <div className="relative z-10">
                    <div className="mb-4 sm:mb-8 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/20">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>

                    <div className="max-w-md">
                        <h1 className="mb-2 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                            Join Accexx 247
                        </h1>
                        <p className="text-base sm:text-lg xl:text-xl font-light text-white/90">
                            Create your account to access quality healthcare services anytime, anywhere.
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="rounded-xl bg-white/10 p-3 sm:p-4">
                            <Users className="mb-2 h-5 w-5 sm:h-6 sm:w-6" />
                            <div className="text-xl sm:text-2xl font-bold">2000+</div>
                            <div className="text-xs text-white/80">Active Patients</div>
                        </div>
                        <div className="rounded-xl bg-white/10 p-3 sm:p-4">
                            <Shield className="mb-2 h-5 w-5 sm:h-6 sm:w-6" />
                            <div className="text-xl sm:text-2xl font-bold">100%</div>
                            <div className="text-xs text-white/80">Data Security</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 mt-6 border-t border-white/20 pt-4 sm:pt-6">
                    <div className="flex items-center text-white/80">
                        <div className="mr-3 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/20">
                            <Shield className="h-4 w-4" />
                        </div>
                        <p className="text-xs">
                            Your data is secure with our platform
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="flex-1 bg-gray-50 px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Fill in your details to get started
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow-xl p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    Full Name
                                </Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={errors.fullName ? 'border-red-500' : ''}
                                />
                                {errors.fullName && (
                                    <Alert variant="destructive" className="border-none">
                                        <AlertDescription>{errors.fullName}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <Alert variant="destructive" className="border-none">
                                        <AlertDescription>{errors.email}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    Phone Number
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="+1234567890"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className={errors.phoneNumber ? 'border-red-500' : ''}
                                />
                                {errors.phoneNumber && (
                                    <Alert variant="destructive" className="border-none">
                                        <AlertDescription>{errors.phoneNumber}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    Address
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Enter your address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={errors.address ? 'border-red-500' : ''}
                                />
                                {errors.address && (
                                    <Alert variant="destructive" className="border-none">
                                        <AlertDescription>{errors.address}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    Date of Birth
                                </Label>
                                <Input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className={errors.dateOfBirth ? 'border-red-500' : ''}
                                />
                                {errors.dateOfBirth && (
                                    <Alert variant="destructive" className="border-none">
                                        <AlertDescription>{errors.dateOfBirth}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-gray-500" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Create a secure password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && (
                                    <Alert variant="destructive" className="border-none">
                                        <AlertDescription>{errors.password}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#9871ff] hover:bg-[#8b66ff] text-white py-3"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>

                            {/* Error Message */}
                            {submissionError && (
                                <Alert variant="destructive" className="border-none">
                                    <AlertDescription>{submissionError}</AlertDescription>
                                </Alert>
                            )}
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-[#9871ff] hover:text-[#8b66ff] font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Form Footer */}
                    <div className="mt-4 text-center text-xs text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>Your health is our priority</span>
                        </div>
                        <p className="mt-1">Need help? Contact our support team</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage; 