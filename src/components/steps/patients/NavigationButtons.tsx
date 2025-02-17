// components/NavigationButtons.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {NavigationButtonsProps} from "@/types/FormData";

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
                                                                 currentStep,
                                                                 stepsLength,
                                                                 onNext,
                                                                 onPrev,
                                                                 onSubmit
                                                             }) => {
    return (
        <div className="flex items-center justify-between pt-4">
            <button
                type="button"
                onClick={onPrev}
                className={`flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                    currentStep === 1
                        ? 'invisible'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
            </button>
            <button
                type={currentStep === stepsLength ? 'submit' : 'button'}
                onClick={currentStep === stepsLength ? onSubmit : onNext}
                className="flex items-center rounded-lg bg-[#9871ff] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#9871ff]"
            >
                {currentStep === stepsLength ? 'Complete Registration' : 'Continue'}
                {currentStep !== stepsLength && <ChevronRight className="ml-2 h-4 w-4" />}
            </button>
        </div>
    );
};

export default NavigationButtons;