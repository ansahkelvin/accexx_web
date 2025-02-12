import Image from "next/image";
import BookingForm from "@/components/sections/BookingForm";


export default function Hero() {
    return (
        <section className="flex flex-col relative lg:flex-row mt-24 lg:mt-24 justify-between px-4 md:px-10 lg:px-24 2xl:px-32 4xl:px-64 max-w-[2560px] mx-auto">
            <div className="w-full lg:w-1/2 mt-6 sm:mt-12 lg:mt-24">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-medium lg:leading-[70px] sm:leading-loose text-[#1a1a1a]">
                    Find your doctor and make an appointment
                </h1>
                <p className="text-sm lg:text-base 2xl:text-lg mt-4 sm:mt-6 text-gray-600 max-w-sm mb-8 sm:mb-16">
                    Select preferred doctor and time slot to book an appointment or consultation
                </p>
                <div className="static lg:absolute lg:left-[80px] w-full lg:w-auto">
                    <BookingForm />
                </div>
            </div>

            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
                <Image
                    className="w-full h-[300px] sm:h-[400px] lg:h-[600px] 2xl:h-[800px] rounded-3xl object-cover"
                    src={"https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt="Hero Image"
                    width={1200}
                    height={800}
                    priority
                />
            </div>
        </section>
    );
}

