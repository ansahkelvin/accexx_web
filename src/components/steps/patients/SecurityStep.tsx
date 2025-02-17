// components/steps/SecurityStep.tsx
import React from 'react';
import { Lock } from 'lucide-react';
import {StepProps} from "@/types/FormData";

const SecurityStep: React.FC<StepProps> = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-6">
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            <Lock className="h-5 w-5" />
          </span>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-[#9871ff] focus:outline-none focus:ring-[#9871ff] sm:text-sm"
                        placeholder="Enter your password"
                    />
                </div>
            </div>

            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            <Lock className="h-5 w-5" />
          </span>
                    <input
                        type="password"
                        className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-[#9871ff] focus:outline-none focus:ring-[#9871ff] sm:text-sm"
                        placeholder="Confirm your password"
                    />
                </div>
            </div>
        </div>
    );
};

export default SecurityStep;