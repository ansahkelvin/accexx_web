import {ReactNode} from "react";
import Sidebar from "@/components/patient/navigation/Sidebar";


export default function PatientLayout({ children }: { children: ReactNode }) {
    return (
        <main>
            <Sidebar/>
            <div className="ml-64">
                {children}
            </div>

        </main>
    )
}