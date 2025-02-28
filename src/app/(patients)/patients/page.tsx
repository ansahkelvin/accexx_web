import {
    Search,
    Calendar,
    Clock,
    Phone,
    FileText,
    PlusCircle,
    ArrowRight,
    MessageSquare,
    ChevronRight,
    ShieldCheck,
    ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
    // Simple upcoming appointments
    const upcomingAppointments = [
        {
            id: 1,
            doctor: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            image: "/doctors/sarah-johnson.jpg",
            date: "March 3, 2025",
            time: "10:30 AM",
            location: "Main Hospital, Room 305",
            status: "confirmed"
        },
        {
            id: 2,
            doctor: "Dr. Michael Chen",
            specialty: "Dermatologist",
            image: "/doctors/michael-chen.jpg",
            date: "March 15, 2025",
            time: "2:00 PM",
            location: "Medical Center, Floor 2",
            status: "pending"
        }
    ];

    // Recent documents
    const recentDocuments = [
        { id: 1, name: "Medical History Form", type: "PDF", size: "1.2 MB", date: "Feb 20, 2025" },
        { id: 2, name: "Insurance Information", type: "PDF", size: "0.8 MB", date: "Feb 18, 2025" },
        { id: 3, name: "Prescription Details", type: "PDF", size: "0.5 MB", date: "Feb 10, 2025" }
    ];

    // Notifications
    const notifications = [
        { id: 1, message: "Appointment reminder: Dr. Johnson tomorrow at 10:30 AM", time: "1 hour ago", isNew: true },
        { id: 2, message: "Your lab results are now available", time: "Yesterday", isNew: true },
        { id: 3, message: "Insurance verification complete", time: "3 days ago", isNew: false }
    ];

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome back, Alex</h1>
                <p className="text-gray-600 mt-1">Here&#39;s what&#39;s happening with your health today.</p>
            </div>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white p-4 md:p-6 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm">Next Appointment</p>
                        <h3 className="text-lg md:text-xl font-bold mt-1">March 3, 2025</h3>
                        <p className="text-sm text-blue-100 mt-1">Dr. Sarah Johnson • 10:30 AM</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Calendar className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white p-4 md:p-6 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-purple-100 text-sm">Upcoming Schedule</p>
                        <h3 className="text-lg md:text-xl font-bold mt-1">2 Appointments</h3>
                        <p className="text-sm text-purple-100 mt-1">For the next 30 days</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Clock className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white p-4 md:p-6 shadow-lg flex items-center justify-between md:col-span-1 col-span-full">
                    <div>
                        <p className="text-emerald-100 text-sm">Recent Documents</p>
                        <h3 className="text-lg md:text-xl font-bold mt-1">3 Files</h3>
                        <p className="text-sm text-emerald-100 mt-1">Last updated Feb 20, 2025</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <FileText className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Content (Left and Middle) */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                    {/* Upcoming Appointments Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Upcoming Appointments</h2>
                            <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100 w-full sm:w-auto">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Book New
                            </Button>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {upcomingAppointments.map((appointment) => (
                                <div key={appointment.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center mb-4 md:mb-0">
                                        <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-3 md:mr-4">
                                            <AvatarImage src={appointment.image} alt={appointment.doctor} />
                                            <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                                            <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                            {appointment.date}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                            {appointment.time}
                                        </div>
                                        <Badge className={appointment.status === "confirmed" ? "bg-green-100 text-green-800 border border-green-200" : "bg-yellow-100 text-yellow-800 border border-yellow-200"}>
                                            {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                                        </Badge>
                                    </div>

                                    <Button variant="ghost" size="sm" className="mt-4 md:mt-0 text-blue-600">
                                        Details
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t border-gray-100">
                            <Button variant="link" className="text-blue-600 p-0 h-auto font-medium">
                                View all appointments
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Recent Documents</h2>
                            <Button className="bg-gray-50 text-gray-600 hover:bg-gray-100 w-full sm:w-auto">
                                Upload New
                            </Button>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {recentDocuments.map((document) => (
                                <div key={document.id} className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center mb-3 sm:mb-0">
                                        <div className="bg-blue-100 p-2 md:p-3 rounded-lg mr-3 md:mr-4">
                                            <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{document.name}</h3>
                                            <p className="text-sm text-gray-500">{document.type} • {document.size} • {document.date}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="flex items-center self-end sm:self-auto">
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t border-gray-100">
                            <Button variant="link" className="text-blue-600 p-0 h-auto font-medium">
                                View all documents
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6 lg:space-y-8">
                    {/* Search Box */}
                    <Card className="overflow-hidden border-none shadow-sm">
                        <CardContent className="p-0">
                            <div className="bg-gray-900 p-4 md:p-6 text-white">
                                <h3 className="text-lg font-medium">Quick Search</h3>
                                <p className="text-gray-400 text-sm">Find appointments, documents, and more</p>

                                <div className="mt-4 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                                        placeholder="Type to search..."
                                    />
                                </div>
                            </div>

                            <div className="px-4 md:px-6 py-3 md:py-4 divide-y divide-gray-100">
                                <Button variant="ghost" className="w-full justify-start py-3 px-0 text-gray-700">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                    Find appointments
                                </Button>
                                <Button variant="ghost" className="w-full justify-start py-3 px-0 text-gray-700">
                                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                    Browse documents
                                </Button>
                                <Button variant="ghost" className="w-full justify-start py-3 px-0 text-gray-700">
                                    <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                                    Message doctor
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="overflow-hidden border-none shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-medium">Notifications</CardTitle>
                                <Button variant="ghost" size="sm" className="text-blue-600">
                                    Mark all read
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 ${notification.isNew ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className={`${notification.isNew ? 'text-blue-800' : 'text-gray-700'} font-medium`}>
                                                {notification.message}
                                            </div>
                                            {notification.isNew && (
                                                <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                                                    New
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support Card */}
                    <Card className="overflow-hidden border-none shadow-sm bg-gradient-to-br from-indigo-50 to-blue-50">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-center text-lg font-medium text-gray-900">Need Assistance?</h3>
                            <p className="text-center text-gray-600 text-sm mt-2">
                                Our support team is available 24/7 to help with any questions you might have.
                            </p>
                            <div className="mt-6">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Contact Support
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}