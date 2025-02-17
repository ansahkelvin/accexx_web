import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepComponentProps } from '@/types/FormData';

const PersonalDetailsStep: React.FC<StepComponentProps> = ({ formData, handleInputChange, errors, renderError }) => (
    <div className="space-y-6">
        <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                    <User className="h-5 w-5" />
                </span>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`rounded-l-none ${errors.name ? "border-red-500 " : ""}`}
                    placeholder="John Doe"
                />
            </div>
            {renderError('name')}
        </div>

        <div>
            <Label htmlFor="email">Email</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                    <Mail className="h-5 w-5" />
                </span>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`rounded-l-none ${errors.email ? "border-red-500" : ""}`}
                    placeholder="john@example.com"
                />
            </div>
            {renderError('email')}
        </div>

        <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                    <Calendar className="h-5 w-5" />
                </span>
                <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`rounded-l-none ${errors.dateOfBirth ? "border-red-500" : ""}`}
                />
            </div>
            {renderError('dateOfBirth')}
        </div>
    </div>
);

export default PersonalDetailsStep;