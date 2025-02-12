import { Button } from "@/components/ui/button";
import { User, MapPinned, Calendar, Lightbulb } from "lucide-react";
import { FC } from 'react';
import StepsCard, { StepCardProps } from "../card/StepsCard";

type Step = StepCardProps

const Steps: FC = () => {
    const steps: Step[] = [
        {
            icon: {
                component: <User className="w-6 h-6 text-cyan-500" />,
                bg: "rgba(8, 183, 200, 0.1)"
            },
            title: "Search Doctor",
            description: "Before book appointment first of all search doctor by category"
        },
        {
            icon: {
                component: <MapPinned className="w-6 h-6 text-purple-500" />,
                bg: "rgba(124, 58, 237, 0.1)"
            },
            title: "Choose Your Location",
            description: "Then enter your location and we will help you find appointment near you"
        },
        {
            icon: {
                component: <Calendar className="w-6 h-6 text-red-500" />,
                bg: "rgba(239, 68, 68, 0.1)"
            },
            title: "Schedule Appointment",
            description: "Then select a date to set an appointment with your doctor"
        },
        {
            icon: {
                component: <Lightbulb className="w-6 h-6 text-yellow-500" />,
                bg: "rgba(234, 179, 8, 0.1)"
            },
            title: "Get Your Solution",
            description: "We will help you find and provide solutions for your health"
        }
    ];

    return (
        <div className="relative my-12 md:my-24">
            {/* Cyan background section */}
            <section className="min-h-[400px] md:min-h-[300px] rounded-2xl bg-[#9871ff] w-[95%] md:w-[90%] mx-auto p-6 md:p-16">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 md:justify-between text-white">
                    <h1 className="text-xl md:text-2xl font-semibold max-w-xs">
                        Easy Steps To Get Your Solution
                    </h1>
                    <p className="text-sm max-w-sm">
                        Easily make an appointment with our best doctor for your families in the same day or next day
                    </p>
                    <Button className="bg-white text-[#3B82F6] hover:bg-gray-100 shadow-none outline-0">
                        Make an appointment
                    </Button>
                </div>
            </section>

            {/* Cards section - positioned below the cyan background */}
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-[95%] md:w-[90%] mx-auto -mt-32 gap-6 md:gap-10 px-4 md:px-16">
                {steps.map((step, index) => (
                    <StepsCard
                        key={index}
                        icon={step.icon}
                        title={step.title}
                        description={step.description}
                    />
                ))}
            </div>
        </div>
    );
}

export default Steps;