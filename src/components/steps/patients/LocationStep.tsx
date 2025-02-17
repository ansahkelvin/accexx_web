import React from 'react';
import { MapPin } from 'lucide-react';
import {StepProps} from "@/types/FormData";

const LocationStep: React.FC<StepProps> = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-6">
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">Address</label>
                <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            <MapPin className="h-5 w-5" />
          </span>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-[#9871ff] focus:outline-none focus:ring-[#9871ff] sm:text-sm"
                        placeholder="123 Medical Center Dr"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700">Latitude</label>
                    <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#9871ff] focus:outline-none focus:ring-[#9871ff] sm:text-sm"
                        placeholder="40.7128°"
                    />
                </div>
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700">Longitude</label>
                    <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#9871ff] focus:outline-none focus:ring-[#9871ff] sm:text-sm"
                        placeholder="-74.0060°"
                    />
                </div>
            </div>
        </div>
    );
};

export default LocationStep;