'use client';

import React from 'react';

export default function DoctorDetailLoading() {
    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Doctor Quick Info Card Skeleton */}
                <div className="w-full rounded-xl mb-10 overflow-hidden bg-white shadow-sm">
                    {/* Banner image skeleton */}
                    <div className="relative h-64 w-full bg-gray-200"></div>

                    {/* Profile image overlay skeleton */}
                    <div className="absolute top-52 left-8">
                        <div className="h-40 w-40 rounded-full bg-gray-300 border-4 border-white shadow-lg"></div>
                    </div>

                    {/* Content section skeleton */}
                    <div className="pt-10 pb-6 px-8">
                        {/* Doctor name and specialty */}
                        <div className="flex items-center">
                            <div className="h-6 w-40 bg-gray-200 rounded"></div>
                            <div className="flex items-center ml-4">
                                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>

                        {/* Hospital and location */}
                        <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>

                        {/* Stats section */}
                        <div className="flex items-center mt-4 space-x-6">
                            <div className="flex items-center">
                                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                <div className="ml-2 h-4 w-20 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="">
                    {/* Left Column - Doctor Info */}
                    <div className="">
                        {/* About section skeleton */}
                        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6">
                            <div className="p-6">
                                <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Contact information skeleton */}
                        <div className="bg-white shadow-md rounded-xl overflow-hidden">
                            <div className="p-6">
                                <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                                <div className="space-y-4">
                                    {/* Address */}
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                        <div className="ml-3">
                                            <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                                            <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                        <div className="ml-3">
                                            <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                        <div className="ml-3">
                                            <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Appointment Booking Skeleton */}
                    <div className="my-10">
                        <div className="bg-white shadow-md rounded-xl overflow-hidden">
                            <div className="border-b border-gray-200">
                                <div className="p-6">
                                    <div className="h-6 w-56 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>

                                    {/* Book Appointment Button */}
                                    <div className="mt-12">
                                        <div className="h-12 w-40 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}