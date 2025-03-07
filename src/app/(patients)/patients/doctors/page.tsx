'use client';

import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star, ChevronRight, Award, Stethoscope } from 'lucide-react';
import Image from "next/image";
import {
    fetchAllDoctors,
    fetchNearbyDoctors,
    fetchTopDoctors,
} from "@/app/actions/user";
import Link from "next/link";
import {AllDoctor, NearbyDoctor, TopDoctor} from "@/types/types";


export default function DoctorsPage() {
    // CSS for hiding scrollbars but enabling scroll
    const scrollbarHideStyles = `
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none; /* Chrome, Safari and Opera */
    }
  `;
    const [allDoctors, setAllDoctors] = useState<AllDoctor[]>([]);
    const [topDoctors, setTopDoctors] = useState<TopDoctor[]>([]);
    const [nearbyDoctors, setNearbyDoctors] = useState<NearbyDoctor[]>([]);

    // Loading states
    const [isLoading, setIsLoading] = useState({
        all: true,
        top: true,
        nearby: true
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Fetch all doctors
                setIsLoading(prev => ({ ...prev, all: true }));
                const allDoctorsData = await fetchAllDoctors();
                if (allDoctorsData) {
                    setAllDoctors(allDoctorsData.map(doctor => ({
                        ...doctor,
                        id: Math.random().toString(36).substring(2, 9), // Generate temporary ID
                        isFavorite: false
                    })));
                }
                setIsLoading(prev => ({ ...prev, all: false }));

                // Fetch top doctors
                setIsLoading(prev => ({ ...prev, top: true }));
                const topDoctorsData = await fetchTopDoctors();
                if (topDoctorsData) {
                    setTopDoctors(topDoctorsData.map(doctor => ({
                        ...doctor,
                        id: Math.random().toString(36).substring(2, 9), // Generate temporary ID
                    })));
                }
                setIsLoading(prev => ({ ...prev, top: false }));

                // Fetch nearby doctors
                setIsLoading(prev => ({ ...prev, nearby: true }));
                const nearbyDoctorsData = await fetchNearbyDoctors();
                if (nearbyDoctorsData) {
                    setNearbyDoctors(nearbyDoctorsData.map(doctor => ({
                        ...doctor,
                    })));
                }
                setIsLoading(prev => ({ ...prev, nearby: false }));
            } catch (error) {
                console.error("Error fetching doctors:", error);
                setIsLoading({ all: false, top: false, nearby: false });
            }
        };

        fetchDoctors();
    }, []);

    // Search state
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Selected specialty filter
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

    // Get unique specialties from all doctor lists
    const allSpecialties = new Set([
        ...allDoctors.map(doctor => doctor.specialization),
        ...topDoctors.map(doctor => doctor.specialization),
        ...nearbyDoctors.map(doctor => doctor.specialization)
    ]);
    const specialties = ['All', ...Array.from(allSpecialties)];

    // Filter doctors based on search and specialty
    const filteredDoctors = allDoctors.filter(doctor => {
        const matchesSearch = searchTerm.trim() === '' ||
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.work_address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSpecialty = selectedSpecialty === 'All' ||
            doctor.specialization === selectedSpecialty;

        return matchesSearch && matchesSpecialty;
    });

    return (
        <div className="min-h-screen ">
            <style jsx global>{scrollbarHideStyles}</style>

            {/* Header with modern purple */}
            <header className="bg-[#9871ff] py-6">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-2xl font-medium text-white">Find Your Doctor</h1>

                    {/* Search bar */}
                    <div className="mt-6 flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search doctors, specialties..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 border border-white rounded bg-white text-gray-800 placeholder-gray-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        </div>
                        <button className="bg-[#8461ee] text-white px-6 py-2 rounded border border-white hover:bg-[#7451de] transition-colors">
                            Search
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-6xl py-6 ">
                {/* Specialty filters */}
                <div className="mb-6 overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-2 pb-2">
                        {specialties.map(specialty => (
                            <button
                                key={specialty}
                                onClick={() => setSelectedSpecialty(specialty)}
                                className={`whitespace-nowrap px-4 py-2 rounded text-sm font-medium transition-colors ${
                                    selectedSpecialty === specialty
                                        ? 'bg-[#9871ff] text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {specialty}
                            </button>
                        ))}
                    </div>
                </div>

                {/* If search is active, show results in a single column */}
                {(searchTerm.trim() !== '' || selectedSpecialty !== 'All') && (
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Search size={18} className="mr-2 text-[#9871ff]" />
                            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
                        </h2>
                        {filteredDoctors.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredDoctors.map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={doctor.profile_image}
                                                            alt={doctor.name}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-[#9871ff]">{doctor.specialization}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex mr-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={14}
                                                                className={i < Math.floor(doctor.rating)
                                                                    ? "text-[#ffc107] fill-[#ffc107]"
                                                                    : "text-gray-300"}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                            ({doctor.rating_count})
                                                        </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <MapPin size={14} className="mr-1 text-[#9871ff]" />
                                                    <span>{doctor.work_address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="bg-[#9871ff] text-white px-4 py-1 rounded hover:bg-[#8461ee] transition-colors">
                                                    Book
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                                <p className="text-gray-700 mb-3">No doctors found matching your criteria</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedSpecialty('All');
                                    }}
                                    className="bg-[#9871ff] text-white px-4 py-2 rounded text-sm hover:bg-[#8461ee] transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Only show categories if not searching or filtering */}
                {searchTerm.trim() === '' && selectedSpecialty === 'All' && (
                    <>
                        {/* Top Rated Doctors - Horizontal Scrolling */}
                        <section className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Award size={18} className="mr-2 text-[#9871ff]" />
                                    Top Rated Doctors
                                </h2>
                                <button className="flex items-center text-[#9871ff] text-sm font-medium hover:underline">
                                    View all <ChevronRight size={16} className="ml-1" />
                                </button>
                            </div>

                            {isLoading.top ? (
                                <div className="h-64 flex items-center justify-center">
                                    <div className="animate-pulse flex space-x-4">
                                        <div className="rounded-lg bg-gray-200 h-48 w-64"></div>
                                        <div className="rounded-lg bg-gray-200 h-48 w-64"></div>
                                        <div className="rounded-lg bg-gray-200 h-48 w-64"></div>
                                    </div>
                                </div>
                            ) : topDoctors.length > 0 ? (
                                <div className="overflow-x-auto scrollbar-hide -mx-4">
                                    <div className="flex px-4 pb-4 space-x-4">
                                        {topDoctors.map(doctor => (
                                            <div key={doctor.id} className="min-w-[300px] max-w-[300px]">
                                                <FeaturedDoctorCard
                                                    doctor={doctor}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                                    <p className="text-gray-700">No top-rated doctors found</p>
                                </div>
                            )}
                        </section>

                        {/* Nearby Doctors - Modern Grid */}
                        <section className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <MapPin size={18} className="mr-2 text-[#9871ff]" />
                                    Doctors Near You
                                </h2>
                                <button className="flex items-center text-[#9871ff] text-sm font-medium hover:underline">
                                    View all <ChevronRight size={16} className="ml-1" />
                                </button>
                            </div>

                            {isLoading.nearby ? (
                                <div className="h-64 flex items-center justify-center">
                                    <div className="animate-pulse flex space-x-4">
                                        <div className="rounded-lg bg-gray-200 h-48 w-64"></div>
                                        <div className="rounded-lg bg-gray-200 h-48 w-64"></div>
                                        <div className="rounded-lg bg-gray-200 h-48 w-64"></div>
                                    </div>
                                </div>
                            ) : nearbyDoctors.length > 0 ? (
                                <div className="overflow-x-auto scrollbar-hide -mx-4">
                                    <div className="flex px-4 pb-4 space-x-4">
                                        {nearbyDoctors.map(doctor => (
                                            <div key={doctor.id} className="min-w-[350px] max-w-[280px]">
                                                <NearbyDoctorCard
                                                    doctor={doctor}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                                    <p className="text-gray-700">No nearby doctors found</p>
                                </div>
                            )}
                        </section>

                        {/* All Doctors - Table View */}
                        <section className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Stethoscope size={18} className="mr-2 text-[#9871ff]" />
                                    All Doctors
                                </h2>
                                <button className="flex items-center text-[#9871ff] text-sm font-medium hover:underline">
                                    View all <ChevronRight size={16} className="ml-1" />
                                </button>
                            </div>

                            {isLoading.all ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="animate-pulse rounded-lg bg-white shadow overflow-hidden">
                                            <div className="grid grid-cols-12">
                                                <div className="col-span-4 sm:col-span-3 bg-gray-200 h-36"></div>
                                                <div className="col-span-8 sm:col-span-9 p-4">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-2/4 mb-4"></div>
                                                    <div className="flex justify-between items-center mt-4">
                                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : allDoctors.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {allDoctors.slice(0, 3).map((doctor) => (
                                            <tr key={doctor.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <Image
                                                                width={40}
                                                                height={40}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={doctor.profile_image}
                                                                alt={doctor.name}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[#9871ff]">{doctor.specialization}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex mr-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={i < Math.floor(doctor.rating)
                                                                        ? "text-[#ffc107] fill-[#ffc107]"
                                                                        : "text-gray-300"}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                                ({doctor.rating_count})
                                                            </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <MapPin size={14} className="mr-1 text-[#9871ff]" />
                                                        <span>{doctor.work_address}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="bg-[#9871ff] text-white px-4 py-1 rounded hover:bg-[#8461ee] transition-colors">
                                                        Book
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                                    <p className="text-gray-700">No doctors found</p>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

// Featured Doctor Card (for top doctors)
interface FeaturedDoctorCardProps {
    doctor: TopDoctor;
}

const FeaturedDoctorCard: React.FC<FeaturedDoctorCardProps> = ({ doctor }) => {
    return (
        <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden h-full">
            {/* Card header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center">
                    <Image
                        width={48}
                        height={48}
                        src={doctor.profile_image}
                        alt={doctor.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3">
                        <h3 className="font-medium text-gray-800 text-lg">{doctor.name}</h3>
                        <p className="text-[#9871ff] text-sm">{doctor.specialization}</p>
                    </div>
                </div>
            </div>

            {/* Card body */}
            <div className="p-4">
                <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                className={i < Math.floor(doctor.rating)
                                    ? "text-[#ffc107] fill-[#ffc107]"
                                    : "text-gray-200"}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500">
                        {doctor.rating.toFixed(1)}
                    </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin size={16} className="mr-2 text-[#9871ff]" />
                    <span className="truncate">{doctor.work_address}</span>
                </div>

                {doctor.rating >= 4.8 && (
                    <div className="bg-[#f8f4ff] text-[#9871ff] text-sm rounded p-2 flex items-center mb-3">
                        <Award size={16} className="mr-2" />
                        <span>Top Rated Doctor</span>
                    </div>
                )}
            </div>

            {/* Card footer */}
            <div className="p-4 mt-auto border-t border-gray-100">
                <button className="w-full bg-[#9871ff] text-white py-2 rounded hover:bg-[#8461ee] transition-colors">
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

// Nearby Doctor Card Component
interface NearbyDoctorCardProps {
    doctor: NearbyDoctor;
}

const NearbyDoctorCard: React.FC<NearbyDoctorCardProps> = ({ doctor }) => {
    return (
        <div className="bg-white  border-amber-50 shadow ">
        <Link
            href={`/patients/doctors/${doctor.id}`}
            className="rounded-lg  mx-2  shadow-sm  overflow-hidden">
            <div className="flex  p-4">
                <Image
                    width={64}
                    height={64}
                    src={doctor.profile_image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover border border-gray-100"
                />
                <div className="ml-4">
                    <h3 className="font-medium text-gray-800 text-lg">{doctor.name}</h3>
                    <p className="text-[#9871ff] text-sm mb-2">{doctor.specialization}</p>

                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-1 text-[#9871ff]" />
                        <span>{doctor.distance.toFixed(1)} km away</span>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4">
                <button className="w-full bg-[#9871ff] text-white py-2 rounded hover:bg-[#8461ee] transition-colors">
                    Book Appointment
                </button>
            </div>
        </Link>
        </div>
    );
};