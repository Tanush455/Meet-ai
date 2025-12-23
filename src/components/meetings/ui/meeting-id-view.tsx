"use client"
import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import MeetingIdViewHeader from "./MeetingIdViewHeader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MeetingStatus } from "../types";
import { UpcomingState } from "./upcomingState";
import { ActiveState } from "./ActiveState";
import { CanceledState } from "./CancledState";
import { ProcessingState } from "./ProcessingState";
interface Props {
    meetingId: string;
};


export const MeetingIdViewLoading = () => {
    return (
        <LoadingState
        title="Loading Meeting"
        description="This may take a few seconds. Please wait..."/>
    )
}


export const MeetingIdViewError = () => {
    return (
        <ErrorState
        title="Error Loading Meeting"
        description="Please try again later."/>
    )
}

export const MeetingIdView = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const {data} = useSuspenseQuery(trpc.meetings.getOne.queryOptions({
        id:meetingId
    }));

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess:() => {
                queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );

                router.push('/meetings');
            },
            onError:(error) => {
                toast.error(error.message);
            }
        })
    );

    const isActive = data.existingMeeting.status === MeetingStatus.Active;
    const isCompleted = data.existingMeeting.status === MeetingStatus.Completed;
    const isProcessing = data.existingMeeting.status === MeetingStatus.Processing;
    const isCancelled = data.existingMeeting.status === MeetingStatus.Cancelled;
    const isUpcoming = data.existingMeeting.status === MeetingStatus.Upcoming;

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getOne.queryOptions({ id: meetingId })
                );
                toast.success("Meeting updated successfully!");
            },
            onError: (error) => {
                toast.error(error.message);
            }
        })
    );

    return (
        <>
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader 
                meetingId={data.existingMeeting.id} 
                meetingName={data.existingMeeting.name} 
                onEdit={(updatedName) => updateMeeting.mutate({ id: meetingId, name: updatedName, agentId: data.existingMeeting.agentId })}
                onRemove={() => removeMeeting.mutate({ id: meetingId, name: data.existingMeeting.name, agentId: data.existingMeeting.agentId })}/>

                {isCancelled && <CanceledState/>}
                {isProcessing && <ProcessingState/>}
                {isActive && <ActiveState meetingId={meetingId}/>}
                {isUpcoming && <UpcomingState meetingId={meetingId} onCancleMeeting={() => {}} isCancelling={false}/>}
                {isCompleted && <div></div>}
            </div>
        </>
    )
}