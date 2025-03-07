import { ReactNode } from "react";
import Sidebar from "@/components/patient/navigation/Sidebar";
import Navbar from "@/components/navigation/PatientNavBar";

export default function PatientLayout({ children }: { children: ReactNode }) {
    return (
        <main className="bg-gray-50 min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col transition-all duration-300 sm:ml-16 md:ml-64">
                <Navbar />
                <div className="px-4 py-6 md:px-6 md:py-8 overflow-auto">
                    {children}
                </div>
            </div>
        </main>
    )
}