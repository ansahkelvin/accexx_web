'use client';

import React, { useState } from 'react';
import { Search, MapPin, Star, Heart, Calendar, ChevronRight, User } from 'lucide-react';
import Image from "next/image";

// TypeScript interfaces
interface Doctor {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    image: string;
    location: string;
    distance?: string;
    availability: string;
    isRecommended?: boolean;
    isHighRated?: boolean;
    isNearYou?: boolean;
    isFavorite: boolean;
}

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

    // Sample doctors data
    const [doctors, setDoctors] = useState<Doctor[]>([
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            rating: 4.9,
            reviewCount: 124,
            image: "https://randomuser.me/api/portraits/women/45.jpg",
            location: "Memorial Hospital",
            distance: "1.2 miles",
            availability: "Available today",
            isRecommended: true,
            isHighRated: true,
            isNearYou: true,
            isFavorite: false
        },
        {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Dermatologist",
            rating: 4.8,
            reviewCount: 98,
            image: "https://randomuser.me/api/portraits/men/35.jpg",
            location: "Skin Care Clinic",
            distance: "0.8 miles",
            availability: "Available tomorrow",
            isRecommended: true,
            isNearYou: true,
            isFavorite: false
        },
        {
            id: 3,
            name: "Dr. Emily Wilson",
            specialty: "Pediatrician",
            rating: 4.7,
            reviewCount: 156,
            image: "https://randomuser.me/api/portraits/women/22.jpg",
            location: "Children's Medical Center",
            distance: "2.4 miles",
            availability: "Available today",
            isHighRated: true,
            isFavorite: true
        },
        {
            id: 4,
            name: "Dr. James Martinez",
            specialty: "Orthopedic Surgeon",
            rating: 4.9,
            reviewCount: 210,
            image: "https://randomuser.me/api/portraits/men/42.jpg",
            location: "Orthopedic Institute",
            distance: "3.1 miles",
            availability: "Next available: Mon",
            isHighRated: true,
            isFavorite: false
        },
        {
            id: 5,
            name: "Dr. Rebecca Lee",
            specialty: "Neurologist",
            rating: 4.6,
            reviewCount: 87,
            image: "https://randomuser.me/api/portraits/women/29.jpg",
            location: "Neurology Center",
            distance: "1.5 miles",
            availability: "Available today",
            isNearYou: true,
            isFavorite: false
        },
        {
            id: 6,
            name: "Dr. David Kim",
            specialty: "Family Medicine",
            rating: 4.7,
            reviewCount: 132,
            image: "https://randomuser.me/api/portraits/men/64.jpg",
            location: "Community Health Clinic",
            distance: "0.7 miles",
            availability: "Available today",
            isRecommended: true,
            isNearYou: true,
            isFavorite: false
        },
        {
            id: 7,
            name: "Dr. Jennifer Taylor",
            specialty: "Obstetrician",
            rating: 4.8,
            reviewCount: 178,
            image: "https://randomuser.me/api/portraits/women/52.jpg",
            location: "Women's Health Center",
            distance: "2.8 miles",
            availability: "Next available: Tue",
            isHighRated: true,
            isFavorite: false
        },
        {
            id: 8,
            name: "Dr. Robert Williams",
            specialty: "Ophthalmologist",
            rating: 4.5,
            reviewCount: 91,
            image: "https://randomuser.me/api/portraits/men/76.jpg",
            location: "Vision Care Center",
            distance: "1.9 miles",
            availability: "Available tomorrow",
            isRecommended: true,
            isFavorite: false
        }
    ]);

    // Search state
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Selected specialty filter
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

    // Toggle favorite doctor
    const toggleFavorite = (id: number) => {
        setDoctors(doctors.map(doctor =>
            doctor.id === id ? { ...doctor, isFavorite: !doctor.isFavorite } : doctor
        ));
    };

    // Get unique specialties
    const specialties = ['All', ...new Set(doctors.map(doctor => doctor.specialty))];

    // Filter doctors based on categories
    const recommendedDoctors = doctors.filter(doctor => doctor.isRecommended);
    const nearYouDoctors = doctors.filter(doctor => doctor.isNearYou);
    const highRatedDoctors = doctors.filter(doctor => doctor.isHighRated);

    // Filter doctors based on search and specialty
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = searchTerm.trim() === '' ||
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;

        return matchesSearch && matchesSpecialty;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <style jsx global>{scrollbarHideStyles}</style>
            {/* Header with background */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-3xl font-bold">Find Your Doctor</h1>
                    <p className="mt-2 text-blue-100">Connect with trusted healthcare professionals tailored to your needs</p>

                    {/* Search bar positioned at bottom of header */}
                    <div className="mt-8 bg-white rounded-xl shadow-lg p-1 flex flex-col md:flex-row">
                        <div className="relative flex-1 p-2">
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search doctors, specialties, conditions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-3 pl-12 pr-4 rounded-lg bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>
                        <div className="border-l border-gray-200 hidden md:block"></div>
                        <div className="relative flex-1 p-2">
                            <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Location (City or ZIP code)"
                                className="w-full py-3 pl-12 pr-4 rounded-lg bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>
                        <div className="p-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full md:w-auto">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-6xl mx-auto py-8 px-4">
                {/* Quick filters */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex space-x-2 pb-2">
                        {specialties.map(specialty => (
                            <button
                                key={specialty}
                                onClick={() => setSelectedSpecialty(specialty)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${
                                    selectedSpecialty === specialty
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                } transition-colors shadow-sm`}
                            >
                                {specialty}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Additional filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-wrap gap-4 items-center">
                    <span className="font-medium text-gray-700">Filter by:</span>

                    <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg text-gray-700 transition-colors cursor-pointer">
                        <Calendar size={16} />
                        <span className="text-sm">Availability</span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg text-gray-700 transition-colors cursor-pointer">
                        <Star size={16} />
                        <span className="text-sm">Rating</span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg text-gray-700 transition-colors cursor-pointer">
                        <MapPin size={16} />
                        <span className="text-sm">Distance</span>
                    </div>

                    <div className="ml-auto">
                        <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Sort by: Recommended</option>
                            <option>Sort by: Highest Rated</option>
                            <option>Sort by: Nearest</option>
                        </select>
                    </div>
                </div>

                {/* If search is active, show results */}
                {(searchTerm.trim() !== '' || selectedSpecialty !== 'All') && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
                        </h2>
                        {filteredDoctors.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {filteredDoctors.map(doctor => (
                                    <DoctorCard
                                        key={doctor.id}
                                        doctor={doctor}
                                        toggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                <User size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-700 font-medium">No doctors found matching your criteria</p>
                                <p className="text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Only show categories if not searching or filtering */}
                {searchTerm.trim() === '' && selectedSpecialty === 'All' && (
                    <>
                        {/* Recommended Doctors */}
                        <section className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
                                <button className="flex items-center text-blue-600 font-medium hover:text-blue-700">
                                    View all <ChevronRight size={18} className="ml-1" />
                                </button>
                            </div>
                            <div className="flex overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
                                <div className="flex gap-4">
                                    {recommendedDoctors.map(doctor => (
                                        <div key={doctor.id} className="w-full min-w-[340px] sm:min-w-[380px] max-w-lg flex-shrink-0">
                                            <DoctorCard
                                                doctor={doctor}
                                                toggleFavorite={toggleFavorite}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Doctors Near You */}
                        <section className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Near You</h2>
                                <button className="flex items-center text-blue-600 font-medium hover:text-blue-700">
                                    View all <ChevronRight size={18} className="ml-1" />
                                </button>
                            </div>
                            <div className="flex overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
                                <div className="flex gap-4">
                                    {nearYouDoctors.map(doctor => (
                                        <div key={doctor.id} className="w-full min-w-[340px] sm:min-w-[380px] max-w-lg flex-shrink-0">
                                            <DoctorCard
                                                doctor={doctor}
                                                toggleFavorite={toggleFavorite}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Highest Rated Doctors */}
                        <section className="mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Highest Rated</h2>
                                <button className="flex items-center text-blue-600 font-medium hover:text-blue-700">
                                    View all <ChevronRight size={18} className="ml-1" />
                                </button>
                            </div>
                            <div className="flex overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
                                <div className="flex gap-4">
                                    {highRatedDoctors.map(doctor => (
                                        <div key={doctor.id} className="w-full min-w-[340px] sm:min-w-[380px] max-w-lg flex-shrink-0">
                                            <DoctorCard
                                                doctor={doctor}
                                                toggleFavorite={toggleFavorite}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

// Doctor Card Component
interface DoctorCardProps {
    doctor: Doctor;
    toggleFavorite: (id: number) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, toggleFavorite }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row">
                    <div className="mb-4 sm:mb-0 sm:mr-5 flex justify-center">
                        <Image
                            width={90}
                            height={90}
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border-2 border-gray-100"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                                <p className="text-indigo-600 font-medium">{doctor.specialty}</p>
                                <div className="flex items-center mt-1">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < Math.floor(doctor.rating)
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold ml-2">{doctor.rating}</span>
                                    <span className="text-sm text-gray-500 ml-1">({doctor.reviewCount})</span>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleFavorite(doctor.id)}
                                className="p-2 rounded-full hover:bg-gray-100"
                                aria-label={doctor.isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Heart
                                    className={doctor.isFavorite
                                        ? "fill-red-500 text-red-500"
                                        : "text-gray-400"}
                                    size={22}
                                />
                            </button>
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                            <div className="flex items-center text-gray-600">
                                <MapPin size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                                <span>{doctor.location}</span>
                                {doctor.distance && (
                                    <span className="ml-1 text-sm text-gray-500">• {doctor.distance}</span>
                                )}
                            </div>

                            <div className="mt-auto pt-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                                    doctor.availability.includes('today')
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {doctor.availability}
                                </span>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-colors shadow-sm">
                                    Show Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};