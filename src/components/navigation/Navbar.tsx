// components/navigation/Navbar.tsx
import Image from "next/image"
import NavLinks from "@/components/navigation/Navlinks"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MobileMenu from "./MobileMenu"

export default function Navbar() {
    return (
        <div className="flex flex-row items-center border-b border-b-gray-100 fixed left-0 top-0 w-full bg-white z-50 h-20 justify-between px-5 py-3">
            {/*Logo*/}
            <div>
                <Link href="/">
                    <Image
                        className="w-[75px] h-[75px] lg:w-[80px] lg:h-[80px]"
                        src="/logo.png"
                        alt="Logo"
                        width={120}
                        height={100}
                        priority
                    />
                </Link>
            </div>

            <div className="hidden lg:flex">
                <NavLinks />
            </div>

            <div className="hidden lg:flex items-center gap-2">
                <Button asChild className="bg-[#9871ff] hover:bg-[#9871ff]/90">
                    <Link href="/register">Register as patient</Link>
                </Button>
                <Button
                    asChild
                    className="bg-white shadow-none outline-0 border hover:bg-[#9871ff]/10 text-[#9871ff] border-[#9871ff]">
                    <Link href="/login">Login as patient</Link>
                </Button>
            </div>

            <MobileMenu />
        </div>
    )
}