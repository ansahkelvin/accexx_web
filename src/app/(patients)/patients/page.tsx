import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import ProfileAvatar from "@/components/navigation/avatar";

export default function DashboardPage() {
    return (
        <div className="p-10">
            <div className="flex justify-between items-center space-x-2">
                <div>
                    <h1 className="font-bold text-xl text-gray-600">Dashboard</h1>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="max-w-xl relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <Search className="h-4 w-4" />
                        </div>
                        <Input
                            className="pl-10 w-full"
                            type="search"
                            placeholder="Search..."
                        />
                    </div>
                    <div>
                        <ProfileAvatar/>
                    </div>
                </div>



            </div>
            <div className="mt-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/patients">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

        </div>
    )
}