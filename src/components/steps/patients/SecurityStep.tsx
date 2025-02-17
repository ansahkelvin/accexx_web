import React from 'react';
import { Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepComponentProps } from '@/types/FormData';

const SecurityStep: React.FC<StepComponentProps> = ({ formData, handleInputChange, errors, renderError }) => (
    <div className="space-y-6">
        <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                    <Lock className="h-5 w-5" />
                </span>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`rounded-l-none ${errors.password ? "border-red-500" : ""}`}
                    placeholder="Enter your password"
                />
            </div>
            {renderError('password')}
        </div>

        <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                    <Lock className="h-5 w-5" />
                </span>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`rounded-l-none ${errors.confirmPassword ? "border-red-500" : ""}`}
                    placeholder="Confirm your password"
                />
            </div>
            {renderError('confirmPassword')}
        </div>
    </div>
);

export default SecurityStep;