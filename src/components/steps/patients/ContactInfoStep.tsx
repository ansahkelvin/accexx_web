import React from 'react';
import { Phone, Upload } from 'lucide-react';
import {StepProps} from "@/types/FormData";
import Image from "next/image";

const ContactInfoStep: React.FC<StepProps> = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-6">
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            <Phone className="h-5 w-5" />
          </span>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-[#9871ff] focus:outline-none focus:ring-[#9871ff] sm:text-sm"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
            </div>

            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">Profile Picture</label>
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
                        <div className="mt-4 flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md bg-white font-medium text-[#9871ff] focus-within:outline-none hover:text-blue-500">
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
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoStep;