import LoadingState from '@/components/LoadingState';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import AgentIdView from '@/components/Agents/view/AgentIdView';

interface Props{
    params: Promise<{agentId: string}>
};

export default async function page({params}:Props) {

    const {agentId} = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({
            id:agentId
        })
    )
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LoadingState title="It may take few seconds" description="Wait For some time please😊"/>}>
        <AgentIdView agentId={agentId}/>
        </Suspense>
    </HydrationBoundary>
  )
}
