import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {User} from "@/app/actions/user";

export default async function ProfileAvatar({ user }: { user: User}) {

        try{
        return (
            <Avatar>
                <AvatarImage src={user?.profile_image || ""} />
                <AvatarFallback>NA</AvatarFallback>
            </Avatar>
        );

    } catch (error) {
        console.error("Error fetching user data:", error);
        return <Avatar><AvatarFallback>!</AvatarFallback></Avatar>;
    }
}
