import Image from "next/image";
import NavLinks from "@/components/navigation/Navlinks";
import {Button} from "@/components/ui/button";
import {MenuIcon} from "lucide-react";

export default function Navbar() {
    return (
        <div className="flex flex-row items-center border border-b-gray-100 fixed left-0 top-0 w-full bg-white z-50 h-20 justify-between px-5 py-3">
           {/*Logo*/}
            <div>
                <Image className="w-[75px] h-[75px] lg:w-[80px] lg:h-[80px]" src={"/logo.png"} alt={"Logo"} width={120} height={100} />
            </div>

            <div className={"hidden lg:flex "}>
                <NavLinks/>
            </div>

            <div className="hidden lg:flex items-center gap-2">
                <Button className="bg-[#9871ff]"> Register </Button>
                <Button className="bg-white shadow-none outline-0 border text-[#9871ff] border-[#9871ff]"> Login </Button>
            </div>

            <div className={"text-lg flex lg:hidden"}>
                <MenuIcon/>
            </div>

        </div>
    )
}