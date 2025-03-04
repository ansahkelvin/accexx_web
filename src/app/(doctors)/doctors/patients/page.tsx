'use client';

import React, { useState } from 'react';
import { Search, User, Plus, Phone, Mail, Calendar, Clock, FileText, MoreHorizontal } from 'lucide-react';

// TypeScript interfaces
interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    bloodType?: string;
    lastVisit: string;
    upcomingAppointment?: string;
    medicalConditions?: string[];
    assignedDoctor?: string;
    status: 'active' | 'inactive';
    insuranceProvider?: string;
    notes?: string;
}

export default function PatientsPage() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // Sample patient data - would come from API in real app
    const patients: Patient[] = [
        {
            id: 1,
            name: "Emma Johnson",
            email: "emma.j@example.com",
            phone: "+1 (555) 123-4567",
            age: 34,
            gender: "Female",
            bloodType: "O+",
            lastVisit: "Jan 15, 2025",
            upcomingAppointment: "Feb 28, 2025 - 09:00 AM",
            medicalConditions: ["Hypertension", "Asthma"],
            assignedDoctor: "Dr. Smith",
            status: "active",
            insuranceProvider: "BlueCross",
            notes: "Patient has a family history of heart disease"
        },
        {
            id: 2,
            name: "Michael Chen",
            email: "m.chen@example.com",
            phone: "+1 (555) 234-5678",
            age: 42,
            gender: "Male",
            bloodType: "A-",
            lastVisit: "Dec 10, 2024",
            upcomingAppointment: "Feb 28, 2025 - 10:30 AM",
            medicalConditions: ["Migraine", "Anxiety"],
            assignedDoctor: "Dr. Smith",
            status: "active",
            insuranceProvider: "Aetna"
        },
        {
            id: 3,
            name: "Sarah Williams",
            email: "sarah.w@example.com",
            phone: "+1 (555) 345-6789",
            age: 29,
            gender: "Female",
            bloodType: "B+",
            lastVisit: "Feb 05, 2025",
            upcomingAppointment: "Feb 28, 2025 - 01:00 PM",
            medicalConditions: ["Allergies"],
            assignedDoctor: "Dr. Smith",
            status: "active",
            insuranceProvider: "United Healthcare"
        },
        {
            id: 4,
            name: "Robert Davis",
            email: "r.davis@example.com",
            phone: "+1 (555) 456-7890",
            age: 56,
            gender: "Male",
            bloodType: "AB+",
            lastVisit: "Jan 30, 2025",
            upcomingAppointment: "Feb 28, 2025 - 02:30 PM",
            medicalConditions: ["Diabetes Type 2", "Arthritis"],
            assignedDoctor: "Dr. Smith",
            status: "active",
            insuranceProvider: "Medicare",
            notes: "Post-surgery follow-up for knee replacement"
        },
        {
            id: 5,
            name: "James Wilson",
            email: "j.wilson@example.com",
            phone: "+1 (555) 567-8901",
            age: 38,
            gender: "Male",
            bloodType: "O-",
            lastVisit: "Dec 22, 2024",
            upcomingAppointment: "Mar 15, 2025 - 11:30 AM",
            medicalConditions: ["GERD", "Sleep Apnea"],
            assignedDoctor: "Dr. Smith",
            status: "inactive",
            insuranceProvider: "Cigna"
        },
        {
            id: 6,
            name: "Patricia Moore",
            email: "p.moore@example.com",
            phone: "+1 (555) 678-9012",
            age: 62,
            gender: "Female",
            bloodType: "A+",
            lastVisit: "Feb 10, 2025",
            upcomingAppointment: "Mar 1, 2025 - 09:30 AM",
            medicalConditions: ["Diabetes Type 1", "Hypertension"],
            assignedDoctor: "Dr. Smith",
            status: "active",
            insuranceProvider: "Medicare",
            notes: "Regular checkup for blood sugar monitoring"
        },
        {
            id: 7,
            name: "Jennifer Taylor",
            email: "j.taylor@example.com",
            phone: "+1 (555) 789-0123",
            age: 27,
            gender: "Female",
            bloodType: "B-",
            lastVisit: "Feb 18, 2025",
            upcomingAppointment: "Mar 1, 2025 - 11:00 AM",
            medicalConditions: ["Asthma"],
            assignedDoctor: "Dr. Smith",
            status: "active",
            insuranceProvider: "Aetna"
        },
        {
            id: 8,
            name: "Thomas Anderson",
            email: "t.anderson@example.com",
            phone: "+1 (555) 890-1234",
            age: 45,
            gender: "Male",
            bloodType: "O+",
            lastVisit: "Jan 20, 2025",
            upcomingAppointment: "Mar 1, 2025 - 03:30 PM",
            medicalConditions: ["Chronic Lower Back Pain", "Insomnia"],
            assignedDoctor: "Dr. Smith",
            status: "active",
            insuranceProvider: "BlueCross",
            notes: "Using physical therapy for back pain management"
        },
        {
            id: 9,
            name: "Linda Martinez",
            email: "l.martinez@example.com",
            phone: "+1 (555) 901-2345",
            age: 58,
            gender: "Female",
            bloodType: "AB-",
            lastVisit: "Feb 27, 2025",
            upcomingAppointment: "Mar 20, 2025 - 01:45 PM",
            medicalConditions: ["Hypertension", "High Cholesterol"],
            assignedDoctor: "Dr. Smith",
            status: "active",
            insuranceProvider: "Medicare"
        },
        {
            id: 10,
            name: "David Brown",
            email: "d.brown@example.com",
            phone: "+1 (555) 012-3456",
            age: 32,
            gender: "Male",
            bloodType: "A+",
            lastVisit: "Feb 27, 2025",
            medicalConditions: ["Seasonal Allergies"],
            assignedDoctor: "Dr. Smith",
            status: "inactive",
            insuranceProvider: "United Healthcare",
            notes: "Patient requested to be contacted only via email"
        }
    ];

    // Filter patients based on status and search query
    const filteredPatients = patients.filter(patient => {
        // Filter by status
        const statusMatch =
            selectedFilter === 'all' ||
            (selectedFilter === 'active' && patient.status === 'active') ||
            (selectedFilter === 'inactive' && patient.status === 'inactive');

        // Filter by search query
        const searchMatch =
            searchQuery === '' ||
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.phone.includes(searchQuery);

        return statusMatch && searchMatch;
    });

    // Handle patient selection for detail view
    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    // Close patient detail view
    const closePatientDetail = () => {
        setSelectedPatient(null);
    };

    return (
        <div className="relative p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded-md border ${currentView === 'grid' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700'}`}
                            onClick={() => setCurrentView('grid')}
                        >
                            Grid
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md border ${currentView === 'list' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700'}`}
                            onClick={() => setCurrentView('list')}
                        >
                            List
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1">
                            <Plus size={16} />
                            <span>Add Patient</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-4 py-2 rounded-md ${selectedFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setSelectedFilter('all')}
                    >
                        All Patients
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${selectedFilter === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setSelectedFilter('active')}
                    >
                        Active
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${selectedFilter === 'inactive' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setSelectedFilter('inactive')}
                    >
                        Inactive
                    </button>
                </div>
            </div>

            {/* Patient Listing */}
            {filteredPatients.length > 0 ? (
                currentView === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPatients.map(patient => (
                            <div
                                key={patient.id}
                                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                                onClick={() => handlePatientSelect(patient)}
                            >
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                            <User size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-900">{patient.name}</h3>
                                            <p className="text-sm text-gray-500">{patient.age} years, {patient.gender}</p>
                                        </div>
                                        <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                                            patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                      {patient.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Phone size={16} className="mr-2" />
                                            <span>{patient.phone}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Mail size={16} className="mr-2" />
                                            <span>{patient.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar size={16} className="mr-2" />
                                            <span>Last visit: {patient.lastVisit}</span>
                                        </div>
                                        {patient.upcomingAppointment && (
                                            <div className="flex items-center text-gray-600">
                                                <Clock size={16} className="mr-2" />
                                                <span>Upcoming: {patient.upcomingAppointment.split(' - ')[0]}</span>
                                            </div>
                                        )}
                                    </div>

                                    {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                                        <div className="mt-4">
                                            <div className="flex flex-wrap gap-1">
                                                {patient.medicalConditions.slice(0, 2).map((condition, idx) => (
                                                    <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {condition}
                          </span>
                                                ))}
                                                {patient.medicalConditions.length > 2 && (
                                                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            +{patient.medicalConditions.length - 2} more
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="py-3 px-6 bg-gray-50 rounded-b-lg">
                                    <button className="w-full text-blue-600 text-sm font-medium">
                                        View Full Profile
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
                                    <div className="col-span-2">Contact</div>
                                    <div className="col-span-2">Last Visit</div>
                                    <div className="col-span-2">Medical Info</div>
                                    <div className="col-span-1">Status</div>
                                    <div className="col-span-1">Actions</div>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {filteredPatients.map((patient) => (
                                    <div
                                        key={patient.id}
                                        className="grid grid-cols-12 gap-2 px-6 py-4 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handlePatientSelect(patient)}
                                    >
                                        <div className="col-span-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                    <User size={18} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{patient.name}</div>
                                                    <div className="text-xs text-gray-500">{patient.age} years, {patient.gender}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">{patient.phone}</div>
                                            <div className="text-xs text-gray-500">{patient.email}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">{patient.lastVisit}</div>
                                            {patient.upcomingAppointment && (
                                                <div className="text-xs text-blue-600">Next: {patient.upcomingAppointment.split(' - ')[0]}</div>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            {patient.bloodType && (
                                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-1">
                          {patient.bloodType}
                        </span>
                                            )}
                                            {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                                                <span className="text-xs text-gray-500">
                          {patient.medicalConditions.length} conditions
                        </span>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                          patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {patient.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <button className="text-gray-400 hover:text-gray-500">
                                                <MoreHorizontal size={18} />
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
                    <div className="mx-auto h-16 w-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
                        <User size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                    <p className="text-gray-500 mb-6">There are no patients matching your search criteria.</p>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={() => {
                            setSelectedFilter('all');
                            setSearchQuery('');
                        }}
                    >
                        Reset filters
                    </button>
                </div>
            )}

            {/* Patient Detail Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-semibold text-gray-800">Patient Details</h2>
                            <button
                                className="text-gray-400 hover:text-gray-500"
                                onClick={closePatientDetail}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Patient Header */}
                            <div className="flex flex-col md:flex-row md:items-center mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center mb-4 md:mb-0">
                                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <User size={32} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl text-gray-900">{selectedPatient.name}</h3>
                                        <p className="text-gray-600">{selectedPatient.age} years, {selectedPatient.gender}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 md:ml-auto">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Book Appointment
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                                        Edit Details
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                                        Send Message
                                    </button>
                                </div>
                            </div>

                            {/* Patient Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                                {/* Contact Information */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                                                <Phone size={18} />
                                            </div>
                                            <div className="ml-3 text-gray-700">
                                                <p className="font-medium">Phone</p>
                                                <p>{selectedPatient.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                                                <Mail size={18} />
                                            </div>
                                            <div className="ml-3 text-gray-700">
                                                <p className="font-medium">Email</p>
                                                <p>{selectedPatient.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                                                <FileText size={18} />
                                            </div>
                                            <div className="ml-3 text-gray-700">
                                                <p className="font-medium">Insurance</p>
                                                <p>{selectedPatient.insuranceProvider || 'Not available'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">Medical Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3 text-gray-700">
                                                <p className="font-medium">Blood Type</p>
                                                <p>{selectedPatient.bloodType || 'Not available'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3 text-gray-700">
                                                <p className="font-medium">Medical Conditions</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {selectedPatient.medicalConditions?.map((condition, idx) => (
                                                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {condition}
                            </span>
                                                    )) || 'None reported'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                                                <User size={18} />
                                            </div>
                                            <div className="ml-3 text-gray-700">
                                                <p className="font-medium">Assigned Doctor</p>
                                                <p>{selectedPatient.assignedDoctor || 'Not assigned'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment History */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">Appointment History</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                                                <Calendar size={18} />
                                            </div>
                                            <div className="ml-3 text-gray-700">
                                                <p className="font-medium">Last Visit</p>
                                                <p>{selectedPatient.lastVisit}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                                                <Clock size={18} />
                                            </div>
                                            <div className="ml-3 text-gray-700">
                                                <p className="font-medium">Upcoming Appointment</p>
                                                <p>{selectedPatient.upcomingAppointment || 'None scheduled'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">Notes</h4>
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <p className="text-gray-700">{selectedPatient.notes || 'No notes available for this patient.'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Actions */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-1">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Medical Records</span>
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-1">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>Prescription History</span>
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-1">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Lab Results</span>
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-1">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span>Set Reminder</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
