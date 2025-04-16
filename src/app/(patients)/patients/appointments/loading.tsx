'use client';

import React from 'react';
import AppointmentCardSkeleton from '@/components/AppointmentCardSkeleton';

export default function Loading() {
    // Create an array to repeat the skeleton component
    const skeletonCount = 4; // Number of skeleton cards to show

    return (
        <div className="container max-w-screen-xl mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Tab placeholder */}
            <div className="flex gap-2 border-b border-gray-200 mb-6">
                <div className="h-10 w-28 bg-gray-200 rounded-t animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-200 rounded-t animate-pulse opacity-70"></div>
            </div>

            {/* Grid of skeleton cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(skeletonCount).fill(0).map((_, index) => (
                    <AppointmentCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}