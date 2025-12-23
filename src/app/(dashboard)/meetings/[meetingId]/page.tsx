import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import React, { Suspense } from 'react'
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import LoadingState from '@/components/LoadingState';
import { MeetingIdView } from '@/components/meetings/ui/meeting-id-view';
interface Props{
  params: Promise<{meetingId : string}>;
}
export default async function page({params}:Props) {
  const {meetingId} = await params;
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if(!session){
    redirect('/login');
  }

  const queryCLient = getQueryClient();
  void queryCLient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId
    })
  );

  // TODOD prefetch get Transcript
  return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <Suspense fallback={<LoadingState title="It may take few seconds" description="Wait For some time please😊"/>}>
      <MeetingIdView meetingId={meetingId}/>
      </Suspense>
    </HydrationBoundary>
  )
}
