// components/registration/ProfessionalInfoForm.tsx
import React from 'react';

const specializations = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Obstetrics and Gynecology',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Urology',
    'Other'
];

interface FormDataType {
    gmc_number: string;
    specialization: string;
    bio: string;
}

interface ProfessionalInfoFormProps {
    formData: FormDataType;
    updateFormData: (data: Partial<FormDataType>) => void;
    errors: Record<string, string>;
}

const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({ formData, updateFormData, errors }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Professional Details</h2>

            <div>
                <label htmlFor="gmc_number" className="block text-sm font-medium text-gray-700">
                    GMC Number
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="gmc_number"
                        name="gmc_number"
                        value={formData.gmc_number}
                        onChange={(e) => updateFormData({ gmc_number: e.target.value })}
                        className={`block w-full px-3 py-2 border ${errors.gmc_number ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.gmc_number && <p className="mt-1 text-sm text-red-600">{errors.gmc_number}</p>}
                    <p className="mt-1 text-sm text-gray-500">Your General Medical Council registration number</p>
                </div>
            </div>

            <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization
                </label>
                <div className="mt-1">
                    <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={(e) => updateFormData({ specialization: e.target.value })}
                        className={`block w-full px-3 py-2 border ${errors.specialization ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                        <option value="">Select a specialization</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                                {spec}
                            </option>
                        ))}
                    </select>
                    {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Professional Bio
                </label>
                <div className="mt-1">
          <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={(e) => updateFormData({ bio: e.target.value })}
              placeholder="Share your experience, qualifications, and approach to patient care..."
              className={`block w-full px-3 py-2 border ${errors.bio ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          ></textarea>
                    {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                    <p className="mt-1 text-sm text-gray-500">This will be displayed on your public profile (optional)</p>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalInfoForm;