"use client"
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log("Subscribing email:", email);
    };

    return (
        <div className="w-full max-w-[2560px] mx-auto px-4 md:px-10 lg:px-24 py-16">
            <div className="bg-white rounded-3xl shadow-lg">
                <div className="flex flex-col md:flex-row items-center">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-12">
                        <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1626113337617-7e9ea91253d7?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Happy Subscriber"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                            Subscribe our Newsletter
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md">
                            Be the first to discover new product features, upcoming events, and special promotions tailored specifically for our valued subscribers.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#9871FF]"
                                required
                            />
                            <Button
                                type="submit"
                                className="bg-[#9871FF] hover:bg-[#7B4AFF] text-white px-8 py-3 rounded-lg"
                            >
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}