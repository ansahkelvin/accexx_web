import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {DoctorDetails, User} from "@/types/types";

export default async function ProfileAvatar({ user }: { user: User | DoctorDetails}) {

        try{
        // Get user initials from fullName or name
        const userName = (user as User).fullName || (user as User).name || (user as DoctorDetails).name || "User";
        const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase();
        
        return (
            <Avatar>
                <AvatarImage src={user?.profile_image || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
        );

    } catch (error) {
        console.error("Error fetching user data:", error);
        return <Avatar><AvatarFallback>!</AvatarFallback></Avatar>;
    }
}
