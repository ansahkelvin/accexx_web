import { useState, useCallback } from "react";
import { Calendar, momentLocalizer, View, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DoctorAppointment } from "@/service/doctors/doctor";
import { Calendar as CalendarIcon, List, Grid, ChevronLeft, ChevronRight, User, Clock } from "lucide-react";

const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
    title: string;
    start: Date;
    end: Date;
    appointment?: DoctorAppointment;
}

const AppointmentsCalendar = ({ appointments }: { appointments: DoctorAppointment[] }) => {
    const [view, setView] = useState<View>("month");
    const [date, setDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const events: CalendarEvent[] = appointments.map((appointment) => ({
        title: `${appointment.patient_name} - ${appointment.doctor_name}`,
        start: new Date(appointment.appointment_time),
        end: new Date(new Date(appointment.appointment_time).getTime() + 45 * 60000),
        appointment
    }));

    const ViewToggle = () => (
        <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full p-1 shadow-inner">
            <button
                onClick={() => setView("month")}
                className={`p-2 rounded-full transition-all duration-300 ${
                    view === "month"
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
                aria-label="Month view"
            >
                <CalendarIcon size={20} />
            </button>
            <button
                onClick={() => setView("week")}
                className={`p-2 rounded-full transition-all duration-300 ${
                    view === "week"
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
                aria-label="Week view"
            >
                <Grid size={20} />
            </button>
            <button
                onClick={() => setView("day")}
                className={`p-2 rounded-full transition-all duration-300 ${
                    view === "day"
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
                aria-label="Day view"
            >
                <List size={20} />
            </button>
        </div>
    );

    const goToToday = useCallback(() => setDate(new Date()), []);

    const goToPrev = useCallback(() => {
        const newDate = moment(date).subtract(1, view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days').toDate();
        setDate(newDate);
    }, [date, view]);

    const goToNext = useCallback(() => {
        const newDate = moment(date).add(1, view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days').toDate();
        setDate(newDate);
    }, [date, view]);

    const NavigationToolbar = () => (
        <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-center">
                    <button
                        onClick={goToToday}
                        className="px-4 py-1.5 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium shadow-sm"
                    >
                        Today
                    </button>
                    <div className="flex items-center mx-6">
                        <button
                            onClick={goToPrev}
                            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                            aria-label="Previous"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={goToNext}
                            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors ml-3"
                            aria-label="Next"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                    <div className="text-2xl font-bold">
                        {moment(date).format(view === 'month' ? 'MMMM YYYY' : view === 'week' ? 'MMM D - ' + moment(date).endOf('week').format('MMM D, YYYY') : 'dddd, MMMM D')}
                    </div>
                </div>
                <ViewToggle />
            </div>
        </div>
    );

    // Event details modal
    const EventDetailsModal = () => {
        if (!selectedEvent) return null;

        const { appointment } = selectedEvent;
        if (!appointment) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
                <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Appointment Details</h3>
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center mb-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <User size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">{appointment.patient_name}</h4>
                                <p className="text-sm text-gray-500">Patient</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <User size={20} className="text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">{appointment.doctor_name}</h4>
                                <p className="text-sm text-gray-500">Doctor</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center mb-2">
                            <Clock size={16} className="text-gray-500 mr-2" />
                            <div>
                                <p className="text-gray-700">
                                    {moment(appointment.appointment_time).format('dddd, MMMM D, YYYY')}
                                </p>
                                <p className="text-gray-700">
                                    {moment(appointment.appointment_time).format('h:mm A')} - {moment(appointment.appointment_time).add(45, 'minutes').format('h:mm A')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                            {appointment.status}
                        </span>
                    </div>

                    {appointment.reason && (
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Reason</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{appointment.reason}</p>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Reschedule
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Event styling
    const eventStyleGetter = (event: CalendarEvent) => {
        const statusColors: Record<string, { bg: string, border: string }> = {
            confirmed: { bg: '#10B981', border: '#059669' }, // green
            pending: { bg: '#F59E0B', border: '#D97706' },   // yellow
            canceled: { bg: '#EF4444', border: '#DC2626' },  // red
            completed: { bg: '#3B82F6', border: '#2563EB' }, // blue
        };

        const status = event.appointment?.status.toLowerCase() || 'pending';
        const colors = statusColors[status] || statusColors.pending;

        return {
            style: {
                backgroundColor: colors.bg,
                borderLeft: `4px solid ${colors.border}`,
                borderRadius: '4px',
                color: 'white',
                opacity: 0.9,
                fontWeight: 500,
                padding: '2px 6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
        };
    };

    // Day styling
    const dayPropGetter = (date: Date) => {
        const today = new Date();
        if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ) {
            return {
                className: 'bg-blue-50',
                style: {
                    border: '2px solid #3B82F6',
                }
            };
        }

        // Weekend styling
        const day = date.getDay();
        if (day === 0 || day === 6) { // Sunday or Saturday
            return {
                className: 'bg-gray-50'
            };
        }

        return {};
    };

    // Handle event selection
    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    return (
        <div className="w-full h-screen overflow-hidden rounded-lg border border-gray-200">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden h-full">
                <NavigationToolbar />
                <div className="p-2">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        views={["month", "week", "day"]}
                        view={view}
                        date={date}
                        onView={(newView: View) => setView(newView)}
                        onNavigate={(newDate: Date) => setDate(newDate)}
                        eventPropGetter={eventStyleGetter}
                        dayPropGetter={dayPropGetter}
                        onSelectEvent={handleSelectEvent}
                        popup
                        selectable
                        className="h-[70vh]"
                        style={{
                            height: '100%',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>
            </div>
            <EventDetailsModal />
        </div>
    );
};

export default AppointmentsCalendar;