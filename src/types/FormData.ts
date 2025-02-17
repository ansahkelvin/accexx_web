import { LucideIcon } from 'lucide-react';
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
    confirmPassword: string;
}

export interface Step {
    title: string;
    icon: LucideIcon;
    description: string;
}

export interface StepperHeaderProps {
    steps: Step[];
    currentStep: number;
}

export interface StepComponentProps {
    formData: RegistrationFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { [key: string]: string };
    renderError: (fieldName: string) => React.ReactNode;
}

export interface NavigationButtonsProps {
    currentStep: number;
    stepsLength: number;
    onNext: () => void;
    onPrev: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
}

// Validation functions
export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password);
};

export const validatePhoneNumber = (phone: string): boolean => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s()-]/g, ''));
};

export const validateCoordinates = (coord: string, type: 'latitude' | 'longitude'): boolean => {
    const num = parseFloat(coord);
    if (isNaN(num)) return false;
    return type === 'latitude' ? num >= -90 && num <= 90 : num >= -180 && num <= 180;
};