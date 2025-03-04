'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {BarChart2, Calendar, Settings, Users, Bell, Menu, InboxIcon, TimerIcon} from "lucide-react";
import Image from "next/image";

export default function DoctorsLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();

    const navItems = [
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
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? "w-64" : "w-20"
                } bg-white shadow-md transition-all duration-300 fixed h-full hidden md:block z-10`}
            >
                <div className="flex flex-col h-full">
                        <div className="flex items-center space-x-3">
                            <div className="h-28 w-28  rounded-lg flex items-center justify-center">
                                <Image src={"/logo.png"} alt={""} width={250} height={250} />
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

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-30 md:hidden ${
                    !isSidebarOpen ? "hidden" : ""
                }`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:hidden transition duration-300 ease-in-out z-40 w-64 bg-white shadow-xl`}
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
                                onClick={() => setIsSidebarOpen(false)}
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

                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center p-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium">DR</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">Dr. Smith</p>
                                <p className="text-xs text-gray-500">Cardiologist</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col ${
                    isSidebarOpen ? "md:ml-64" : "md:ml-20"
                } transition-all duration-300`}
            >
                {/* Top Navigation Bar */}
                <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <button
                                className="md:hidden mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                aria-label="Toggle Sidebar"
                            >
                                <Menu size={24} />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {pathname.includes("/dashboard")
                                    ? "Dashboard"
                                    : pathname.includes("/appointments")
                                        ? "Appointments"
                                        : pathname.includes("/patients")
                                            ? "Patients"
                                            : pathname.includes("/settings")
                                                ? "Settings"
                                                : "Doctor Portal"}
                            </h2>
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

                <main className="flex-1 overflow-y-auto ">{children}</main>
            </div>
        </div>
    );
}