import React from "react";
import {User} from "lucide-react";

interface PatientProfileImageProps {
    imageUrl: string;
    name: string;
    size?: 'sm' | 'md' | 'lg';
}

const PatientProfileImage: React.FC<PatientProfileImageProps> = ({ imageUrl, name, size = 'md' }) => {
    // Size classes for different display options
    const sizeClasses: Record<string, string> = {
        sm: "h-10 w-10",
        md: "h-12 w-12",
        lg: "h-16 w-16"
    };

    const iconSizes: Record<string, number> = {
        sm: 18,
        md: 24,
        lg: 32
    };

    // Determine the correct size class
    const sizeClass = sizeClasses[size] || sizeClasses.md;
    const iconSize = iconSizes[size] || iconSizes.md;

    // If there's a valid profile image, display it
    if (imageUrl && imageUrl !== "null" && !imageUrl.includes("undefined")) {
        return (
            <div className={`${sizeClass} rounded-full overflow-hidden border-2 border-blue-100`}>
                {/* eslint-disable @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={`${name}'s profile`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // If image fails to load, replace with user icon
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentNode as HTMLElement;
                        if (parent) {
                            parent.classList.add('bg-blue-100');
                            parent.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                        }
                    }}
                />
            </div>
        );
    }

    // Fallback to user icon
    return (
        <div className={`${sizeClass} rounded-full bg-blue-100 flex items-center justify-center`}>
            <User size={iconSize} className="text-blue-600" />
        </div>
    );
};

export default PatientProfileImage;