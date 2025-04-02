'use client';

import React, {useEffect, useState, useRef} from 'react';
import { User, Save, Check, X } from 'lucide-react';
import {fetchDoctorDetails, editDoctorDetails} from "@/service/doctors/doctor";
import Image from "next/image";

interface DoctorDetails {
    id: string;
    email: string;
    name: string;
    gmc_number: string;
    specialization: string;
    bio: string;
    work_address: string;
    work_address_latitude: number;
    work_address_longitude: number;
    role: string;
    profile_image: string;
}

export default function SettingsPage() {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [profile, setProfile] = useState<DoctorDetails>({
        id: "",
        email: "",
        name: "",
        gmc_number: "",
        specialization: "",
        bio: "",
        work_address: "",
        work_address_latitude: 0,
        work_address_longitude: 0,
        role: "doctor",
        profile_image: ""
    });

    // For image upload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetchDoctorDetails();
                if (response) {
                    setProfile(response);
                    setImagePreview(response.profile_image || "");
                }
            } catch (error) {
                console.error("Error fetching doctor details:", error);
                setErrorMessage("Failed to load profile data");
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    // Form handling
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    // Save profile changes
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);
        setErrorMessage("");

        try {
            // Call the editDoctorDetails function with profile data and image file
            const updatedUser = await editDoctorDetails(profile, imageFile || undefined);

            if (!updatedUser) {
                throw new Error('Failed to update profile');
            }

            // Update local state with the returned user data
            setProfile(updatedUser);

            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving profile:", error);
            setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
            setIsError(true);
            setTimeout(() => setIsError(false), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Profile Settings</h1>

                {isSuccess && (
                    <div className="bg-green-50 text-green-800 px-4 py-2 rounded-md flex items-center">
                        <Check size={16} className="mr-2" />
                        <span>Profile updated successfully</span>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 text-red-800 px-4 py-2 rounded-md flex items-center">
                        <X size={16} className="mr-2" />
                        <span>{errorMessage || "Failed to update profile"}</span>
                    </div>
                )}
            </div>

            {/* Profile Settings Content */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    {isLoading && !profile.id ? (
                        <div className="flex justify-center items-center p-8">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                            <span className="ml-2">Loading profile...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveProfile}>
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mr-4 cursor-pointer"
                                        onClick={handleImageClick}
                                    >
                                        {imagePreview ? (
                                            <Image
                                                src={imagePreview}
                                                alt={profile.name}
                                                className="w-full h-full object-cover"
                                                width={1400}
                                                height={1400}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <User size={40} className="text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleImageClick}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                                        >
                                            Change Photo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GMC Number</label>
                                    <input
                                        type="text"
                                        name="gmc_number"
                                        value={profile.gmc_number}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={profile.specialization}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    value={profile.bio}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Address</label>
                                <input
                                    type="text"
                                    name="work_address"
                                    value={profile.work_address}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        name="work_address_latitude"
                                        step="0.0001"
                                        value={profile.work_address_latitude}
                                        onChange={handleNumberChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        name="work_address_longitude"
                                        step="0.0001"
                                        value={profile.work_address_longitude}
                                        onChange={handleNumberChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} className="mr-2" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}