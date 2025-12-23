import AgentsView from "@/components/Agents/view/agents-view";
import LoadingState from "@/components/LoadingState";
import ListHeader from "@/components/Agents/view/ListHeader";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/components/Agents/params";


interface Props {
    searchParams: Promise<SearchParams>
}


const AgentsPage = async ({ searchParams }: Props) => {

    const filters = await loadSearchParams(searchParams);


    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login')
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));
    return (
        <>
            <ListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<LoadingState title="It may take few seconds" description="Wait For some time please😊" />}>
                    <AgentsView />
                </Suspense>
            </HydrationBoundary>
        </>
    );
}

export default AgentsPage;