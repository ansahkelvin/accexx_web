"use client";

import Image from "next/image";
import { LogoutButton } from "@/components/auth/logout-button";
import SidebarLinks from "@/components/patient/navigation/SidebarLink";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setIsMounted(true);

        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Only set isOpen based on screen size during initial load or resize
            // Don't override user preference after first render
            if (!isMounted || mobile !== isMobile) {
                setIsOpen(!mobile);
            }
        };

        // Set initial state
        checkScreenSize();

        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);

        // Clean up event listener
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [isMobile, isMounted]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Prevent layout shift during hydration
    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* Mobile toggle button */}
            {isMobile && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed top-3 left-4 z-50 md:hidden"
                    onClick={toggleSidebar}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            )}

            {/* Sidebar */}
            <div
                className={`
                    flex flex-col justify-between pb-12 h-screen fixed border-r border-r-gray-200 bg-white z-40
                    transition-transform duration-300 ease-in-out
                    ${isMobile ? 'w-64' : isOpen ? 'w-64' : 'w-16'} 
                    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
                `}
            >
                <div className="flex flex-col gap-3">
                    <div className="p-4 flex justify-center sm:justify-start">
                        <Image
                            src={"/logo.png"}
                            className={`transition-all duration-300 ${isOpen && !isMobile ? 'w-28 h-28' : 'hidden'}`}
                            alt={"Logo"}
                            width={200}
                            height={200}
                            priority
                        />
                    </div>

                    <div className={isOpen && isMobile ? 'mt-24' : 'mt-0'}>
                        <SidebarLinks isCollapsed={!isOpen} />
                    </div>
                </div>

                <div className={`px-4 ${isOpen || !isMobile ? 'block' : 'hidden'} ${!isOpen && !isMobile ? 'px-2 flex justify-center' : ''}`}>
                    <LogoutButton />
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
}