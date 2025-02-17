import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Section */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-gray-600">
                            Have questions about our services? We&#39;re here to help.
                            Contact us through any of the channels below.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-[#9871ff]/10 rounded-lg flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-[#9871ff]" />
                                </div>
                                <h3 className="font-semibold mb-2">Visit Us</h3>
                                <p className="text-gray-600">
                                    123 Medical Center Drive
                                    <br />
                                    New York, NY 10001
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-[#9871ff]/10 rounded-lg flex items-center justify-center mb-4">
                                    <Phone className="w-6 h-6 text-[#9871ff]" />
                                </div>
                                <h3 className="font-semibold mb-2">Call Us</h3>
                                <p className="text-gray-600">
                                    +1 (555) 123-4567
                                    <br />
                                    +1 (555) 765-4321
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-[#9871ff]/10 rounded-lg flex items-center justify-center mb-4">
                                    <Mail className="w-6 h-6 text-[#9871ff]" />
                                </div>
                                <h3 className="font-semibold mb-2">Email Us</h3>
                                <p className="text-gray-600">
                                    support@medapp.com
                                    <br />
                                    info@medapp.com
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-[#9871ff]/10 rounded-lg flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6 text-[#9871ff]" />
                                </div>
                                <h3 className="font-semibold mb-2">Working Hours</h3>
                                <p className="text-gray-600">
                                    Mon - Fri: 9AM - 7PM
                                    <br />
                                    Sat - Sun: 9AM - 2PM
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
                            <p className="text-gray-600">
                                Fill out the form below and we&#39;ll get back to you as soon as possible.
                            </p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <Input placeholder="Enter your first name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <Input placeholder="Enter your last name" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <Input type="email" placeholder="Enter your email" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <Input type="tel" placeholder="Enter your phone number" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <Textarea
                                    placeholder="Write your message here..."
                                    className="min-h-[150px]"
                                />
                            </div>

                            <Button className="w-full bg-[#9871ff] hover:bg-[#9871ff]/90">
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[400px] w-full">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095885427!2d-74.00594668459419!3d40.74144797932819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sNew%20York%20Medical%20Center!5e0!3m2!1sen!2sus!4v1624451234567!5m2!1sen!2sus"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Medical Center Location"
                ></iframe>
            </section>
        </div>
    );
}