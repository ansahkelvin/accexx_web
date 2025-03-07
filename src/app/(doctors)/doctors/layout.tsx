"use client"
import React from "react";
import {SidebarProvider} from "@/components/doctors/sidebar-context";
import Navbar from "@/components/doctors/Navbar";
import Sidebar from "@/components/doctors/Sidebar";


export default function DoctorsLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {

    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar component */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                    {/* Navbar component */}
                    <Navbar />

                    <main className="flex-1 overflow-y-auto">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    );
}