import React from 'react';
import { CheckCircle, User, Mail, Calendar, Award, BookOpen, MapPin, Clipboard, AlertCircle } from 'lucide-react';
import Image from "next/image";

interface ConfirmationStepProps {
    formData: {
        name: string;
        email: string;
        dateOfBirth: string;
        gmc_number: string;
        specialization: string;
        bio: string;
        work_address: string;
        work_address_latitude: number;
        work_address_longitude: number;
    };
    imagePreview: string | null;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ formData, imagePreview }) => {
    // Format date of birth for display
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not provided';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            
            return dateString;
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Review Your Information</h2>
                <p className="mt-2 text-gray-600">Please verify all details before completing your registration</p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-400 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-emerald-800">
                            All steps completed! Please review your information below before submitting.
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center">
                {imagePreview ? (
                    <div className="relative">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                                width={800}
                                height={800}
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-indigo-100 rounded-full p-2 border-2 border-white shadow-md">
                            <CheckCircle className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center shadow-inner">
                        <span className="text-gray-500 text-3xl font-bold">
                            {formData.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Details Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-md border border-indigo-50 transition-all duration-300 hover:shadow-lg">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
                        <h3 className="font-semibold text-white flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Personal Details
                        </h3>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="flex border-b border-gray-100 pb-3">
                            <div className="w-10 flex-shrink-0 text-indigo-500">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Name</div>
                                <div className="font-medium text-gray-900">{formData.name || 'Not provided'}</div>
                            </div>
                        </div>

                        <div className="flex border-b border-gray-100 pb-3">
                            <div className="w-10 flex-shrink-0 text-indigo-500">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Email</div>
                                <div className="font-medium text-gray-900">{formData.email || 'Not provided'}</div>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="w-10 flex-shrink-0 text-indigo-500">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Date of Birth</div>
                                <div className="font-medium text-gray-900">{formatDate(formData.dateOfBirth)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Details Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-md border border-indigo-50 transition-all duration-300 hover:shadow-lg">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
                        <h3 className="font-semibold text-white flex items-center">
                            <Award className="h-5 w-5 mr-2" />
                            Professional Details
                        </h3>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="flex border-b border-gray-100 pb-3">
                            <div className="w-10 flex-shrink-0 text-indigo-500">
                                <Clipboard className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">GMC Number</div>
                                <div className="font-medium text-gray-900">{formData.gmc_number || 'Not provided'}</div>
                            </div>
                        </div>

                        <div className="flex border-b border-gray-100 pb-3">
                            <div className="w-10 flex-shrink-0 text-indigo-500">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Specialization</div>
                                <div className="font-medium text-gray-900">{formData.specialization || 'Not provided'}</div>
                            </div>
                        </div>

                        {formData.bio && (
                            <div className="flex">
                                <div className="w-10 flex-shrink-0 text-indigo-500">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Bio</div>
                                    <div className="font-medium text-gray-900">
                                        {formData.bio.length > 100
                                            ? <>{formData.bio.substring(0, 100)}... <span className="text-indigo-500 text-sm cursor-pointer hover:underline">Read more</span></>
                                            : formData.bio
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Work Location Card - Full Width */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-indigo-50 transition-all duration-300 hover:shadow-lg">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3">
                    <h3 className="font-semibold text-white flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Work Location
                    </h3>
                </div>

                <div className="p-5">
                    <div className="mb-4">
                        <div className="text-sm font-medium text-gray-500">Address</div>
                        <div className="font-medium text-gray-900 mt-1">{formData.work_address || 'Not provided'}</div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-sm text-blue-700 font-medium">GPS Coordinates</span>
                        </div>
                        <div className="font-mono text-sm text-blue-900 mt-1 pl-7">
                            Lat: {formData.work_address_latitude.toFixed(6)}, Lng: {formData.work_address_longitude.toFixed(6)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                        <div className="text-sm text-gray-500">
                            By clicking &#34;Complete Registration&#34;, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>. Your information will be verified before your account is activated.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationStep;