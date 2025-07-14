'use client';

import React, { useState } from 'react';
import { User, Phone, MapPin, Lock, Heart, Users, Activity, Shield, Mail, Calendar, Stethoscope, Upload, Building, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerDoctor } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DoctorRegistrationFormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    address: string;
    dateOfBirth: string;
    appointmentAddress: string;
    latitude: string;
    longitude: string;
    bio: string;
    specialization: string;
    gmcNumber: string;
    profileImage: File | null;
}

const DoctorRegistrationPage: React.FC = () => {
    const [formData, setFormData] = useState<DoctorRegistrationFormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        address: '',
        dateOfBirth: '',
        appointmentAddress: '',
        latitude: '',
        longitude: '',
        bio: '',
        specialization: '',
        gmcNumber: '',
        profileImage: null
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    const validateCoordinates = (value: string, type: 'latitude' | 'longitude'): boolean => {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (type === 'latitude') return num >= -90 && num <= 90;
        if (type === 'longitude') return num >= -180 && num <= 180;
        return false;
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

        if (!formData.appointmentAddress.trim()) {
            newErrors.appointmentAddress = 'Appointment address is required';
        }

        if (!formData.latitude) {
            newErrors.latitude = 'Latitude is required';
        } else if (!validateCoordinates(formData.latitude, 'latitude')) {
            newErrors.latitude = 'Invalid latitude (-90 to 90)';
        }

        if (!formData.longitude) {
            newErrors.longitude = 'Longitude is required';
        } else if (!validateCoordinates(formData.longitude, 'longitude')) {
            newErrors.longitude = 'Invalid longitude (-180 to 180)';
        }

        if (!formData.bio.trim()) {
            newErrors.bio = 'Bio is required';
        }

        if (!formData.specialization.trim()) {
            newErrors.specialization = 'Specialization is required';
        }

        if (!formData.gmcNumber.trim()) {
            newErrors.gmcNumber = 'GMC number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        
        if (errors.profileImage) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.profileImage;
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
            const submitFormData = new FormData();
            submitFormData.append('fullName', formData.fullName);
            submitFormData.append('email', formData.email);
            submitFormData.append('phoneNumber', formData.phoneNumber);
            submitFormData.append('password', formData.password);
            submitFormData.append('address', formData.address);
            submitFormData.append('dateOfBirth', formData.dateOfBirth);
            submitFormData.append('appointmentAddress', formData.appointmentAddress);
            submitFormData.append('latitude', formData.latitude);
            submitFormData.append('longitude', formData.longitude);
            submitFormData.append('bio', formData.bio);
            submitFormData.append('specialization', formData.specialization);
            submitFormData.append('gmcNumber', formData.gmcNumber);
            
            if (formData.profileImage) {
                submitFormData.append('profileImage', formData.profileImage);
            }

            const response = await registerDoctor(submitFormData);
            console.log('Doctor registration successful:', response);

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
            <div className="relative flex w-full lg:w-5/12 flex-col justify-between bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 p-4 sm:p-6 lg:p-12 xl:p-16 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/4 top-1/4 h-1/3 w-1/3 rounded-full bg-white/10 sm:h-64 sm:w-64" />
                    <div className="absolute -right-1/4 bottom-1/4 h-1/3 w-1/3 rounded-full bg-white/10 sm:h-80 sm:w-80" />
                </div>

                <div className="relative z-10">
                    <div className="mb-4 sm:mb-8 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/20">
                        <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>

                    <div className="max-w-md">
                        <h1 className="mb-2 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                            Join as a Doctor
                        </h1>
                        <p className="text-base sm:text-lg xl:text-xl font-light text-blue-200">
                            Connect with patients and provide quality healthcare services through our platform.
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="rounded-xl bg-white/10 p-3 sm:p-4">
                            <Users className="mb-2 h-5 w-5 sm:h-6 sm:w-6" />
                            <div className="text-xl sm:text-2xl font-bold">500+</div>
                            <div className="text-xs text-blue-200">Active Doctors</div>
                        </div>
                        <div className="rounded-xl bg-white/10 p-3 sm:p-4">
                            <Shield className="mb-2 h-5 w-5 sm:h-6 sm:w-6" />
                            <div className="text-xl sm:text-2xl font-bold">100%</div>
                            <div className="text-xs text-blue-200">Verified</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 mt-6 border-t border-white/20 pt-4 sm:pt-6">
                    <div className="flex items-center text-blue-200">
                        <div className="mr-3 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/20">
                            <Shield className="h-4 w-4" />
                        </div>
                        <p className="text-xs">
                            Your credentials are verified and secure
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="flex-1 bg-gray-50 px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
                <div className="mx-auto w-full max-w-2xl">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Doctor Registration</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Complete your professional profile to start accepting patients
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow-xl p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5 text-indigo-600" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            placeholder="Dr. John Smith"
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
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john.smith@example.com"
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
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
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

                                    {/* Date of Birth */}
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
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
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="password">Password</Label>
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
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-indigo-600" />
                                    Address Information
                                </h3>
                                <div className="space-y-4">
                                    {/* Personal Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Personal Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            type="text"
                                            placeholder="123 Medical Center Dr, Healthcare City, HC 12345"
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

                                    {/* Appointment Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="appointmentAddress">Appointment Address</Label>
                                        <Input
                                            id="appointmentAddress"
                                            name="appointmentAddress"
                                            type="text"
                                            placeholder="456 Clinic Ave, Medical District, MD 67890"
                                            value={formData.appointmentAddress}
                                            onChange={handleInputChange}
                                            className={errors.appointmentAddress ? 'border-red-500' : ''}
                                        />
                                        {errors.appointmentAddress && (
                                            <Alert variant="destructive" className="border-none">
                                                <AlertDescription>{errors.appointmentAddress}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    {/* Coordinates */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="latitude">Latitude</Label>
                                            <Input
                                                id="latitude"
                                                name="latitude"
                                                type="number"
                                                step="any"
                                                placeholder="40.7128"
                                                value={formData.latitude}
                                                onChange={handleInputChange}
                                                className={errors.latitude ? 'border-red-500' : ''}
                                            />
                                            {errors.latitude && (
                                                <Alert variant="destructive" className="border-none">
                                                    <AlertDescription>{errors.latitude}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="longitude">Longitude</Label>
                                            <Input
                                                id="longitude"
                                                name="longitude"
                                                type="number"
                                                step="any"
                                                placeholder="-74.0060"
                                                value={formData.longitude}
                                                onChange={handleInputChange}
                                                className={errors.longitude ? 'border-red-500' : ''}
                                            />
                                            {errors.longitude && (
                                                <Alert variant="destructive" className="border-none">
                                                    <AlertDescription>{errors.longitude}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information Section */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-indigo-600" />
                                    Professional Information
                                </h3>
                                <div className="space-y-4">
                                    {/* GMC Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="gmcNumber">GMC Number</Label>
                                        <Input
                                            id="gmcNumber"
                                            name="gmcNumber"
                                            type="text"
                                            placeholder="GMC123456789"
                                            value={formData.gmcNumber}
                                            onChange={handleInputChange}
                                            className={errors.gmcNumber ? 'border-red-500' : ''}
                                        />
                                        {errors.gmcNumber && (
                                            <Alert variant="destructive" className="border-none">
                                                <AlertDescription>{errors.gmcNumber}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    {/* Specialization */}
                                    <div className="space-y-2">
                                        <Label htmlFor="specialization">Specialization</Label>
                                        <Input
                                            id="specialization"
                                            name="specialization"
                                            type="text"
                                            placeholder="Cardiology"
                                            value={formData.specialization}
                                            onChange={handleInputChange}
                                            className={errors.specialization ? 'border-red-500' : ''}
                                        />
                                        {errors.specialization && (
                                            <Alert variant="destructive" className="border-none">
                                                <AlertDescription>{errors.specialization}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Professional Bio</Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            placeholder="Describe your experience, qualifications, and areas of expertise..."
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className={errors.bio ? 'border-red-500' : ''}
                                        />
                                        {errors.bio && (
                                            <Alert variant="destructive" className="border-none">
                                                <AlertDescription>{errors.bio}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Image Section */}
                            <div className="pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-indigo-600" />
                                    Profile Image
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="profileImage">Upload Profile Image (Optional)</Label>
                                        <Input
                                            id="profileImage"
                                            name="profileImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="cursor-pointer"
                                        />
                                        {errors.profileImage && (
                                            <Alert variant="destructive" className="border-none">
                                                <AlertDescription>{errors.profileImage}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                            <img
                                                src={imagePreview}
                                                alt="Profile preview"
                                                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Doctor Account'
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
                                <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
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

export default DoctorRegistrationPage; 