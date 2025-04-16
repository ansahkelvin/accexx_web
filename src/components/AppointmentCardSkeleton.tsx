'use client';

import React from 'react';

export default function AppointmentCardSkeleton() {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 h-full animate-pulse">
            {/* Image placeholder */}
            <div className="h-32 bg-gray-200"></div>

            <div className="relative">
                {/* Badge placeholders */}
                <div className="absolute top-[-30px] right-3 bg-white rounded-full px-2 py-1 shadow-sm w-12 h-6 bg-gray-200"></div>
                <div className="absolute bottom-[-28px] right-3">
                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            <div className="p-3">
                {/* Date placeholder */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-2 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>

                {/* Doctor info placeholder */}
                <div className="h-5 w-40 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-32 bg-gray-200 rounded mb-3"></div>

                {/* Type placeholder */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>

                {/* Button placeholder */}
                <div className="h-8 w-full bg-gray-200 rounded-md"></div>
            </div>
        </div>
    );
}