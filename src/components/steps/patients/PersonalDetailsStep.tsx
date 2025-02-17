import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import {StepProps} from "@/types/FormData";

const PersonalDetailsStep: React.FC<StepProps> = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-6">
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            <User className="h-5 w-5" />
          </span>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-[#9871ff] focus:outline-none focus:ring-[#9871ff] sm:text-sm"
                        placeholder="John Doe"
                    />
                </div>
            </div>

            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            <Mail className="h-5 w-5" />
          </span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-[#9871ff] focus:outline-none focus:ring-[#9871ff] sm:text-sm"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            <Calendar className="h-5 w-5" />
          </span>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-[#9871ff] focus:outline-none focus:ring-[#9871ff] sm:text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsStep;