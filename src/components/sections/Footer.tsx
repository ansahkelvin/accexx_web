import Link from "next/link";
import Image from "next/image";

interface FooterColumnProps {
    title: string;
    links: { href: string; label: string }[];
}

const FooterColumn = ({ title, links }: FooterColumnProps) => (
    <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <div className="flex flex-col gap-3">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    {link.label}
                </Link>
            ))}
        </div>
    </div>
);

export default function Footer() {
    const footerLinks = {
        services: [
            { href: "/investment", label: "Investment" },
            { href: "/assets-market", label: "Assets Market" },
            { href: "/trading", label: "Trading" }
        ],
        information: [
            { href: "/signup", label: "Sign Up" },
            { href: "/community", label: "Join Community" },
            { href: "/learning", label: "Learning" },
            { href: "/newsletter", label: "Newsletter" }
        ],
        platform: [
            { href: "/terms", label: "Terms Of Use" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/partnership", label: "Partnership" }
        ],
        support: [
            { href: "/help", label: "Help Center" },
            { href: "/tutorial", label: "Video Tutorial" },
            { href: "/cookies", label: "Cookie Settings" }
        ]
    };

    return (
        <footer className="w-full bg-gray-50">
            <div className="max-w-[2560px] mx-auto px-4 md:px-10 lg:px-24 py-16">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
                    {/* Logo and Description - full width on mobile */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex mb-6">
                            <Image src={"/background.png"} alt={"Logo"} width={256} height={156} />
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <FooterColumn title="Services" links={footerLinks.services} />
                    <FooterColumn title="Information" links={footerLinks.information} />
                    <FooterColumn title="Platform" links={footerLinks.platform} />
                    <FooterColumn title="Support" links={footerLinks.support} />
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-gray-200">
                    <p className="text-center text-gray-500">
                        Copyright © 2025. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}