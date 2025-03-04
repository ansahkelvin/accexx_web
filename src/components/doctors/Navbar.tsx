'use client';

import React from "react";
import { Bell, Menu } from "lucide-react";

interface NavbarProps {
    title: string;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export default function Navbar({ title, toggleSidebar }: NavbarProps) {
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
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full hover:bg-gray-100 relative focus:outline-none">
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="md:hidden">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">DR</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}