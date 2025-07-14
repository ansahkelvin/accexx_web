'use client';

import React, { useEffect, useState} from 'react';
import {Calendar, Clock, CheckCircle, XCircle, Mail, User} from 'lucide-react';
import {fetchDashboard, fetchDoctorPatient} from "@/service/doctors/doctor";
import {AppointmentStats, IPatients} from "@/types/doctor";
import PatientProfileImage from "@/components/patient/Profile";
import Link from "next/link";


export default function DoctorDashboard() {

    const [dashboardData, setDashboardData] = useState<AppointmentStats | null>(null);
    const [patient, setPatient] = useState<IPatients[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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


    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try{
                const appointments = await fetchDashboard();
                if (appointments) {
                    setDashboardData(appointments)
                }
                console.log(appointments);
            }catch (e) {
                console.error(e);
            }
        }
        fetchAppointmentDetails().then()
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 text-sm">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-6">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-blue-50 border border-blue-100">
                                    <Calendar size={18} className="text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardData?.total_appointments || 0}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-green-50 border border-green-100">
                                    <CheckCircle size={18} className="text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Confirmed</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardData?.confirmed_appointments || 0}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-yellow-50 border border-yellow-100">
                                    <Clock size={18} className="text-yellow-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Pending</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardData?.pending_appointments || 0}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-red-50 border border-red-100">
                                    <XCircle size={18} className="text-red-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Canceled</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardData?.canceled_appointments || 0}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-purple-50 border border-purple-100">
                                    <CheckCircle size={18} className="text-purple-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Completed</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardData?.completed_appointments || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        {/* Appointments List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                        <h3 className="text-lg md:text-xl font-medium text-gray-500">All Patients</h3>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="bg-white rounded-lg shadow p-8 text-center">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                                        <p className="mt-4 text-gray-600">Loading patients...</p>
                                    </div>
                                ) : (
                                    <>
                                        {patient && patient.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                                                {patient.map(patient => (
                                                    <div
                                                        key={patient.id}
                                                        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
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
                                            <div className="flex items-center justify-center min-h-[300px] p-8">
                                                <div className="text-center">
                                                    <div className="mx-auto h-16 w-16 bg-blue-100 flex items-center justify-center rounded-full mb-4">
                                                        <User size={32} className="text-blue-600" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                        No patients yet
                                                    </h3>
                                                    <p className="text-gray-500 mb-6">
                                                        Start by accepting new appointments
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="px-4 py-3 border-t border-gray-100">
                                    <button className="w-full py-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                        <Link href={'/doctors/patients'}>
                                            View all patients
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}