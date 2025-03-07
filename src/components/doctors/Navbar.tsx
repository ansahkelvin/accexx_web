'use client';

import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import Image from "next/image";
import {useSidebar} from "@/components/doctors/sidebar-context";

export default function Navbar() {
    const { toggleSidebar } = useSidebar();

    return (
        <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-20">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <button
                        className="md:hidden mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Search input */}
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="search"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Search patients, appointments..."
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full hover:bg-gray-100 relative focus:outline-none">
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Avatar */}
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/avatar-placeholder.png"
                                    alt="Dr. Smith"
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                   
                                />
                            </div>
                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-gray-800">Dr. Smith</p>
                            <p className="text-xs text-gray-500">Cardiologist</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}