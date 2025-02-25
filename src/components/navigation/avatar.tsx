import { BASE_URL } from "@/config/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cookies } from "next/headers";

export default async function ProfileAvatar() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return null; // Don't redirect in a server component
    }

    try {
        const response = await fetch(`${BASE_URL}/users/patient/details`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            cache: "no-store"
        });

        if (!response.ok) {
            return null; // Avoid redirect in server components
        }

        const userData = await response.json();

        return (
            <Avatar>
                <AvatarImage src={userData.profile_image || ""} />
                <AvatarFallback>NA</AvatarFallback>
            </Avatar>
        );
    } catch (error) {
        console.error("Error fetching user data:", error);
        return <Avatar><AvatarFallback>!</AvatarFallback></Avatar>;
    }
}
