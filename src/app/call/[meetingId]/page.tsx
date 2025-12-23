import { Callview } from "@/components/call/ui/views/call-view";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  params: {
    meetingId: string;
  };
}

export default async function Page({ params }: Props) {
  const { meetingId } = params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session){
        redirect('/login')
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({
            id:meetingId
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Callview meetingId={meetingId}/>
        </HydrationBoundary>
    )
}