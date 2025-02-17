// types.ts

import React from "react";

export interface RegistrationFormData {
    name: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    address: string;
    latitude: string;
    longitude: string;
    file: File | null;
    password: string;
}

export interface Step {
    title: string;
    icon: React.ElementType;
    description: string;
}

export interface StepProps {
    formData: RegistrationFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface StepperHeaderProps {
    steps: Step[];
    currentStep: number;
}

export interface NavigationButtonsProps {
    currentStep: number;
    stepsLength: number;
    onNext: () => void;
    onPrev: () => void;
    onSubmit: (e: React.FormEvent) => void;
}