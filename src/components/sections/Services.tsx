import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Services() {
    const services = [
        {
            title: "Make\nAppointment",
            description: "We make it easy for you to make an appointment with the doctor of your choice.",
            image: "https://plus.unsplash.com/premium_photo-1661281397737-9b5d75b52beb?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            bgColor: "bg-gray-100"
        },
        {
            title: "Virtual\nConsultation",
            description: "You don't have to bother because we provide a helpful facility to consult online.",
            image: "https://images.unsplash.com/photo-1589279003513-467d320f47eb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            bgColor: "bg-[#9871ff]",
            isFeature: true
        },
        {
            title: "Doctor\nPrescription",
            description: "We can also provide you with prescription medicine after your online consultation.",
            image: "https://plus.unsplash.com/premium_photo-1661774852687-b16047215f1b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            bgColor: "bg-gray-100"
        }
    ];

    return (
        <div className="w-full px-4 md:px-10 lg:px-24 py-16 max-w-[2560px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
                <h2 className="text-3xl text-[#1a1a1a] lg:leading-[50px] sm:text-4xl lg:text-4xl font-semibold max-w-xl mb-6 lg:mb-0">
                    We Will Serve You With Healthcare Services
                </h2>
                <div className="flex flex-col items-start lg:items-end gap-4">
                    <p className="text-gray-600 max-w-md text-right">
                        We provide a variety of services that can make it easier for you to fulfill your needs.
                    </p>
                    <Button
                        asChild
                        variant="default"
                        className="bg-[#9871ff] hover:bg-blue-600 text-white rounded-full px-8"
                    >
                        <Link href={"#choose-us"}>
                            Learn More
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className={`${service.bgColor} rounded-3xl p-8 ${
                            service.isFeature ? 'text-white' : 'text-black'
                        }`}
                    >
                        <div className="flex flex-col h-full">
                            <h3 className="text-2xl sm:text-3xl font-semibold mb-4 whitespace-pre-line">
                                {service.title}
                            </h3>
                            <p className={`mb-8 ${service.isFeature ? 'text-gray-100' : 'text-gray-600'}`}>
                                {service.description}
                            </p>
                            <div className="relative w-full h-48 sm:h-64 mt-auto rounded-2xl overflow-hidden">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                />
                                {service.isFeature && (
                                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                        <ArrowUpRight className="w-6 h-6 text-[#9871ff]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}