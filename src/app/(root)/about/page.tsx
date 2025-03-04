import React from 'react';
import { Users, Heart, Goal, Activity, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function AboutPage() {
    const teamMembers = [
        {
            name: "Dr. Emily Chen",
            role: "Founder & CEO",
            image: "/frank.jpg",
            description: "Former Chief of Medicine with 15+ years of healthcare experience"
        },
        {
            name: "Michael Roberts",
            role: "Chief Technology Officer",
            image: "/poo.png",
            description: "Tech innovator with expertise in healthcare systems"
        },
        {
            name: "Dr. Sarah Johnson",
            role: "Medical Director",
            image: "/coo.png",
            description: "Specialized in implementing patient-first healthcare solutions"
        }
    ];

    const values = [
        {
            icon: <Heart className="w-6 h-6 text-rose-500" />,
            title: "Patient-Centered Care",
            description: "Every decision we make starts with our patients' needs and well-being in mind."
        },
        {
            icon: <Activity className="w-6 h-6 text-[#9871ff]" />,
            title: "Innovation",
            description: "Continuously improving healthcare delivery through technological advancement."
        },
        {
            icon: <Award className="w-6 h-6 text-yellow-500" />,
            title: "Excellence",
            description: "Maintaining the highest standards in healthcare service delivery."
        }
    ];

    return (
        <div className="min-h-screen mt-20 bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-50 to-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Revolutionizing Healthcare Access
                    </h1>
                    <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We&#39;re on a mission to make quality healthcare accessible to everyone through
                        innovative technology and a patient-first approach.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                            <p className="text-gray-600 mb-4">
                                Founded in 2023, our platform emerged from a simple observation: accessing quality
                                healthcare shouldn&#39;t be complicated. We saw patients struggling with long wait times,
                                difficult scheduling processes, and limited access to specialists.
                            </p>
                            <p className="text-gray-600 mb-4">
                                What started as a simple appointment booking system has grown into a comprehensive
                                healthcare platform, connecting thousands of patients with qualified healthcare
                                providers across the country.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-[#9871ff] mb-2">50K+</div>
                                    <div className="text-gray-600">Monthly Appointments</div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-[#9871ff] mb-2">1000+</div>
                                    <div className="text-gray-600">Healthcare Providers</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <Image
                                width={300}
                                height={300}
                                src="/doc.png"
                                alt="Medical professionals using our platform"
                                className="rounded-lg w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader>
                                    <div className="mx-auto bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center shadow-md mb-4">
                                        {value.icon}
                                    </div>
                                    <CardTitle>{value.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader>
                                    <Image
                                        width={300}
                                        height={300}
                                        src={member.image}
                                        alt={member.name}
                                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                    />
                                    <CardTitle>{member.name}</CardTitle>
                                    <p className="text-blue-600 font-medium">{member.role}</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{member.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-[#9871ff] text-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                    <p className="text-sm leading-relaxed mb-8">
                        To transform healthcare accessibility by creating a seamless connection between
                        patients and healthcare providers, ensuring quality care is just a click away.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        <div>
                            <Clock className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">24/7 Access</h3>
                            <p className="text-blue-100">Healthcare on your schedule</p>
                        </div>
                        <div>
                            <Users className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Patient First</h3>
                            <p className="text-blue-100">Focused on your needs</p>
                        </div>
                        <div>
                            <Goal className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Innovation</h3>
                            <p className="text-blue-100">Advancing healthcare tech</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Join Our Healthcare Revolution</h2>
                    <p className="text-gray-600 mb-8">
                        Experience the future of healthcare scheduling and management.
                        Join thousands of satisfied patients and healthcare providers on our platform.
                    </p>
                    <Button
                        asChild
                        className="bg-[#9871ff] h-12 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                        <Link href={"/login"}>
                            Get Started Today
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}