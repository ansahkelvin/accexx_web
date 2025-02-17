'use client';
import React, { useState } from 'react';
import { RegistrationFormData } from '@/types/FormData';
import { validateEmail, validatePassword, validatePhoneNumber, validateCoordinates } from '@/types/FormData';

export const useRegistrationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<RegistrationFormData>({
        name: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        address: '',
        latitude: '',
        longitude: '',
        file: null,
        password: '',
        confirmPassword: ''
    });

    const validateStep = (step: number): boolean => {
        const newErrors: { [key: string]: string } = {};

        switch (step) {
            case 1:
                if (!formData.name.trim()) newErrors.name = 'Name is required';
                if (!formData.email) newErrors.email = 'Email is required';
                else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
                if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
                break;

            case 2:
                if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
                else if (!validatePhoneNumber(formData.phoneNumber))
                    newErrors.phoneNumber = 'Invalid phone number format';
                break;

            case 3:
                if (!formData.address.trim()) newErrors.address = 'Address is required';
                if (formData.latitude && !validateCoordinates(formData.latitude, 'latitude'))
                    newErrors.latitude = 'Invalid latitude (-90 to 90)';
                if (formData.longitude && !validateCoordinates(formData.longitude, 'longitude'))
                    newErrors.longitude = 'Invalid longitude (-180 to 180)';
                break;

            case 4:
                if (!formData.password) newErrors.password = 'Password is required';
                else if (!validatePassword(formData.password))
                    newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number and special character';
                if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
                else if (formData.password !== formData.confirmPassword)
                    newErrors.confirmPassword = 'Passwords do not match';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value, files } = e.target;
        if (name === 'file' && files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            try {
                console.log('Form submitted:', formData);

            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };



    return {
        currentStep,
        formData,
        errors,
        handleInputChange,
        handleNext,
        handlePrev,
        handleSubmit,
        validateStep
    };
};