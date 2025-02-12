// types.ts
import {FC, ReactElement} from 'react';
import { Card } from "@/components/ui/card";

interface IconConfig {
    component: ReactElement;
    bg: string;
}

export interface StepCardProps {
    icon: IconConfig;
    title: string;
    description: string;
}


const StepsCard: FC<StepCardProps> = ({ icon, title, description }) => {
    return (
        <Card className="bg-white w-full p-4 md:p-6 text-center flex flex-col items-center gap-3 md:gap-4 shadow-lg">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: icon.bg }}>
                {icon.component}
            </div>
            <h3 className="font-semibold text-gray-800 text-base md:text-lg">{title}</h3>
            <p className="text-xs md:text-sm text-gray-500">{description}</p>
        </Card>
    );
}

export default StepsCard;

