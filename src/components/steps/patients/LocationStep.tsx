import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepComponentProps } from '@/types/FormData';

const LocationStep: React.FC<StepComponentProps> = ({ formData, handleInputChange, errors, renderError }) => (
    <div className="space-y-6">
        <div>
            <Label htmlFor="address">Address</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                    <MapPin className="h-5 w-5" />
                </span>
                <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`rounded-l-none ${errors.address ? "border-red-500" : ""}`}
                    placeholder="123 Medical Center Dr"
                />
            </div>
            {renderError('address')}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className={errors.latitude ? "border-red-500" : ""}
                    placeholder="40.7128°"
                />
                {renderError('latitude')}
            </div>
            <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className={errors.longitude ? "border-red-500" : ""}
                    placeholder="-74.0060°"
                />
                {renderError('longitude')}
            </div>
        </div>
    </div>
);

export default LocationStep;