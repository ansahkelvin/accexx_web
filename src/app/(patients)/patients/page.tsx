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
import {fetchPatientDashboard, fetchUserPatientDetails} from "@/app/actions/user";

export  default  async function DashboardPage() {
    const user = await fetchUserPatientDetails();
    const dashboard = await fetchPatientDashboard();

    if (!dashboard || !user) {
        return;
    }
    console.log(dashboard)
    const upcomingAppointments = dashboard.upcoming_appointments;



    // Simple upcoming appointments

    // Recent documents
    const recentDocuments = dashboard.recent_documents;

    // Notifications
    const notifications = [];

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome back, {user?.name.split(" ")[0]}</h1>
                <p className="text-gray-600 mt-1">Here&#39;s what&#39;s happening with your health today.</p>
            </div>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white p-4 md:p-6 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm">Next Appointment</p>
                        <h3 className="text-lg md:text-xl font-bold mt-1">{new Date(dashboard.latest_appointment.appointment_time).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                        })}</h3>
                        <p className="text-sm text-blue-100 mt-1">{dashboard.latest_appointment.appointment_location}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Calendar className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white p-4 md:p-6 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-purple-100 text-sm">Upcoming Schedule</p>
                        <h3 className="text-lg md:text-xl font-bold mt-1">{dashboard.appointment_count} Appointments</h3>
                        <p className="text-sm text-purple-100 mt-1">For the next 30 days</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Clock className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white p-4 md:p-6 shadow-lg flex items-center justify-between md:col-span-1 col-span-full">
                    <div>
                        <p className="text-emerald-100 text-sm">Recent Documents</p>
                        <h3 className="text-lg md:text-xl font-bold mt-1">{dashboard.file_counts}</h3>
                        <p className="text-sm text-emerald-100 mt-1">{new Date(dashboard.recent_documents[0].updated_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                        })}</p>
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
                                <div key={appointment.appointment_id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center mb-4 md:mb-0">
                                        <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-3 md:mr-4 object-contain">
                                            <AvatarImage className="object-cover" src={appointment.doctor.profile_image} alt={appointment.doctor.name} />
                                            <AvatarFallback>{appointment.doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{appointment.doctor.name}</h3>
                                            <p className="text-sm text-gray-500">{appointment.appointment_type.replace("_", " ").toLocaleUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                            {new Date(appointment.appointment_time).toLocaleDateString(undefined, {
                                                weekday: "short", // e.g., "Fri"
                                                year: "numeric",  // e.g., "2025"
                                                month: "long",    // e.g., "April"
                                                day: "numeric",   // e.g., "4"
                                            })}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                            {new Date(appointment.appointment_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                                            <p className="text-sm text-gray-500">{new Date(document.created_at).toLocaleDateString(undefined, {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })} • {new Date(document.created_at).toLocaleTimeString()}  </p>
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
                                <div className="py-10 text-center">
                                    No notifications
                                </div>
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