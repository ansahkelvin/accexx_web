"use client"
import { Button } from "@/components/ui/button"
import { MenuIcon, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import NavLinks from "./Navlinks"
import { usePathname } from "next/navigation"

export default function MobileMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    return (
        <div className="lg:hidden">
            <button
                className="text-lg flex focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMenuOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MenuIcon className="w-6 h-6" />
                )}
            </button>

            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-20">
                    <div className="flex flex-col h-full px-5">
                        <div>
                            <X  onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-6 h-6" />
                        </div>
                        <div className="py-6">
                            <div className="flex flex-col gap-6">
                                <NavLinks />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-auto mb-8">
                            <Button asChild className="w-full bg-[#9871ff] hover:bg-[#9871ff]/90">
                                <Link href="/register">Register as patient</Link>
                            </Button>
                            <Button
                                asChild
                                className="w-full bg-white shadow-none outline-0 border hover:bg-[#9871ff]/10 text-[#9871ff] border-[#9871ff]">
                                <Link href="/login">Login as patient</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}