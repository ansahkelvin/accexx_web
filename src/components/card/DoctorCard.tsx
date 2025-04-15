import React from 'react';
import Image from "next/image";
import Link from "next/link";
import {MapPin, Star, Clock, ChevronRight} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BaseDoctor {
    id: string;
    profile_image: string;
    name: string;
    specialization: string;
    rating?: number;
    rating_count?: number;
    work_address?: string;
}

// Extended interface for NearbyDoctor with distance
interface Doctor extends BaseDoctor {
    distance?: number;
    availability?: string;
}

// Define props interface for the DoctorCard component
interface DoctorCardProps {
    doctor: Doctor;
    compact?: boolean;
}

/**
 * DoctorCard - A reusable card component for displaying doctor information
 */
const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, compact = false }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden w-full max-w-xs">
            {/* Card Header with Image and Name */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-purple-100">
                        <Image
                            src={doctor.profile_image}
                            alt={`Dr. ${doctor.name}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <h3 className=" text-gray-800 text-base truncate">{doctor.name}</h3>
                        <p className="text-purple-600 text-sm  truncate">{doctor.specialization}</p>

                        {/* Rating Display - Fixed */}
                        {doctor.rating !== undefined && (
                            <div className="flex items-center mt-1">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < Math.floor(doctor.rating || 0)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-200"}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                    {doctor.rating.toFixed(1)} {doctor.rating_count !== undefined && `(${doctor.rating_count})`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Body with Details */}
            {!compact && (
                <div className="p-4 space-y-3">
                    {/* Location */}
                    {doctor.work_address && (
                        <div className="flex items-start text-sm text-gray-600">
                            <MapPin size={16} className="mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1 truncate">{doctor.work_address}</span>
                        </div>
                    )}

                    {/* Distance - If Available */}
                    {doctor.distance !== undefined && (
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                {doctor.distance.toFixed(1)} km away
                            </div>
                        </div>
                    )}

                    {/* Availability - If Available */}
                    {doctor.availability && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Clock size={16} className="mr-2 text-purple-600" />
                            <span>Next available: {doctor.availability}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Card Footer with Action Button */}
            <div className="p-4 mt-auto border-t border-gray-100">
                <Button
                    asChild
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded transition-colors"
                >
                    <Link href={`/patients/doctors/${doctor.id}`}>
                        Book Appointment
                    </Link>
                </Button>
            </div>
        </div>
    );
};

// Define props interface for the DoctorCardGrid component
interface DoctorCardGridProps {
    doctors: Doctor[];
    title: string;
    icon?: React.ReactNode;
    loading?: boolean;
    compact?: boolean;
}

/**
 * DoctorCardGrid - A component for displaying a horizontally scrollable list of doctor cards
 */
export const DoctorCardGrid: React.FC<DoctorCardGridProps> = ({
                                                                  doctors,
                                                                  title,
                                                                  icon,
                                                                  loading = false,
                                                                  compact = false
                                                              }) => {
    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    {icon && <span className="mr-2 text-purple-600">{icon}</span>}
                    {title}
                </h2>
                <button className="flex items-center text-purple-600 text-sm font-medium hover:underline">
                    View all <ChevronRight size={16} className="ml-1" />
                </button>
            </div>

            {loading ? (
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
                                {!compact && (
                                    <div className="space-y-3 mb-4">
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                )}
                                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : doctors.length > 0 ? (
                <div className="overflow-x-auto scrollbar-hide -mx-4">
                    <div className="flex px-4 pb-4 space-x-4">
                        {doctors.map(doctor => (
                            <div key={doctor.id} className="min-w-[280px]">
                                <DoctorCard doctor={doctor} compact={compact} />
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
    );
};

export default DoctorCard;