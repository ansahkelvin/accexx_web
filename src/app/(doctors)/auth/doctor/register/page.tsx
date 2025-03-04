"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Stethoscope, Calendar, UserRound, Mail, Lock, Building, MapPin, Upload } from 'lucide-react';
import PersonalInfoForm from "@/components/ui/personal-information";
import ProfessionalInfoForm from "@/components/ui/professional-form";
import WorkAddressForm from "@/components/ui/work-address";
import UploadImageForm from "@/components/ui/image-upload";
import ConfirmationStep from "@/components/ui/confirmation";
import Image from 'next/image';

const steps = [
    { id: 'personal', name: 'Personal Information', icon: UserRound },
    { id: 'professional', name: 'Professional Details', icon: Stethoscope },
    { id: 'location', name: 'Work Location', icon: MapPin },
    { id: 'image', name: 'Profile Image', icon: Upload },
    { id: 'confirm', name: 'Review & Submit', icon: CheckCircle }
];

export default function RegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        dateOfBirth: '',
        gmc_number: '',
        specialization: '',
        bio: '',
        work_address: '',
        work_address_latitude: 0,
        work_address_longitude: 0,
        profile_image: null as File | null,
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const updateFormData = (fieldData: Partial<typeof formData>) => {
        setFormData(prev => ({
            ...prev,
            ...fieldData
        }));
    };

    const validateCurrentStep = () => {
        const errors: Record<string, string> = {};

        switch (currentStep) {
            case 0: // Personal Info
                if (!formData.name.trim()) errors.name = 'Name is required';
                if (!formData.email.trim()) errors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email address';
                if (!formData.password) errors.password = 'Password is required';
                else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
                if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
                if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
                break;
            case 1: // Professional Info
                if (!formData.gmc_number.trim()) errors.gmc_number = 'GMC number is required';
                if (!formData.specialization) errors.specialization = 'Specialization is required';
                break;
            case 2: // Work Location
                if (!formData.work_address) errors.work_address = 'Work address is required';
                if (!formData.work_address_latitude || !formData.work_address_longitude) {
                    errors.work_address = 'Please select a location on the map';
                }
                break;
            case 3: // Profile Image
                if (!formData.profile_image) errors.profile_image = 'Profile image is required';
                break;
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleImageChange = (file: File) => {
        updateFormData({ profile_image: file });

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // This prevents the default form submission

        if (!validateCurrentStep()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('date_of_birth', formData.dateOfBirth);
            formDataToSend.append('gmc_number', formData.gmc_number);
            formDataToSend.append('specialization', formData.specialization);
            if (formData.bio) formDataToSend.append('bio', formData.bio);
            formDataToSend.append('work_address', formData.work_address);
            formDataToSend.append('work_address_latitude', formData.work_address_latitude.toString());
            formDataToSend.append('work_address_longitude', formData.work_address_longitude.toString());
            if (formData.profile_image) formDataToSend.append('profile_image', formData.profile_image);

            // const response = await fetch('/api/doctor/auth', {
            //     method: 'POST',
            //     body: formDataToSend
            // });
            //
            // if (response.ok) {
            //     router.push('/login?registered=true');
            // } else {
            //     const errorData = await response.json();
            //     throw new Error(errorData.detail || 'Registration failed');
            // }
        } catch (error) {
            console.error('Registration error:', error);
            setFormErrors({
                submit: (error as Error).message || 'An unexpected error occurred. Please try again.'
            });
            setCurrentStep(0);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <PersonalInfoForm formData={formData} updateFormData={updateFormData} errors={formErrors} />;
            case 1:
                return <ProfessionalInfoForm formData={formData} updateFormData={updateFormData} errors={formErrors} />;
            case 2:
                return <WorkAddressForm formData={formData} updateFormData={updateFormData} errors={formErrors} />;
            case 3:
                return <UploadImageForm handleImageChange={handleImageChange} imagePreview={imagePreview} errors={formErrors} />;
            case 4:
                return <ConfirmationStep formData={formData} imagePreview={imagePreview} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>

                {/* Logo and headline */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm text-white mb-4">
                        <Stethoscope size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white">
                        Doctor Registration
                    </h1>
                    <p className="mt-3 text-xl text-blue-200">Join our network of healthcare professionals</p>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100 backdrop-blur-sm">
                    {/* Progress Bar */}
                    <div className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 h-1.5"></div>

                    <div className="px-6 py-8 sm:p-10">
                        {/* Advanced Stepper with icons */}
                        <div className="pt-4">
                            <div className="flex flex-wrap items-center justify-center max-w-3xl mx-auto mb-8">
                                {steps.map((step, index) => {
                                    const StepIcon = step.icon;
                                    return (
                                        <div key={step.id} className="flex items-center">
                                            <div className={`flex flex-col items-center ${index > 0 ? 'ml-4 sm:ml-12' : ''}`}>
                                                <div className={`
                                                    flex items-center justify-center w-12 h-12 rounded-full 
                                                    ${index < currentStep
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-emerald-200/50'
                                                    : index === currentStep
                                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-200/50 animate-pulse'
                                                        : 'bg-gray-200'
                                                }
                                                    transition-all duration-200
                                                `}>
                                                    {index < currentStep ? (
                                                        <CheckCircle className="w-6 h-6 text-white" />
                                                    ) : (
                                                        <StepIcon className={`w-6 h-6 ${index === currentStep ? 'text-white' : 'text-gray-500'}`} />
                                                    )}
                                                </div>
                                                <span className={`mt-2 text-xs sm:text-sm font-medium ${
                                                    index <= currentStep ? 'text-indigo-600 font-semibold' : 'text-gray-500'
                                                }`}>
                                                    {step.name}
                                                </span>
                                            </div>

                                            {index < steps.length - 1 && (
                                                <div className="hidden sm:block w-12 h-0.5 mx-2 bg-gray-200">
                                                    <div className={`h-0.5 ${
                                                        index < currentStep ? 'bg-gradient-to-r from-blue-500 to-indigo-600 w-full' : 'w-0'
                                                    } transition-all duration-500`}></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Form error message */}
                        {formErrors.submit && (
                            <div className="mt-6 rounded-xl bg-red-50 p-4 border-l-4 border-red-400 animate-pulse">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{formErrors.submit}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-indigo-50">
                                {renderStepContent()}
                            </div>

                            <div className="flex justify-between items-center pt-6">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={currentStep === 0 || isSubmitting}
                                    className={`
                                        px-6 py-3 border border-gray-300 rounded-lg shadow-sm 
                                        text-base font-medium text-gray-700 bg-white 
                                        hover:bg-gray-50 transition-all duration-200 
                                        ${(currentStep === 0 || isSubmitting)
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:shadow-md hover:border-gray-400'
                                    }
                                    `}
                                >
                                    Back
                                </button>

                                {currentStep === steps.length - 1 ? (
                                    <button
                                        type="submit"
                                        onClick={(e) => {
                                            if (!validateCurrentStep()) {
                                                e.preventDefault();
                                            }
                                        }}
                                        disabled={isSubmitting}
                                        className={`
                                            px-8 py-3 border border-transparent rounded-lg shadow-md 
                                            text-base font-medium text-white 
                                            bg-gradient-to-r from-indigo-600 to-blue-500 
                                            hover:from-indigo-700 hover:to-blue-600 
                                            transition-all duration-300 
                                            ${isSubmitting
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:shadow-lg hover:translate-y-[-2px]'
                                        }
                                        `}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Submitting...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span>Complete Registration</span>
                                                <CheckCircle className="ml-2 h-5 w-5" />
                                            </div>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                        className={`
                                            px-8 py-3 border border-transparent rounded-lg shadow-md 
                                            text-base font-medium text-white 
                                            bg-gradient-to-r from-indigo-600 to-blue-500 
                                            hover:from-indigo-700 hover:to-blue-600 
                                            transition-all duration-300 
                                            ${isSubmitting
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:shadow-lg hover:translate-y-[-2px]'
                                        }
                                        `}
                                    >
                                        <div className="flex items-center">
                                            <span>Continue</span>
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-blue-300">
                    <p>Already have an account? <a href="/login" className="text-white font-medium hover:underline">Sign in</a></p>
                </div>
            </div>
        </div>
    );
}