import React from 'react';
import {StepperHeaderProps} from "@/types/FormData";

const StepperHeader: React.FC<StepperHeaderProps> = ({ steps, currentStep }) => {
    return (
        <div className="border-b border-gray-200 bg-gray-50 px-8 py-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.title} className="flex flex-col items-center">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                                currentStep > index + 1
                                    ? 'border-[#9871ff] bg-[#9871ff] text-white'
                                    : currentStep === index + 1
                                        ? 'border-[#9871ff] text-[#9871ff]'
                                        : 'border-gray-300 text-gray-300'
                            }`}
                        >
                            <step.icon className="h-6 w-6" />
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-700">{step.title}</p>
                        <p className="mt-1 text-xs text-gray-500 text-center">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepperHeader;