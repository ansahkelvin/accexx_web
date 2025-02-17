import Image from "next/image";

export default function WhyChooseUs() {
    return (
        <div className="w-full px-4 md:px-10 lg:px-24 py-16 max-w-[2560px] mx-auto">
            {/* Top Section */}
            <div className="mb-24">
                <h3 className="text-[#9871ff] font-medium mb-4">WHY CHOOSE US</h3>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold max-w-4xl leading-tight">
                    We provide the best health services for patients. You can consult with our{" "}
                    <span className="text-[#9871ff]">
                        professional doctors by making an appointment consult
                    </span>
                    .
                </h2>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
                {/* Left Content */}
                <div className="w-full lg:w-1/2">
                    <h3 className="text-[#9871ff] font-medium mb-4">OUR DOCTORS</h3>
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
                        Consultation with our professional doctors
                    </h2>
                    <p className="text-gray-600 mb-12 max-w-xl">
                        Not to worry, our professional doctors are experienced in treating and serving
                        the needs of patients. We have doctors from various specialties, so that our
                        patients will be facilitated in curing all diseases.
                    </p>

                    {/* Statistics */}
                    <div className="flex gap-16">
                        <div>
                            <h3 className="text-[#9871ff] text-3xl sm:text-4xl font-bold mb-2">
                                +10 yrs
                            </h3>
                            <p className="text-gray-600 text-sm max-w-[200px]">
                                Most of our doctors have 10+ years of experience serving patients
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[#9871ff] text-3xl sm:text-4xl font-bold mb-2">
                                +230K
                            </h3>
                            <p className="text-gray-600 text-sm max-w-[200px]">
                                They have been serving patients both online and offline
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="w-full lg:w-1/2 relative">
                    <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full">
                        <Image
                            src="https://images.unsplash.com/photo-1643663439099-6e153739c471?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Professional Doctor"
                            fill
                            className="object-cover rounded-3xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}