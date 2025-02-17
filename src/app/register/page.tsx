'use client';

import React, { useState } from 'react';
import { User, Phone, MapPin, Lock, Heart, Users, Activity, Shield } from 'lucide-react';
import { RegistrationFormData, Step } from "@/types/FormData";
import PersonalDetailsStep from "@/components/steps/patients/PersonalDetailsStep";
import ContactInfoStep from "@/components/steps/patients/ContactInfoStep";
import LocationStep from "@/components/steps/patients/LocationStep";
import SecurityStep from "@/components/steps/patients/SecurityStep";
import StepperHeader from "@/components/steps/patients/StepperHeader";
import NavigationButtons from "@/components/steps/patients/NavigationButtons";

const RegistrationStepper: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<RegistrationFormData>({
        name: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        address: '',
        latitude: '',
        longitude: '',
        file: null,
        password: ''
    });

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === 'file' && files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Form submitted:', formData);
            // API call would go here
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <PersonalDetailsStep formData={formData} handleInputChange={handleInputChange} />;
            case 2:
                return <ContactInfoStep formData={formData} handleInputChange={handleInputChange} />;
            case 3:
                return <LocationStep formData={formData} handleInputChange={handleInputChange} />;
            case 4:
                return <SecurityStep formData={formData} handleInputChange={handleInputChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Brand Section */}
            <div className="relative flex w-full flex-col justify-between bg-[#9871ff] p-6 text-white sm:p-8 lg:w-5/12 lg:p-12 xl:p-16">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/4 top-1/4 h-1/3 w-1/3 rounded-full bg-white/10 sm:h-64 sm:w-64"></div>
                    <div className="absolute -right-1/4 bottom-1/4 h-1/3 w-1/3 rounded-full bg-white/10 sm:h-80 sm:w-80"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Logo Area */}
                    <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 sm:mb-16 sm:h-12 sm:w-12">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>

                    {/* Main Text */}
                    <div className="max-w-md">
                        <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                            Healthcare Made Simple
                        </h1>
                        <p className="text-lg font-light text-white/90 sm:text-xl">
                            Join our platform for better, faster, and more accessible healthcare services.
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-8">
                        <div className="rounded-xl bg-white/10 p-4 sm:p-6">
                            <Users className="mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8" />
                            <div className="text-2xl font-bold sm:text-3xl">2000+</div>
                            <div className="text-xs sm:text-sm text-white/80">Active Patients</div>
                        </div>
                        <div className="rounded-xl bg-white/10 p-4 sm:p-6">
                            <Shield className="mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8" />
                            <div className="text-2xl font-bold sm:text-3xl">100%</div>
                            <div className="text-xs sm:text-sm text-white/80">Data Security</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 hidden mt-auto border-t border-white/20 pt-6 sm:block sm:pt-8">
                    <div className="flex items-center text-white/80">
                        <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 sm:h-10 sm:w-10">
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <p className="text-xs sm:text-sm">
                            Your data is secure with our HIPAA-compliant platform
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="flex-1 bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:py-12">
                <div className="mx-auto w-full max-w-2xl">
                    {/* Form Header */}
                    <div className="mb-6 text-center sm:mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Join Us</h2>
                        <p className="mt-2 text-sm text-gray-600 sm:text-base">Complete your profile to get started</p>
                    </div>

                    {/* Form Container */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-xl">
                        <StepperHeader steps={steps} currentStep={currentStep} />

                        <div className="p-4 sm:px-8 sm:py-6">
                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                {renderStepContent()}
                                <NavigationButtons
                                    currentStep={currentStep}
                                    stepsLength={steps.length}
                                    onNext={() => setCurrentStep(prev => prev + 1)}
                                    onPrev={() => setCurrentStep(prev => prev - 1)}
                                    onSubmit={handleSubmit}
                                />
                            </form>
                        </div>
                    </div>

                    {/* Form Footer */}
                    <div className="mt-4 text-center text-xs sm:mt-6 sm:text-sm text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            <span>Your health is our priority</span>
                        </div>
                        <p className="mt-1 sm:mt-2">Need help? Contact our support team</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationStepper;