'use client';

import React, {useEffect, useState} from 'react';
import { Search, User} from 'lucide-react';
import {IPatients} from "@/types/doctor";
import {fetchDoctorPatient} from "@/service/doctors/doctor";
import PatientProfileImage from "@/components/patient/Profile";


// Patient Profile Image Component

const PatientsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
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

                 
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading patients...</p>
                </div>
            ) : filteredPatients && filteredPatients.length > 0 ? (
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

                                
                                </div>
                              
                            </div>
                        ))}
                    </div>
                ) 
             : (
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

         
        </div>
    );
};

export default PatientsPage;