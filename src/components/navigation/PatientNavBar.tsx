import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import ProfileAvatar from "@/components/navigation/avatar";

export default function Navbar() {
    return (
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 justify-end flex lg:justify-between items-center">

            <div className="hidden md:block flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        className="pl-10 bg-gray-50 border-gray-200"
                        placeholder="Search appointments, documents..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        2
                    </span>
                </div>
                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                <ProfileAvatar />
            </div>
        </div>
    );
}