"use client"
import ErrorState from "@/components/ErrorState";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";
interface Props {
    meetingId: string,
}

export const Callview = ({meetingId}:Props) => {
    const trpc = useTRPC();

    const {data} = useSuspenseQuery(trpc.meetings.getOne.queryOptions({
        id:meetingId
    }));

    if(data.existingMeeting.status === 'complete'){
        return (
            <div className="flex h-screen items-center justify-center">
                <ErrorState title="Meeting has ended" description="You can no longer join this meeting"/>
            </div>
        )
    }
    return (
        <CallProvider meeting={data.existingMeeting}/>
    )
}