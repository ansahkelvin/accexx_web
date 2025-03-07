'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {BarChart2, Calendar, Settings, Users, InboxIcon, TimerIcon} from "lucide-react";
import {useSidebar} from "@/components/doctors/sidebar-context";
import {NavItem} from "@/types/types";

export default function Sidebar() {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const pathname = usePathname();

    // Navigation items defined here within the component
    const navItems: NavItem[] = [
        {
            href: "/doctors/dashboard",
            icon: <BarChart2 size={20} />,
            label: "Dashboard",
        },
        {
            href: "/doctors/appointments",
            icon: <Calendar size={20} />,
            label: "Appointments",
        },
        {
            href: "/doctors/inbox",
            icon: <InboxIcon size={20} />,
            label: "Messages",
        },
        {
            href: "/doctors/schedules",
            icon: <TimerIcon size={20} />,
            label: "Schedules",
        },
        {
            href: "/doctors/patients",
            icon: <Users size={20} />,
            label: "Patients",
        },
        {
            href: "/doctors/settings",
            icon: <Settings size={20} />,
            label: "Settings",
        },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? "w-64" : "w-20"
                } bg-white shadow-md transition-all duration-300 fixed h-full hidden md:block z-10`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-3">
                        <div className="h-28 w-28 rounded-lg flex items-center justify-center">
                            <Image src={"/logo.png"} alt={"MediBook Logo"} width={250} height={250} />
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
                                            className={`flex text-sm items-center p-3 rounded-lg transition-colors duration-200 ${
                                                isActive
                                                    ? "text-blue-600 bg-blue-50"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            {item.icon}
                                            {isSidebarOpen && (
                                                <span className="ml-3 font-medium">{item.label}</span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                {/* Mobile Sidebar Overlay */}
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-30 ${
                        !isSidebarOpen ? "hidden" : ""
                    }`}
                    onClick={toggleSidebar}
                />

                {/* Mobile Sidebar */}
                <div
                    className={`fixed inset-y-0 left-0 transform ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition duration-300 ease-in-out z-40 w-64 bg-white shadow-xl`}
                >
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">MB</span>
                                    </div>
                                    <h1 className="text-xl font-bold text-gray-800">MediBook</h1>
                                </div>
                                <button
                                    onClick={toggleSidebar}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
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
                                                <span className="ml-3 font-medium">{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                        
                    </div>
                </div>
            </div>
        </>
    );
}