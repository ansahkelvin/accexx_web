'use client';
import React, { useState } from 'react';
import { RegistrationFormData } from '@/types/FormData';
import { validateEmail, validatePassword, validatePhoneNumber, validateCoordinates } from '@/types/FormData';
import {registerPatient} from "@/actions/auth";
import {useRouter} from "next/navigation";

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
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isSubmitting, setIsSubmitting] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [submissionError, setSubmissionError] = useState<string | null>(null) 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [registrationSuccess, setRegistrationSuccess] = useState(false) 

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
            setIsSubmitting(true);
            setSubmissionError(null);

            try {
                // Create a FormData object for multipart/form-data submission
                const submitFormData = new FormData();

                // Map form fields to match EXACTLY what the FastAPI endpoint expects
                submitFormData.append('email', formData.email);
                submitFormData.append('password', formData.password);
                submitFormData.append('name', formData.name);
                submitFormData.append('address', formData.address);

                // Ensure date is in ISO format for proper datetime conversion
                // FastAPI expects a datetime object from this field
                submitFormData.append('date_of_birth', formData.dateOfBirth);

                // Optional coordinates - only add if they exist
                if (formData.latitude) {
                    submitFormData.append('latitude', formData.latitude);
                }
                if (formData.longitude) {
                    submitFormData.append('longitude', formData.longitude);
                }

                // Handle profile image - make sure it's a File object
                if (formData.file instanceof File) {
                    submitFormData.append('profile_image', formData.file);
                }

                // Debug: Log what's being submitted
                console.log("Submitting form data:");
                for (const pair of submitFormData.entries()) {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }

                const response = await registerPatient(submitFormData);
                console.log('Registration successful:', response);

                setRegistrationSuccess(true);
                router.push("/login");
            } catch (error) {
                console.error('Error submitting form:', error);
                setSubmissionError(error instanceof Error ? error.message : 'Registration failed');
            } finally {
                setIsSubmitting(false);
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