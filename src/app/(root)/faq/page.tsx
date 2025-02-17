import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from 'lucide-react';

export default function Faq() {
    const faqSections = [
        {
            title: "General Questions",
            questions: [
                {
                    q: "How do I book an appointment?",
                    a: "You can book an appointment by registering on our platform, selecting your preferred doctor, and choosing an available time slot that works for you. The booking process is simple and can be completed in just a few minutes."
                },
                {
                    q: "Can I cancel or reschedule my appointment?",
                    a: "Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time without any penalty. Simply log into your account and manage your appointments in the dashboard."
                },
                {
                    q: "What should I do if I need immediate medical attention?",
                    a: "If you have a medical emergency, please call emergency services (911) or visit the nearest emergency room immediately. Our platform is designed for scheduled appointments, not emergency care."
                }
            ]
        },
        {
            title: "Appointments & Scheduling",
            questions: [
                {
                    q: "How long before my appointment should I arrive?",
                    a: "We recommend arriving 15 minutes before your scheduled appointment time to complete any necessary paperwork and ensure a timely start to your consultation."
                },
                {
                    q: "What documents should I bring to my appointment?",
                    a: "Please bring a valid ID, your insurance card (if applicable), and any relevant medical records or test results from previous consultations."
                },
                {
                    q: "Do you offer virtual consultations?",
                    a: "Yes, we offer virtual consultations for follow-up appointments and minor health concerns. You can select this option while booking if the doctor provides virtual visits."
                }
            ]
        },
        {
            title: "Insurance & Payments",
            questions: [
                {
                    q: "What insurance plans do you accept?",
                    a: "We work with most major insurance providers. You can verify your insurance coverage during the booking process or contact our support team for specific inquiries."
                },
                {
                    q: "How do I pay for my appointment?",
                    a: "We accept various payment methods including credit cards, debit cards, and HSA/FSA cards. Payment is typically collected at the time of booking."
                },
                {
                    q: "What is your cancellation policy?",
                    a: "Appointments cancelled with less than 24 hours notice may incur a cancellation fee. Please refer to our cancellation policy for more details."
                }
            ]
        },
        {
            title: "Technical Support",
            questions: [
                {
                    q: "What should I do if I forget my password?",
                    a: "You can reset your password by clicking the 'Forgot Password' link on the login page. Follow the instructions sent to your registered email address."
                },
                {
                    q: "Is my medical information secure?",
                    a: "Yes, we take your privacy seriously. Our platform is HIPAA-compliant and uses state-of-the-art encryption to protect your medical information."
                },
                {
                    q: "How can I update my personal information?",
                    a: "You can update your personal information by logging into your account and navigating to the 'Profile Settings' section."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Section */}
            <section className="bg-white py-12 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
                        Find answers to common questions about our medical appointment platform.
                        Can&#39;t find what you&#39;re looking for? Contact our support team.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9871ff]/50"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="container mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {faqSections.map((section, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                            <Accordion type="single" collapsible className="w-full">
                                {section.questions.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${idx}-${index}`}>
                                        <AccordionTrigger className="text-left">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Support */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
                    <p className="text-gray-600 mb-6">
                        Our support team is here to help you 24/7
                    </p>
                    <button className="bg-[#9871ff] text-white px-6 py-3 rounded-lg hover:bg-[#9871ff]/90 transition">
                        Contact Support
                    </button>
                </div>
            </section>
        </div>
    );
}