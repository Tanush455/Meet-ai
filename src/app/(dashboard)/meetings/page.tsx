import LoadingState from "@/components/LoadingState";
import MeetingListHeader from "@/components/meetings/ui/Meetings-ListHeaders";
import MeetingsView from "@/components/meetings/views/Meetings-View"
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/components/meetings/params";

interface Props {
    searchParams: Promise<SearchParams>
}
export default async function page({searchParams}:Props) {
    const params = await loadSearchParams(searchParams);
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session){
        redirect('/login')
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({
            ...params
        })
    )
    return (
        <>
        <MeetingListHeader/>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<LoadingState title="Loading Meetings" description="Please wait while we fetch your meetings..." />}>
                <MeetingsView />
                </Suspense>
            </HydrationBoundary>
        </>
    )
}
