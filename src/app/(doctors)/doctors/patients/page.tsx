'use client';

import React, {useEffect, useState} from 'react';
import { Search, User,Mail, Calendar, MoreHorizontal} from 'lucide-react';
import {IPatients} from "@/types/doctor";
import {fetchDoctorPatient} from "@/service/doctors/doctor";

interface PatientProfileImageProps {
    imageUrl: string;
    name: string;
    size?: 'sm' | 'md' | 'lg';
}

// Patient Profile Image Component
const PatientProfileImage: React.FC<PatientProfileImageProps> = ({ imageUrl, name, size = 'md' }) => {
    // Size classes for different display options
    const sizeClasses: Record<string, string> = {
        sm: "h-10 w-10",
        md: "h-12 w-12",
        lg: "h-16 w-16"
    };

    const iconSizes: Record<string, number> = {
        sm: 18,
        md: 24,
        lg: 32
    };

    // Determine the correct size class
    const sizeClass = sizeClasses[size] || sizeClasses.md;
    const iconSize = iconSizes[size] || iconSizes.md;

    // If there's a valid profile image, display it
    if (imageUrl && imageUrl !== "null" && !imageUrl.includes("undefined")) {
        return (
            <div className={`${sizeClass} rounded-full overflow-hidden border-2 border-blue-100`}>
                <img
                    src={imageUrl}
                    alt={`${name}'s profile`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // If image fails to load, replace with user icon
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentNode as HTMLElement;
                        if (parent) {
                            parent.classList.add('bg-blue-100');
                            parent.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                        }
                    }}
                />
            </div>
        );
    }

    // Fallback to user icon
    return (
        <div className={`${sizeClass} rounded-full bg-blue-100 flex items-center justify-center`}>
            <User size={iconSize} className="text-blue-600" />
        </div>
    );
};

const PatientsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
    const [patient, setPatient] = useState<IPatients[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [selectedPatient, setSelectedPatient] = useState<IPatients | null>(null);

    useEffect(() => {
        const fetchPatients = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const response = await fetchDoctorPatient();
                console.log(response);
                if (response !== null) {
                    setPatient(response);
                }
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Filter patients based on search query
    const filteredPatients = patient ?
        patient.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [];

    // const openPatientDetail = (patient: IPatients): void => {
    //     setSelectedPatient(patient);
    // };

    // const closePatientDetail = (): void => {
    //     setSelectedPatient(null);
    // };

    return (
        <div className="relative p-6 bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Patients</h1>
                <p className="text-gray-600">Manage and view your patient records</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search patients by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="flex bg-gray-100 rounded-md p-1">
                            <button
                                className={`px-4 py-2 rounded-md ${currentView === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                                onClick={() => setCurrentView('grid')}
                            >
                                Grid
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${currentView === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                                onClick={() => setCurrentView('list')}
                            >
                                List
                            </button>
                        </div>

                        
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading patients...</p>
                </div>
            ) : filteredPatients && filteredPatients.length > 0 ? (
                currentView === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPatients.map(patient => (
                            <div
                                key={patient.id}
                                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                                // onClick={() => openPatientDetail(patient)}
                            >
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <PatientProfileImage
                                            imageUrl={patient.profile_image!}
                                            name={patient.name}
                                            size="md"
                                        />
                                        <div className="ml-4">
                                            <h3 className="font-medium text-lg text-gray-900">{patient.name}</h3>
                                            <p className="text-sm text-gray-500">Patient ID: {patient.id.substring(0, 8)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Mail size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                                            <span className="truncate">{patient.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                                            <span>No appointments yet</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-3 px-6 bg-gray-50 rounded-b-lg flex justify-between items-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="min-w-full divide-y divide-gray-200">
                            <div className="bg-gray-50">
                                <div className="grid grid-cols-12 gap-2 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="col-span-4">Patient</div>
                                    <div className="col-span-4">Email</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-2 text-right">Actions</div>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {filteredPatients.map((patient) => (
                                    <div
                                        key={patient.id}
                                        className="grid grid-cols-12 gap-2 px-6 py-4 hover:bg-gray-50 cursor-pointer"
                                        // onClick={() => openPatientDetail(patient)}
                                    >
                                        <div className="col-span-4">
                                            <div className="flex items-center">
                                                <PatientProfileImage
                                                    imageUrl={patient.profile_image!}
                                                    name={patient.name}
                                                    size="sm"
                                                />
                                                <div className="ml-3">
                                                    <div className="font-medium text-gray-900">{patient.name}</div>
                                                    <div className="text-xs text-gray-500">ID: {patient.id.substring(0, 8)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-4 flex items-center">
                                            <Mail size={16} className="text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600 truncate">{patient.email}</span>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex justify-end items-center gap-2">
                                            <button
                                                className="p-1 rounded-full hover:bg-gray-200"
                                                title="View profile"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // openPatientDetail(patient);
                                                }}
                                            >
                                                <User size={18} className="text-blue-600" />
                                            </button>
                                            <button
                                                className="p-1 rounded-full hover:bg-gray-200"
                                                title="Schedule appointment"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Calendar size={18} className="text-blue-600" />
                                            </button>
                                            <button
                                                className="p-1 rounded-full hover:bg-gray-200"
                                                title="More options"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreHorizontal size={18} className="text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                // Empty state
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-100 flex items-center justify-center rounded-full mb-4">
                        <User size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchQuery ? 'No matching patients found' : 'No patients yet'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchQuery
                            ? 'Try adjusting your search criteria or clear the search to see all patients.'
                            : 'Start by adding your first patient to the system.'}
                    </p>
                    {searchQuery && (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            onClick={() => setSearchQuery('')}
                        >
                            Clear Search
                        </button>
                    )
                    }
                </div>
            )}

            {/* Patient Detail Modal */}
            {/*{selectedPatient && (*/}
            {/*    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">*/}
            {/*        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">*/}
            {/*            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">*/}
            {/*                <h2 className="text-xl font-semibold text-gray-800">Patient Details</h2>*/}
            {/*                <button*/}
            {/*                    className="text-gray-400 hover:text-gray-500"*/}
            {/*                    onClick={closePatientDetail}*/}
            {/*                >*/}
            {/*                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
            {/*                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />*/}
            {/*                    </svg>*/}
            {/*                </button>*/}
            {/*            </div>*/}
            
            {/*            <div className="p-6">*/}
            {/*                /!* Patient Header *!/*/}
            {/*                <div className="flex flex-col md:flex-row md:items-center mb-6 pb-6 border-b border-gray-200">*/}
            {/*                    <div className="flex items-center mb-4 md:mb-0">*/}
            {/*                        <PatientProfileImage*/}
            {/*                            imageUrl={selectedPatient.profile_image!}*/}
            {/*                            name={selectedPatient.name}*/}
            {/*                            size="lg"*/}
            {/*                        />*/}
            {/*                        <div className="ml-4">*/}
            {/*                            <h3 className="font-semibold text-xl text-gray-900">{selectedPatient.name}</h3>*/}
            {/*                            <p className="text-gray-500">Patient ID: {selectedPatient.id.substring(0, 8)}</p>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            
            {/*                    <div className="flex flex-wrap gap-2 md:ml-auto">*/}
            {/*                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1">*/}
            {/*                            <Calendar size={16} />*/}
            {/*                            <span>Book Appointment</span>*/}
            {/*                        </button>*/}
            {/*                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">*/}
            {/*                            Edit Details*/}
            {/*                        </button>*/}
            {/*                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">*/}
            {/*                            Send Message*/}
            {/*                        </button>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            
            {/*                /!* Patient Information Grid *!/*/}
            {/*                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">*/}
            {/*                    /!* Contact Information *!/*/}
            {/*                    <div>*/}
            {/*                        <h4 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h4>*/}
            {/*                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">*/}
            {/*                            <div className="flex items-start">*/}
            {/*                                <div className="flex-shrink-0 h-6 w-6 text-gray-400">*/}
            {/*                                    <Phone size={18} />*/}
            {/*                                </div>*/}
            {/*                                <div className="ml-3 text-gray-700">*/}
            {/*                                    <p className="font-medium">Phone</p>*/}
            {/*                                    <p className="text-gray-500">Not available</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="flex items-start">*/}
            {/*                                <div className="flex-shrink-0 h-6 w-6 text-gray-400">*/}
            {/*                                    <Mail size={18} />*/}
            {/*                                </div>*/}
            {/*                                <div className="ml-3 text-gray-700">*/}
            {/*                                    <p className="font-medium">Email</p>*/}
            {/*                                    <p>{selectedPatient.email}</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="flex items-start">*/}
            {/*                                <div className="flex-shrink-0 h-6 w-6 text-gray-400">*/}
            {/*                                    <FileText size={18} />*/}
            {/*                                </div>*/}
            {/*                                <div className="ml-3 text-gray-700">*/}
            {/*                                    <p className="font-medium">Address</p>*/}
            {/*                                    <p className="text-gray-500">Not available</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            
            {/*                    /!* Appointment Information *!/*/}
            {/*                    <div>*/}
            {/*                        <h4 className="text-lg font-medium text-gray-800 mb-4">Appointments</h4>*/}
            {/*                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">*/}
            {/*                            <div className="flex items-start">*/}
            {/*                                <div className="flex-shrink-0 h-6 w-6 text-gray-400">*/}
            {/*                                    <Calendar size={18} />*/}
            {/*                                </div>*/}
            {/*                                <div className="ml-3 text-gray-700">*/}
            {/*                                    <p className="font-medium">Last Visit</p>*/}
            {/*                                    <p className="text-gray-500">No previous visits</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="flex items-start">*/}
            {/*                                <div className="flex-shrink-0 h-6 w-6 text-gray-400">*/}
            {/*                                    <Clock size={18} />*/}
            {/*                                </div>*/}
            {/*                                <div className="ml-3 text-gray-700">*/}
            {/*                                    <p className="font-medium">Upcoming Appointment</p>*/}
            {/*                                    <p className="text-gray-500">None scheduled</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            
            {/*                /!* Notes Section *!/*/}
            {/*                <div className="mb-6">*/}
            {/*                    <h4 className="text-lg font-medium text-gray-800 mb-4">Notes</h4>*/}
            {/*                    <div className="bg-gray-50 p-4 rounded-lg">*/}
            {/*                        <p className="text-gray-700">No notes available for this patient.</p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            
            {/*                /!* Actions Footer *!/*/}
            {/*                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">*/}
            {/*                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-1">*/}
            {/*                        <FileText size={16} />*/}
            {/*                        <span>Medical Records</span>*/}
            {/*                    </button>*/}
            {/*                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-1">*/}
            {/*                        <Calendar size={16} />*/}
            {/*                        <span>Appointment History</span>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default PatientsPage;