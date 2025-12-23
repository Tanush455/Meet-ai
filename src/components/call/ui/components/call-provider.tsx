"use client"
import { Loader2Icon, LoaderIcon } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { GenratedAvatar } from "@/lib/avatar"
import { CallConnect } from "./call-connect"

import { MeetingGetOne } from "@/components/meetings/types";

interface Props{
    meeting: MeetingGetOne
};

export const CallProvider = ({meeting} : Props) => {
    const {data, isPending} = authClient.useSession();

    if(!data || isPending){
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon/>
            </div>
        )
    }

    return (
        <CallConnect meeting={meeting} userId={data.user.id} username={data.user.name} userImage={data.user.image ?? GenratedAvatar({seed: data.user.name, variant: "initials"})}/>
    )
}