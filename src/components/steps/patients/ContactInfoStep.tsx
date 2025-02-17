// components/steps/ContactInfoStep.tsx
import React from 'react';
import { Phone, Upload } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepComponentProps } from '@/types/FormData';
import Image from "next/image";

const ContactInfoStep: React.FC<StepComponentProps> = ({ formData, handleInputChange, errors, renderError }) => (
    <div className="space-y-6">
        <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                    <Phone className="h-5 w-5" />
                </span>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`rounded-l-none ${errors.phoneNumber ? "border-red-500" : ""}`}
                    placeholder="+1 (555) 000-0000"
                />
            </div>
            {renderError('phoneNumber')}
        </div>

        <div>
            <Label className="block text-sm font-semibold text-gray-700">Profile Picture</Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
                <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
                        {formData.file ? (
                            <Image
                                src={URL.createObjectURL(formData.file)}
                                alt="Profile preview"
                                className="h-24 w-24 rounded-full object-cover"
                                width={100}
                                height={100}
                            />
                        ) : (
                            <Upload className="h-12 w-12 text-gray-400" />
                        )}
                    </div>
                    <div className="mt-4 flex justify-center text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-medium text-[#9871ff] focus-within:outline-none hover:text-[#8b66ff]">
                            <span>Upload a file</span>
                            <input
                                type="file"
                                name="file"
                                className="sr-only"
                                onChange={handleInputChange}
                                accept="image/*"
                            />
                        </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            {renderError('file')}
        </div>
    </div>
);

export default ContactInfoStep;