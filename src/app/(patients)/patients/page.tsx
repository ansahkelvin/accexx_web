import {
    Search,
    Calendar,
    Clock,
    ArrowRight,
    MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {fetchPatientDashboard, fetchUserPatientDetails} from "@/app/actions/user";
import Link from "next/link";



export default async function DashboardPage() {
    const user = await fetchUserPatientDetails();
    const dashboard = await fetchPatientDashboard();

    // Early return with fallback UI if no data is available
    if (!dashboard || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Unable to load dashboard</h1>
                    <p className="text-gray-600">Please try again later or contact support if the issue persists.</p>
                </div>
            </div>
        );
    }

    // Safe access with proper typing - use fullName from API response
    const userName = user.fullName?.split(" ")?.[0] ?? user.name?.split(" ")?.[0] ?? "User";
    const upcomingAppointments = dashboard.upcoming_appointments ?? [];
    const latestAppointment = dashboard.latest_appointment;
    const appointmentCount = dashboard.appointment_count ?? 0;

    // Format date safely with TypeScript
    const formatDate = (dateString: string | undefined | null, options: Intl.DateTimeFormatOptions = {}): string => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (error) {
            console.log(error);

            return "Invalid date";
        }
    };

    // Format time safely with TypeScript
    const formatTime = (dateString: string | undefined | null, options: Intl.DateTimeFormatOptions = {}): string => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleTimeString([], options);
        } catch (error) {
            console.log(error);
            return "Invalid time";
        }
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome back, {userName}</h1>
                <p className="text-gray-600 mt-1">Here&#39;s what&#39;s happening with your health today.</p>
            </div>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white p-4 md:p-6 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm">Next Appointment</p>
                        <h3 className="text-lg md:text-xl font-bold mt-1">
                            {latestAppointment ? formatDate(
                                'appointmentDateTime' in latestAppointment 
                                    ? latestAppointment.appointmentDateTime 
                                    : (latestAppointment as any).appointment_time, 
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                }
                            ) : "No new upcoming appointment"}
                        </h3>
                        <p className="text-sm text-blue-100 mt-1">
                            {latestAppointment && 'doctor' in latestAppointment 
                                ? (latestAppointment.doctor as any)?.fullName 
                                : (latestAppointment as any)?.appointment_location ?? ""}
                        </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Calendar className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white p-4 md:p-6 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-purple-100 text-sm">Total Appointments</p>
                        <h3 className="text-lg md:text-xl font-bold mt-1">{appointmentCount} Appointments</h3>
                        <p className="text-sm text-purple-100 mt-1">Since Joining</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Clock className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white p-4 md:p-6 shadow-lg flex items-center justify-between md:col-span-1 col-span-full">
                    <div>
                        <p className="text-emerald-100 text-sm">Total Appointments</p>
                        <h3 className="text-lg md:text-xl font-bold mt-1">{appointmentCount}</h3>
                        <p className="text-sm text-emerald-100 mt-1">
                            {formatDate(latestAppointment ? (
                                'appointmentDateTime' in latestAppointment 
                                    ? latestAppointment.appointmentDateTime 
                                    : (latestAppointment as any).appointment_time
                            ) : null, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Calendar className="h-6 md:h-8 w-6 md:w-8" />
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
                           
                        </div>

                        <div className="divide-y divide-gray-100">
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map((appointment) => {
                                    // Handle both old and new API response structures
                                    const isNewFormat = 'id' in appointment && 'appointmentDateTime' in appointment;
                                    
                                    const appointmentId = isNewFormat ? appointment.id : appointment.appointment_id;
                                    const doctorName = isNewFormat ? appointment.doctor?.fullName : appointment.doctor?.name;
                                    const doctorImage = isNewFormat ? appointment.doctor?.profilePicture : appointment.doctor?.profile_image;
                                    const doctorSpecialization = isNewFormat ? appointment.doctor?.specialization : appointment.appointment_type;
                                    const appointmentTime = isNewFormat ? appointment.appointmentDateTime : appointment.appointment_time;
                                    const appointmentStatus = appointment.status;
                                    const appointmentNotes = isNewFormat ? appointment.notes : '';
                                    
                                    return (
                                        <div key={appointmentId} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center mb-4 md:mb-0">
                                                <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-3 md:mr-4 object-contain">
                                                    <AvatarImage className="object-cover" src={doctorImage ?? ""} alt={doctorName ?? "Doctor"} />
                                                    <AvatarFallback>{doctorName ? doctorName.split(' ').map((n: string) => n[0]).join('') : "DR"}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{doctorName ?? "Unknown Doctor"}</h3>
                                                    <p className="text-sm text-gray-500">{doctorSpecialization ? doctorSpecialization.toUpperCase() : "APPOINTMENT"}</p>
                                                    {appointmentNotes && (
                                                        <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">{appointmentNotes}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                                    {formatDate(appointmentTime, {
                                                        weekday: "short",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </div>

                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                                    {formatTime(appointmentTime, { hour: "2-digit", minute: "2-digit" })}
                                                </div>

                                                <Badge className={
                                                    appointmentStatus === "CONFIRMED" 
                                                        ? "bg-green-100 text-green-800 border border-green-200" 
                                                        : appointmentStatus === "COMPLETED"
                                                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                }>
                                                    {appointmentStatus === "CONFIRMED" ? "Confirmed" : 
                                                     appointmentStatus === "COMPLETED" ? "Completed" : 
                                                     appointmentStatus === "PENDING" ? "Pending" : 
                                                     appointmentStatus === "CANCELLED" ? "Cancelled" : appointmentStatus}
                                                </Badge>
                                            </div>

                                            
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    No upcoming appointments
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t border-gray-100">
                            <Button
                            asChild
                             variant="link" className="text-blue-600 p-0 h-auto font-medium">
                                <Link href="/patients/appointments">
                                    View all appointments
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
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

                            <div className="px-4 md:px-6 py-3 md:py-4 divide-y divide-gray-100 cursor-pointer">
                                <Button variant="ghost" className="w-full justify-start py-3 px-0 text-gray-700">
                                    <Link className="flex items-center cursor-pointer" href={'/patients/doctors'}>
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        Find appointments
                                    </Link>
                                </Button>
                                <Button variant="ghost" className="w-full justify-start py-3 px-0 text-gray-700">
                                    <Link className="flex items-center" href={'/patients/inbox'}>
                                        <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                                        Message doctor
                                    </Link>
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
                </div>
            </div>
        </>
    );
}