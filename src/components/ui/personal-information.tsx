// components/registration/PersonalInfoForm.tsx
import React from 'react';

interface FormDataType {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
}

interface PersonalInfoFormProps {
    formData: FormDataType;
    updateFormData: (data: Partial<FormDataType>) => void;
    errors: Record<string, string>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, updateFormData, errors }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        placeholder="John Smith"
                        className={`block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <div className="mt-1">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        placeholder="doctor@example.com"
                        className={`block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                </label>
                <div className="mt-1">
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                        className={`block w-full px-3 py-2 border ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => updateFormData({ password: e.target.value })}
                        className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    <p className="mt-1 text-sm text-gray-500">Password must be at least 8 characters long</p>
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <div className="mt-1">
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                        className={`block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;