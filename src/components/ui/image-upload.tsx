// components/registration/UploadImageForm.tsx
import React, { useRef, useState } from 'react';
import { Image, Upload, X } from 'lucide-react';

interface UploadImageFormProps {
    handleImageChange: (file: File) => void;
    imagePreview: string | null;
    errors: Record<string, string>;
}

const UploadImageForm: React.FC<UploadImageFormProps> = ({ handleImageChange, imagePreview, errors }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageChange(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageChange(file);
        }
    };

    const removeImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        handleImageChange(new File([], ''));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Image</h2>

            <div className="space-y-4">
                {!imagePreview ? (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-6 ${
                            isDragging
                                ? 'border-indigo-400 bg-indigo-50'
                                : errors.profile_image
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 hover:border-indigo-400'
                        } transition-colors duration-150 ease-in-out text-center`}
                    >
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Image className="h-12 w-12 text-gray-400" />
                            <div className="flex flex-col items-center text-sm text-gray-600">
                                <p className="font-medium">
                                    Drag and drop your photo here, or
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                                    >
                                        browse
                                    </button>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="relative border rounded-lg overflow-hidden">
                        <div className="flex justify-center p-4">
                            <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200">
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center p-3 bg-gray-50 border-t">
                            <button
                                type="button"
                                onClick={removeImage}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <X className="h-4 w-4 mr-1.5" />
                                Remove
                            </button>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="ml-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Upload className="h-4 w-4 mr-1.5" />
                                Change
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>
                )}

                {errors.profile_image && (
                    <p className="text-sm text-red-600">{errors.profile_image}</p>
                )}

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div>
                            <p className="text-sm text-yellow-700">
                                Your profile photo will be visible to patients. Choose a professional photo that clearly shows your face.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadImageForm;