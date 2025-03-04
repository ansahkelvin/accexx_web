'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Calendar, Settings, Users } from "lucide-react";

interface SidebarProps {
    isSidebarOpen: boolean;
}

export default function Sidebar({ isSidebarOpen }: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        {
            href: "/doctor/dashboard",
            icon: <BarChart2 size={20} />,
            label: "Dashboard",
        },
        {
            href: "/doctor/appointments",
            icon: <Calendar size={20} />,
            label: "Appointments",
        },
        {
            href: "/doctor/patients",
            icon: <Users size={20} />,
            label: "Patients",
        },
        {
            href: "/doctor/settings",
            icon: <Settings size={20} />,
            label: "Settings",
        },
    ];

    return (
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 fixed h-full hidden md:block z-10`}>
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">MB</span>
                        </div>
                        {isSidebarOpen && <h1 className="text-xl font-bold text-gray-800">MediBook</h1>}
                    </div>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                            isActive
                                                ? "text-blue-600 bg-blue-50"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {item.icon}
                                        {isSidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center p-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">DR</span>
                        </div>
                        {isSidebarOpen && (
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">Dr. Smith</p>
                                <p className="text-xs text-gray-500">Cardiologist</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}