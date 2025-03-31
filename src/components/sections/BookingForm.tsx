import React from 'react';
import { MapPin, Calendar, User, Search } from 'lucide-react';
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function BookingForm() {
    return (
        <div className="w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 2xl:p-8">
            {/* Category Selection */}
            <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 mb-6">
                <button className="flex items-center gap-2 text-purple-600 border-b-2 border-purple-600 pb-2 text-sm sm:text-base">
                    <span className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600">⚕</span>
                    <span>General</span>
                </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Location Field */}
                <div className="flex-1 relative">
                    <div className="flex items-center gap-3 border rounded-lg p-2 sm:p-3">
                        <MapPin className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Location</span>
                            <input
                                readOnly={true}
                                type="text"
                                placeholder="Enter location"
                                defaultValue="London, England"
                                className="outline-none text-gray-700 text-sm sm:text-base w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Date Field */}
                <div className="flex-1 relative">
                    <div className="flex items-center gap-3 border rounded-lg p-2 sm:p-3">
                        <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-400" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Appointment Date</span>
                            <input
                                readOnly={true}
                                type="text"
                                placeholder="Select date"
                                defaultValue="04 March 2025"
                                className="outline-none text-gray-700 text-sm sm:text-base w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Person Field */}
                <div className="flex-1 relative">
                    <div className="flex items-center gap-3 border rounded-lg p-2 sm:p-3">
                        <User className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-400" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Who</span>
                            <input
                                readOnly={true}
                                type="text"
                                placeholder="Select person"
                                defaultValue="1 Adult"
                                className="outline-none text-gray-700 text-sm sm:text-base w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <Button
                    className="bg-purple-600 text-white px-6 h-[58px] sm:px-8 py-3 sm:py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 text-sm sm:text-base">
                    <Link className="flex gap-2 items-center" href={'/login'}>
                        <Search className="w-4 sm:w-5 h-4 sm:h-5" />
                        Search
                    </Link>
                </Button>
            </div>
        </div>
    );
}