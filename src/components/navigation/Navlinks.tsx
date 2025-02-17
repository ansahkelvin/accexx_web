"use client"
import {iNavLinks} from "@/types/iNavLinks";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import Link from "next/link";


export default function NavLinks() {
    const pathName = usePathname();
    return (
        <div className={cn("flex flex-col lg:flex-row items-center gap-4 justify-center text-sm text-black font-medium")}>
            {links.map((link, index) => (
                <Link
                    className={cn(pathName === link.link ? "text-blue-900" : "", "text-sm")}
                    href={link.link} key={index}>{link.title}</Link>
            ))}
        </div>
    )
}

const links: iNavLinks[] = [
    {
        title: "Home",
        link: "/"
    },
    {
        title: "Services",
        link: "/services"
    },
    {
        title: "About Us",
        link: "/about"
    },
    {
        title: "For Doctors",
        link: "/for-doctors"
    },
    {
        title: "FAQ",
        link: "/faq"
    },
    {
        title: "Contact",
        link: "/contact"
    },

];
