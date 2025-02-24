import {ReactNode} from "react";
import {LogoutButton} from "@/components/auth/logout-button";


export default function PatientLayout({ children }: { children: ReactNode }) {
    return (
        <main>
            <LogoutButton/>
            {children}
        </main>
    )
}