import Image from "next/image";
import {LogoutButton} from "@/components/auth/logout-button";
import SidebarLinks from "@/components/patient/navigation/SidebarLink";


export default function Sidebar() {
    return (
        <div className="flex flex-col justify-between pb-12 h-screen fixed w-64 border-r border-r-gray-200">

            <div className={"flex flex-col gap-3"}>
                <div>
                    <Image src={"/logo.png"} className="w-28 h-28" alt={"Logo"} width={200} height={200} />
                </div>

                <div>
                    <SidebarLinks/>
                </div>
            </div>


            <div>
                <LogoutButton/>
            </div>
        </div>
    )
}