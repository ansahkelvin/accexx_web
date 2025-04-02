'use client';

import React from 'react';
import { User, Phone, MapPin, Lock, Heart, Users, Activity, Shield } from 'lucide-react';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { Step } from '@/types/FormData';
import { Alert, AlertDescription } from "@/components/ui/alert";
import PersonalDetailsStep from "@/components/steps/patients/PersonalDetailsStep";
import ContactInfoStep from "@/components/steps/patients/ContactInfoStep";
import LocationStep from "@/components/steps/patients/LocationStep";
import SecurityStep from "@/components/steps/patients/SecurityStep";

const RegistrationStepper: React.FC = () => {
    const {
        currentStep,
        formData,
        errors,
        handleInputChange,
        handleNext,
        handlePrev,
        handleSubmit
    } = useRegistrationForm();

    const steps: Step[] = [
        {
            title: 'Personal Details',
            icon: User,
            description: 'Let\'s start with your basic information'
        },
        {
            title: 'Contact Info',
            icon: Phone,
            description: 'How can we reach you?'
        },
        {
            title: 'Location',
            icon: MapPin,
            description: 'Where are you located?'
        },
        {
            title: 'Security',
            icon: Lock,
            description: 'Keep your account secure'
        }
    ];

    const renderError = (fieldName: string): React.ReactNode => {
        if (errors[fieldName]) {
            return (
                <Alert variant="destructive" className="mt-2 border-none">
                    <AlertDescription>{errors[fieldName]}</AlertDescription>
                </Alert>
            );
        }
        return null;
    };

    const stepProps = {
        formData,
        handleInputChange,
        errors,
        renderError
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <PersonalDetailsStep {...stepProps} />;
            case 2: return <ContactInfoStep {...stepProps} />;
            case 3: return <LocationStep {...stepProps} />;
            case 4: return <SecurityStep {...stepProps} />;
            default: return null;
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
                            Healthcare Made Simple
                        </h1>
                        <p className="text-base sm:text-lg xl:text-xl font-light text-white/90">
                            Join our platform for better, faster, and more accessible healthcare services.
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
                <div className="mx-auto w-full max-w-2xl">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Join Us</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Complete your profile to get started
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow-xl">
                        {/* Stepper Header */}
                        <div className="border-b border-gray-200 bg-gray-50 p-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:justify-between">
                                {steps.map((step, index) => (
                                    <div key={step.title} className="flex flex-col items-center">
                                        <div
                                            className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                                                currentStep > index + 1
                                                    ? 'border-[#9871ff] bg-[#9871ff] text-white'
                                                    : currentStep === index + 1
                                                        ? 'border-[#9871ff] text-[#9871ff]'
                                                        : 'border-gray-300 text-gray-300'
                                            }`}
                                        >
                                            <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <p className="mt-2 text-xs sm:text-sm font-medium text-gray-700">{step.title}</p>
                                        <p className="mt-1 text-xs text-gray-500 text-center hidden sm:block">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-4 sm:px-6 lg:px-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {renderStepContent()}

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className={`flex items-center rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium transition-colors ${
                                            currentStep === 1
                                                ? 'invisible'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type={currentStep === steps.length ? 'submit' : 'button'}
                                        onClick={currentStep === steps.length ? handleSubmit : handleNext}
                                        className="flex items-center rounded-lg bg-[#9871ff] px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white transition-colors hover:bg-[#8b66ff]"
                                    >
                                        {currentStep === steps.length ? 'Complete' : 'Continue'}
                                    </button>
                                </div>
                            </form>
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

export default RegistrationStepper;