import React from 'react';
import { Calendar, DollarSign, Users, Clock, Star, BarChart, Shield, Laptop } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForDoctorsPage() {
    const benefits = [
        {
            icon: <Calendar className="w-6 h-6 text-[#9871ff]" />,
            title: "Smart Scheduling",
            description: "Automated booking system that optimizes your calendar and reduces no-shows by 60%"
        },
        {
            icon: <DollarSign className="w-6 h-6 text-[#9871ff]" />,
            title: "Increased Revenue",
            description: "On average, doctors on our platform see a 40% increase in practice revenue"
        },
        {
            icon: <Users className="w-6 h-6 text-[#9871ff]" />,
            title: "Broader Patient Base",
            description: "Access to thousands of potential patients actively seeking specialists"
        },
        {
            icon: <Clock className="w-6 h-6 text-[#9871ff]" />,
            title: "Time Management",
            description: "Save 15+ hours per week on administrative tasks with our automated systems"
        }
    ];

    const features = [
        {
            icon: <Star className="w-8 h-8 text-yellow-400" />,
            title: "Professional Profile",
            description: "Showcase your expertise, qualifications, and patient reviews to build trust"
        },
        {
            icon: <BarChart className="w-8 h-8 text-green-500" />,
            title: "Analytics Dashboard",
            description: "Track your practice's performance with detailed insights and metrics"
        },
        {
            icon: <Shield className="w-8 h-8 text-blue-500" />,
            title: "Secure Platform",
            description: "HIPAA-compliant system ensuring patient data security"
        },
        {
            icon: <Laptop className="w-8 h-8 text-[#9871ff]" />,
            title: "Telemedicine Tools",
            description: "Integrated video consultations and digital prescription management"
        }
    ];

    return (
        <div className="min-h-screen mt-20">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[#9871ff]/10 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/40 -z-10" />
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Grow Your Practice with Modern Healthcare Technology
                        </h1>
                        <p className="text-sm text-gray-600 mb-8">
                            Join thousands of successful healthcare providers who have transformed
                            their practice with our innovative platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-[#9871ff] text-white px-8 py-4 rounded-lg hover:bg-[#9871ff]/90 transition shadow-lg font-semibold">
                                Sign Up as a Doctor
                            </button>
                            <button className="bg-white text-[#9871ff] px-8 py-4 rounded-lg border-2 border-[#9871ff] hover:bg-[#9871ff]/10 transition font-semibold">
                                Watch Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
                        <div className="p-6 rounded-lg bg-[#9871ff]/10">
                            <div className="text-4xl font-bold text-[#9871ff] mb-2">90%</div>
                            <div className="text-gray-600">Reduced Paperwork</div>
                        </div>
                        <div className="p-6 rounded-lg bg-[#9871ff]/10">
                            <div className="text-4xl font-bold text-[#9871ff] mb-2">50K+</div>
                            <div className="text-gray-600">Monthly Patients</div>
                        </div>
                        <div className="p-6 rounded-lg bg-[#9871ff]/10">
                            <div className="text-4xl font-bold text-[#9871ff] mb-2">40%</div>
                            <div className="text-gray-600">Revenue Increase</div>
                        </div>
                        <div className="p-6 rounded-lg bg-[#9871ff]/10">
                            <div className="text-4xl font-bold text-[#9871ff] mb-2">4.9/5</div>
                            <div className="text-gray-600">Doctor Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Why Doctors Choose Our Platform
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-[#9871ff]/10 rounded-lg flex items-center justify-center mb-4">
                                        {benefit.icon}
                                    </div>
                                    <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Powerful Features for Modern Practice
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-6 p-6 rounded-lg bg-gray-50">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-16 bg-[#9871ff]/10">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-12">What Doctors Say About Us</h2>
                    <div className="bg-white p-8 rounded-2xl shadow-xl">
                        <div className="mb-6">
                            <Star className="w-12 h-12 text-yellow-400 mx-auto" />
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            &#34;Since joining the platform, I&#39;ve seen a significant increase in patient
                            bookings and a dramatic reduction in administrative work. The smart scheduling
                            system has transformed how I manage my practice.&#34;
                        </p>
                        <div className="text-[#9871ff] font-semibold">Dr. Sarah Mitchell</div>
                        <div className="text-gray-500">Cardiologist, London</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Practice?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join our network of healthcare professionals and experience the future
                        of medical practice management.
                    </p>
                    <button className="bg-[#9871ff] text-white px-8 py-4 rounded-lg hover:bg-[#9871ff]/90 transition shadow-lg font-semibold">
                        Get Started Now
                    </button>
                </div>
            </section>
        </div>
    );
}