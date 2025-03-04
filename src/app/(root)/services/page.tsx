import React from 'react';
import { Clock, Heart, Shield, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function ServicesPage() {
    const services = [
        {
            icon: <Calendar className="w-8 h-8 text-blue-600" />,
            title: "24/7 Online Appointment Booking",
            description: "Take control of your healthcare journey with our round-the-clock booking system. Book, reschedule, or cancel appointments at your convenience, eliminating the hassle of phone calls during business hours.",
            benefits: ["Instant confirmation", "Smart scheduling", "Reminder system"]
        },
        {
            icon: <Heart className="w-8 h-8 text-rose-600" />,
            title: "Specialized Care Access",
            description: "Connect with top specialists across multiple medical disciplines. Our platform ensures you find the right healthcare professional for your specific needs, from general practitioners to specialized consultants.",
            benefits: ["Expert specialists", "Verified credentials", "Patient reviews"]
        },
        {
            icon: <Shield className="w-8 h-8 text-green-600" />,
            title: "Secure Health Records",
            description: "Maintain your medical history securely in one place. Access your records, prescriptions, and test results easily while knowing your sensitive information is protected by state-of-the-art encryption.",
            benefits: ["End-to-end encryption", "HIPAA compliant", "Easy access"]
        },
        {
            icon: <Users className="w-8 h-8 text-purple-600" />,
            title: "Virtual Consultations",
            description: "Save time with video consultations for follow-ups and minor concerns. Receive expert medical advice from the comfort of your home, ensuring continuous care without unnecessary travel.",
            benefits: ["HD video calls", "Flexible timing", "Lower costs"]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b mt-20 from-blue-50 to-white">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4">
                <div className="container mx-auto text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Healthcare Made <span className="text-[#9871ff]">Simple</span>
                    </h1>
                    <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                        Transform your healthcare experience with our innovative appointment booking platform.
                        We bridge the gap between patients and healthcare providers, making quality care accessible to everyone.
                    </p>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            className="bg-[#9871ff] h-12 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                           <Link href={"/login"}>
                               Book Appointment
                           </Link>
                        </Button>
                        <Button
                            asChild
                            className="bg-white h-12 text-[#9871ff] px-8 py-3 rounded-lg border-2 border-[#9871ff] hover:bg-blue-50 transition">
                            <Link href={"#choose"}>
                                Learn More
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section id={"choose"} className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
                        <p className="text-gray-600 max-w-2xl text-sm mx-auto">
                            Our comprehensive healthcare platform revolutionizes how you access medical care,
                            putting your health needs first with innovative features and patient-centered design.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <Card key={index} className="hover:shadow-xl transition duration-300 border-0 bg-white">
                                <CardHeader className="pb-4">
                                    <div className="mb-4">{service.icon}</div>
                                    <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-6">{service.description}</p>
                                    <ul className="space-y-2">
                                        {service.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-gray-700">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-[#9871ff] text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">98%</div>
                            <div className="text-blue-100">Patient Satisfaction</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-blue-100">Platform Availability</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">1000+</div>
                            <div className="text-blue-100">Healthcare Providers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <div className="text-blue-100">Monthly Appointments</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Healthcare Experience?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied patients who have discovered the convenience of managing their healthcare online.
                        Start your journey to better health management today.
                    </p>
                    <Button
                        asChild
                        className="bg-[#9871ff] h-full text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                        <Link href={"/register"}>
                            Get Started Now
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}