// This is the server component that uses params

// In Next.js 15, params is a promise that must be awaited
import DoctorDetailPageClient from "@/app/(patients)/patients/doctors/[slug]/DoctorDetailPage";
import {fetchDoctorDetails} from "@/app/actions/user";
import {notFound} from "next/navigation";
import {cookies} from "next/headers";

export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    // Wait for params to resolve
    const resolvedParams = await params;
    const doctorId = resolvedParams.slug;
    
    if (!doctorId) return notFound();
    const cookie = await cookies();
    const patientId = cookie.get("user_id")?.value;

    if (!patientId) return notFound();

    const doctorInfo  = await fetchDoctorDetails(doctorId);
    console.log(doctorInfo);
    if (!doctorInfo) {
        return notFound();
    }


    return <DoctorDetailPageClient patientId={patientId} doctor={doctorInfo}/>;
}