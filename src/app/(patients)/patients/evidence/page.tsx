"use client"
import { useState, useRef, useEffect } from 'react';
import {
    File, Upload, X, FilePlus, Share2,
    Download, MoreHorizontal,
    Image, FileText, FileIcon, FileSpreadsheet
} from 'lucide-react';
import {fetchMedicalFiles, uploadMedical} from "@/app/actions/medical";

export interface FileRecord {
    id: string;
    name: string;
    description: string;
    file_url: string;
    uploaded_at: string;
    doctor_id: string | null;
    patient_id: string;
    created_at: string;
    updated_at: string;
}

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    avatar: string;
}

export default function MedicalRecordsPage() {
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [doctors] = useState<Doctor[]>([]);

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [uploadFormData, setUploadFormData] = useState({ name: '', description: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch medical files on component mount
    useEffect(() => {
        const loadFiles = async () => {
            try {
                const fetchedFiles = await fetchMedicalFiles();
                if (fetchedFiles) {
                    setFiles(fetchedFiles);
                }
            } catch (error) {
                console.error("Failed to load medical files:", error);
            }
        };

        loadFiles();
    }, []);

    // Handle file upload
    const handleFileUpload = async (uploadedFiles: FileList | null) => {
        if (!uploadedFiles || uploadedFiles.length === 0) return;

        setIsUploading(true);

        try {
            const file = uploadedFiles[0]; // For now, handle one file at a time

            // You might want to prompt for name/description here
            // For simplicity, we'll use file name if not provided
            const name = uploadFormData.name || file.name;
            const description = uploadFormData.description || 'Uploaded medical record';

            await uploadMedical({
                document: file,
                name,
                description
            });

          

            // Reset form data
            setUploadFormData({ name: '', description: '' });

        } catch (error) {
            console.error("Error uploading file:", error);
            // Show error notification here
        } finally {
            setIsUploading(false);
        }
    };

    // Handle file deletion - this would need to connect to your API
    const handleDeleteFile = (fileId: string) => {
        // TODO: Add API call to delete file
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        setSelectedFiles((prev) => prev.filter(id => id !== fileId));
    };

    // Handle batch delete - this would need to connect to your API
    const handleBatchDelete = () => {
        // TODO: Add API call to delete multiple files
        setFiles((prevFiles) =>
            prevFiles.filter((file) => !selectedFiles.includes(file.id))
        );
        setSelectedFiles([]);
    };

    // Handle file sharing - this would need to connect to your API
    const handleShareFiles = () => {
        if (selectedFiles.length === 0 || selectedDoctors.length === 0) return;

        // TODO: Add API call to share files with doctors

        setShowShareModal(false);
        setSelectedDoctors([]);
    };

    // Format file size for display
   
    // Format date for display
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString();
    };

    // Get file icon based on file URL or name
    const getFileIcon = (fileUrl: string, fileName: string) => {
        const fileType = fileName.toLowerCase();

        if (fileType.includes('.pdf')) return <FileIcon className="h-5 w-5 text-red-500" />;
        if (fileType.includes('.jpg') || fileType.includes('.jpeg') || fileType.includes('.png'))
            return <Image className="h-5 w-5 text-blue-500" />;
        if (fileType.includes('.doc') || fileType.includes('.docx'))
            return <FileText className="h-5 w-5 text-blue-600" />;
        if (fileType.includes('.xls') || fileType.includes('.xlsx'))
            return <FileSpreadsheet className="h-5 w-5 text-green-600" />;

        return <File className="h-5 w-5 text-gray-500" />;
    };

    // Handle file selection
    const toggleFileSelection = (fileId: string, e: React.MouseEvent) => {
        if (e.ctrlKey || e.metaKey) {
            // Add or remove from selection
            setSelectedFiles(prev =>
                prev.includes(fileId)
                    ? prev.filter(id => id !== fileId)
                    : [...prev, fileId]
            );
        } else {
            // Select only this file
            setSelectedFiles(prev =>
                prev.includes(fileId) && prev.length === 1
                    ? []
                    : [fileId]
            );
        }
    };

    // Toggle doctor selection for sharing
    const toggleDoctorSelection = (doctorId: string) => {
        setSelectedDoctors((prev) =>
            prev.includes(doctorId)
                ? prev.filter(id => id !== doctorId)
                : [...prev, doctorId]
        );
    };

    // Handle drag and drop events
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    // Toggle dropdown menu
    const toggleDropdown = (fileId: string) => {
        setActiveDropdown(prev => prev === fileId ? null : fileId);
    };

    // Select all files
    const selectAllFiles = () => {
        if (selectedFiles.length === files.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(files.map(file => file.id));
        }
    };

    // Open upload modal with form
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleUploadClick = () => {
        setShowUploadModal(true);
    };

    const submitUploadForm = () => {
        if (fileInputRef.current?.files) {
            handleFileUpload(fileInputRef.current.files);
            setShowUploadModal(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Evidence</h1>
                        <p className="text-sm text-gray-500">Upload and share your medical documents with healthcare providers</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                            onClick={handleUploadClick}
                        >
                            <Upload size={16} className="mr-2" /> Upload Files
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.files && submitUploadForm()}
                        />
                    </div>
                </div>

                {/* Actions bar - visible when files are selected */}
                {selectedFiles.length > 0 && (
                    <div className="bg-blue-50 p-2 border-b border-gray-200 flex items-center">
                        <span className="ml-2 text-sm text-gray-700">
                          {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
                        </span>
                        <div className="ml-auto flex gap-2">
                            <button
                                className="px-3 py-1.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                                onClick={() => setShowShareModal(true)}
                            >
                                <Share2 size={14} className="mr-1" /> Share
                            </button>
                            <button
                                className="px-3 py-1.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                                onClick={handleBatchDelete}
                            >
                                <X size={14} className="mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                )}

                {/* Upload progress indicator */}
                {isUploading && (
                    <div className="p-3 bg-blue-50 border-b border-gray-200">
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm text-gray-700">Uploading files...</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-blue-600 h-1.5 rounded-full w-2/3 animate-pulse"></div>
                        </div>
                    </div>
                )}

                {/* File list - Dropbox style */}
                <div
                    className="overflow-y-auto max-h-[calc(100vh-240px)]"
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                >
                    {files.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <FilePlus className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-3 text-lg font-medium">No evidence yet</p>
                            <p className="text-sm mt-1 mb-4">Upload your medical documents to share with your healthcare providers</p>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-flex items-center"
                                onClick={handleUploadClick}
                            >
                                <Upload size={16} className="mr-2" /> Upload Files
                            </button>
                        </div>
                    ) : (
                        <div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            checked={selectedFiles.length === files.length && files.length > 0}
                                            onChange={selectAllFiles}
                                        />
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Description
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Uploaded
                                    </th>
                                    <th scope="col" className="relative px-4 py-3 w-10">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {files.map((file) => (
                                    <tr
                                        key={file.id}
                                        className={`hover:bg-gray-50 ${selectedFiles.includes(file.id) ? 'bg-blue-50' : ''}`}
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                checked={selectedFiles.includes(file.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setSelectedFiles(prev =>
                                                        checked
                                                            ? [...prev, file.id]
                                                            : prev.filter(id => id !== file.id)
                                                    );
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => toggleFileSelection(file.id, e)}>
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 mr-3">
                                                    {getFileIcon(file.file_url, file.name)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                                    <div className="text-xs text-gray-500 md:hidden">
                                                        {formatDate(file.uploaded_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell" onClick={(e) => toggleFileSelection(file.id, e)}>
                                            <div className="text-sm text-gray-900 truncate max-w-xs">
                                                {file.description || "No description"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell" onClick={(e) => toggleFileSelection(file.id, e)}>
                                            {formatDate(file.uploaded_at)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium relative">
                                            <button
                                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                onClick={() => toggleDropdown(file.id)}
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>

                                            {activeDropdown === file.id && (
                                                <div className="absolute right-10 top-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => {
                                                            setSelectedFiles([file.id]);
                                                            setShowShareModal(true);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        <Share2 size={14} className="inline mr-2" />
                                                        Share
                                                    </button>
                                                    <a
                                                        href={file.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <Download size={14} className="inline mr-2" />
                                                        Download
                                                    </a>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        onClick={() => {
                                                            handleDeleteFile(file.id);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        <X size={14} className="inline mr-2" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Upload Evidence
                            </h3>
                            <button
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => setShowUploadModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="file-name" className="block text-sm font-medium text-gray-700">
                                    File Name
                                </label>
                                <input
                                    type="text"
                                    id="file-name"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={uploadFormData.name}
                                    onChange={(e) => setUploadFormData({...uploadFormData, name: e.target.value})}
                                    placeholder="Enter file name"
                                />
                            </div>

                            <div>
                                <label htmlFor="file-description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="file-description"
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={uploadFormData.description}
                                    onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                                    placeholder="Describe this medical record"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Select File
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            // If no name provided, use the file name
                                                            if (!uploadFormData.name) {
                                                                setUploadFormData({
                                                                    ...uploadFormData,
                                                                    name: e.target.files[0].name
                                                                });
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PDF, DOC, JPG, PNG up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-3 justify-end">
                            <button
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                onClick={() => setShowUploadModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={() => {
                                    fileInputRef.current?.click();
                                }}
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Share Medical {selectedFiles.length === 1 ? "Record" : "Records"}
                            </h3>
                            <button
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => {
                                    setShowShareModal(false);
                                    setSelectedDoctors([]);
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-4">
                                Select doctors you want to share {selectedFiles.length === 1
                                ? `"${files.find(f => f.id === selectedFiles[0])?.name}" with:`
                                : `${selectedFiles.length} files with:`
                            }
                            </p>

                            <div className="max-h-60 overflow-y-auto">
                                <ul className="divide-y divide-gray-200">
                                    {doctors.map((doctor) => (
                                        <li key={doctor.id} className="py-3">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`doctor-${doctor.id}`}
                                                    checked={selectedDoctors.includes(doctor.id)}
                                                    onChange={() => toggleDoctorSelection(doctor.id)}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor={`doctor-${doctor.id}`} className="ml-3 flex items-center cursor-pointer">
                                                    {/* eslint-disable @next/next/no-img-element */}

                                                    <img
                                                        src={doctor.avatar}
                                                        alt={""}
                                                        className="h-8 w-8 rounded-full mr-3"
                                                    />
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-900 block">{doctor.name}</span>
                                                        <span className="text-xs text-gray-500">{doctor.specialty}</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-6 flex space-x-3 justify-end">
                                <button
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                    onClick={() => {
                                        setShowShareModal(false);
                                        setSelectedDoctors([]);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                                        selectedDoctors.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onClick={handleShareFiles}
                                    disabled={selectedDoctors.length === 0}
                                >
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Drag overlay */}
            {dragActive && (
                <div
                    className="fixed inset-0 bg-blue-500 bg-opacity-10 z-50 flex items-center justify-center"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                        <Upload className="mx-auto h-12 w-12 text-blue-500" />
                        <p className="mt-4 text-lg font-medium text-gray-900">Drop your files here</p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB</p>
                    </div>
                </div>
            )}
        </div>
    );
}