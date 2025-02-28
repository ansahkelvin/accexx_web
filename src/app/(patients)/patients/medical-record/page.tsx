"use client"
import { useState, useRef } from 'react';
import {
    File, Upload, X, FilePlus, Share2,
     Download, MoreHorizontal,
    Image, FileText, FileIcon, FileSpreadsheet
} from 'lucide-react';

interface FileRecord {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadDate: string;
    status: 'uploaded' | 'shared' | 'pending' | 'error';
    sharedWith?: string[];
}

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    avatar: string;
}

export default function MedicalRecordsPage() {
    const [files, setFiles] = useState<FileRecord[]>([
        {
            id: '1',
            name: 'Blood Test Results.pdf',
            type: 'application/pdf',
            size: 2500000,
            uploadDate: '2025-01-15',
            status: 'uploaded'
        },
        {
            id: '2',
            name: 'X-Ray Scan.jpg',
            type: 'image/jpeg',
            size: 4800000,
            uploadDate: '2025-01-20',
            status: 'shared',
            sharedWith: ['Dr. Sarah Johnson']
        },
        {
            id: '3',
            name: 'Medical History.pdf',
            type: 'application/pdf',
            size: 1200000,
            uploadDate: '2025-02-05',
            status: 'uploaded'
        },
        {
            id: '4',
            name: 'Allergy Test Results.pdf',
            type: 'application/pdf',
            size: 1800000,
            uploadDate: '2025-02-10',
            status: 'uploaded'
        },
        {
            id: '5',
            name: 'Vaccination Record.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: 950000,
            uploadDate: '2025-02-15',
            status: 'shared',
            sharedWith: ['Dr. Michael Chen', 'Dr. Emily Rodriguez']
        }
    ]);

    const [doctors, setDoctors] = useState<Doctor[]>([
        { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', avatar: '/api/placeholder/40/40' },
        { id: '2', name: 'Dr. Michael Chen', specialty: 'Dermatologist', avatar: '/api/placeholder/40/40' },
        { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'Neurologist', avatar: '/api/placeholder/40/40' },
        { id: '4', name: 'Dr. James Wilson', specialty: 'Oncologist', avatar: '/api/placeholder/40/40' }
    ]);

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file upload
    const handleFileUpload = (uploadedFiles: FileList | null) => {
        if (!uploadedFiles) return;

        setIsUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            const newFiles = Array.from(uploadedFiles).map((file) => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type,
                size: file.size,
                uploadDate: new Date().toISOString().split('T')[0],
                status: 'uploaded' as const
            }));

            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setIsUploading(false);
        }, 1500);
    };

    // Handle file deletion
    const handleDeleteFile = (fileId: string) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        setSelectedFiles((prev) => prev.filter(id => id !== fileId));
    };

    // Handle batch delete
    const handleBatchDelete = () => {
        setFiles((prevFiles) =>
            prevFiles.filter((file) => !selectedFiles.includes(file.id))
        );
        setSelectedFiles([]);
    };

    // Handle file sharing
    const handleShareFiles = () => {
        if (selectedFiles.length === 0 || selectedDoctors.length === 0) return;

        const doctorNames = doctors
            .filter((doctor) => selectedDoctors.includes(doctor.id))
            .map((doctor) => doctor.name);

        setFiles((prevFiles) =>
            prevFiles.map((file) => {
                if (selectedFiles.includes(file.id)) {
                    return {
                        ...file,
                        status: 'shared',
                        sharedWith: file.sharedWith ?
                            [...new Set([...file.sharedWith, ...doctorNames])] :
                            doctorNames
                    };
                }
                return file;
            })
        );

        setShowShareModal(false);
        setSelectedDoctors([]);
    };

    // Format file size for display
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    // Get file icon based on file type
    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return <FileIcon className="h-5 w-5 text-red-500" />;
        if (fileType.includes('image')) return <Image className="h-5 w-5 text-blue-500" />;
        if (fileType.includes('document') || fileType.includes('word')) return <FileText className="h-5 w-5 text-blue-600" />;
        if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
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

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
                        <p className="text-sm text-gray-500">Upload and share your medical documents with healthcare providers</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={16} className="mr-2" /> Upload Files
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
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
                            <p className="mt-3 text-lg font-medium">No medical records yet</p>
                            <p className="text-sm mt-1 mb-4">Upload your medical documents to share with your healthcare providers</p>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-flex items-center"
                                onClick={() => fileInputRef.current?.click()}
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
                                        Sharing
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Added
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Size
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
                                                    {getFileIcon(file.type)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                                    <div className="text-xs text-gray-500 md:hidden">
                                                        {file.uploadDate}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell" onClick={(e) => toggleFileSelection(file.id, e)}>
                                            {file.status === 'shared' && file.sharedWith ? (
                                                <div className="flex items-center">
                                                    <div className="flex -space-x-2 mr-2">
                                                        {file.sharedWith.slice(0, 3).map((name, i) => (
                                                            <div key={i} className="h-6 w-6 rounded-full bg-blue-100 border border-white flex items-center justify-center text-xs text-blue-600">
                                                                {name.charAt(4)}
                                                            </div>
                                                        ))}
                                                        {file.sharedWith.length > 3 && (
                                                            <div className="h-6 w-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-gray-600">
                                                                +{file.sharedWith.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">{file.sharedWith.length} doctors</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-500">Only you</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell" onClick={(e) => toggleFileSelection(file.id, e)}>
                                            {file.uploadDate}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell" onClick={(e) => toggleFileSelection(file.id, e)}>
                                            {formatFileSize(file.size)}
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
                                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        <Download size={14} className="inline mr-2" />
                                                        Download
                                                    </button>
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
                                                    <img
                                                        src={doctor.avatar}
                                                        alt={doctor.name}
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