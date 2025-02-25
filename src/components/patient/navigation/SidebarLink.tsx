"use client"

import {usePathname} from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Users,
    MessageSquare,
    FileText,
    Settings
} from "lucide-react";
import React from "react";
import Link from "next/link";

interface ILink {
    title: string;
    href: string;
    icon: React.ReactNode;
}


export default function SidebarLinks() {
    const pathname = usePathname();
    const links : ILink[] = [
        {
            title: "Dashboard",
            href: "/patients",
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            title: "Appointments",
            href: "/patients/appointments",
            icon: <Calendar className="w-5 h-5" />,
        },
        {
            title: "Doctors",
            href: "/patients/doctors",
            icon: <Users className="w-5 h-5" />,
        },
        {
            title: "Messages",
            href: "/patients/messages",
            icon: <MessageSquare className="w-5 h-5" />,
        },
        {
            title: "Medical Record",
            href: "/patients/medical-record",
            icon: <FileText className="w-5 h-5" />,
        },
        {
            title: "Settings",
            href: "/patients/settings",
            icon: <Settings className="w-5 h-5" />,
        }
    ]
    return (
        <div className="flex flex-col space-y-3">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-4 mt-12 text-sm rounded-lg transition-colors ${
                        pathname === link.href
                            ? "bg-[#9871ff] text-white mx-4"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                    {link.icon}
                    <span>{link.title}</span>
                </Link>
            ))}
        </div>
    )
}