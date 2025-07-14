"use client"
import DoctorCard from "@/components/card/DoctorCard";
import {MapPin, Search, Stethoscope} from "lucide-react";
import {useEffect, useState} from "react";
import {AllDoctor, NearbyDoctor} from "@/types/types";
import {fetchAllDoctors, fetchNearbyDoctors} from "@/app/actions/user";

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
    const [nearbyDoctors, setNearbyDoctors] = useState<NearbyDoctor[]>([]);

    // Loading states
    const [isLoading, setIsLoading] = useState({
        all: true,
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
                        isFavorite: false
                    })));
                }
                setIsLoading(prev => ({ ...prev, all: false }));

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
                setIsLoading({ all: false, nearby: false });
            }
        };

        fetchDoctors().then();
    }, []);

    // Search state
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Selected specialty filter
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

    // Get unique specialties from all doctor lists
    const allSpecialties = new Set([
        ...allDoctors.map(doctor => doctor.specialization),
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
        <div className="min-h-screen bg-gray-50">
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
            <main className="max-w-6xl mx-auto  py-6">
                {/* Specialty filters */}
                <div className="mb-6 overflow-x-auto scrollbar-hide -mx-4">
                    <div className="flex space-x-2 px-4 pb-2">
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

                {/* If search is active, show results in a grid of cards */}
                {(searchTerm.trim() !== '' || selectedSpecialty !== 'All') && (
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Search size={18} className="mr-2 text-[#9871ff]" />
                            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
                        </h2>

                        {filteredDoctors.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredDoctors.map(doctor => (
                                    <DoctorCard key={doctor.id} doctor={doctor} />
                                ))}
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
                        {/* Nearby Doctors - Horizontal Scrolling Cards */}
                        <section className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <MapPin size={18} className="mr-2 text-[#9871ff]" />
                                    Doctors Near You
                                </h2>
                                {/*<button className="flex items-center text-[#9871ff] text-sm font-medium hover:underline">*/}
                                {/*    View all <ChevronRight size={16} className="ml-1" />*/}
                                {/*</button>*/}
                            </div>

                            {isLoading.nearby ? (
                                <div className="overflow-x-auto scrollbar-hide -mx-4">
                                    <div className="flex px-4 pb-4 space-x-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="min-w-[280px] animate-pulse bg-white rounded-lg shadow-sm p-4">
                                                <div className="flex items-center mb-4">
                                                    <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                                                    <div className="ml-3 space-y-2 w-full">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                        <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 mb-4">
                                                    <div className="h-3 bg-gray-200 rounded"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                </div>
                                                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : nearbyDoctors.length > 0 ? (
                                <div className="overflow-x-auto scrollbar-hide -mx-4">
                                    <div className="flex px-4 pb-4 space-x-4">
                                        {nearbyDoctors.map(doctor => (
                                            <div key={doctor.id} className="min-w-[280px] max-w-[300px]">
                                                <DoctorCard doctor={doctor} />
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

                        {/* All Doctors - Horizontal Scrolling Cards */}
                        <section className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Stethoscope size={18} className="mr-2 text-[#9871ff]" />
                                    All Doctors
                                </h2>
                                {/*<button className="flex items-center text-[#9871ff] text-sm font-medium hover:underline">*/}
                                {/*    View all <ChevronRight size={16} className="ml-1" />*/}
                                {/*</button>*/}
                            </div>

                            {isLoading.all ? (
                                <div className="overflow-x-auto scrollbar-hide -mx-4">
                                    <div className="flex px-4 pb-4 space-x-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="min-w-[280px] animate-pulse bg-white rounded-lg shadow-sm p-4">
                                                <div className="flex items-center mb-4">
                                                    <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                                                    <div className="ml-3 space-y-2 w-full">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                        <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 mb-4">
                                                    <div className="h-3 bg-gray-200 rounded"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                </div>
                                                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : allDoctors.length > 0 ? (
                                <div className="overflow-x-auto scrollbar-hide -mx-4">
                                    <div className="flex pb-4 space-x-4">
                                        {allDoctors.map(doctor => (
                                            <div key={doctor.id} className="min-w-[280px] max-w-[300px]">
                                                <DoctorCard doctor={doctor} />
                                            </div>
                                        ))}
                                    </div>
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