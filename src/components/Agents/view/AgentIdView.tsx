"use client"
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import AgentIdViewHeader from './AgentIdViewHeader'
import React from 'react'
import GenratedAvatar from '@/components/genratedAvatar';
import { Badge } from '@/components/ui/badge';
import { VideoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  agentId: string
}
export default function AgentIdView({ agentId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

  const removeAgents = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        // TODO : Invalidate free tier usage
        router.push("/agents")
        toast.success("Deleted")
      },
      onError: (error) => {
        toast.error("Not Able to remove")
      }
    })
  )

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: agentId }));
        toast.success("Updated successfully")
      },
      onError: (error) => {
        toast.error("Not able to update")
      }
    })
  )
  return (
    <div className='flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4'>
      <AgentIdViewHeader agentId={agentId}
        agentName={data.name}
        agentInstructions={data.instructions}
        onEdit={(updatedName, updatedInstructions) => updateAgent.mutate({ id: agentId, name: updatedName, instructions: updatedInstructions })}
        onRemove={() => removeAgents.mutate({ id: agentId })} />
      <div className='bg-white rounded-lg border'>
        <div className='px-4 py-5 gap-y-5 flex flex-col col-span-5'>
          <div className='flex items-center gap-x-3'>
            <GenratedAvatar
              variant='bottsNetutral'
              seed={data.name}
              className='size-10'
            />
          </div>
          <Badge
            variant="outline"
            className='flex items-center gap-x-2 [&>svg]:size-4'>
            <VideoIcon className='text-blue-700' />
            {data._count.meetings} {data._count.meetings > 1 ? "meetings" : "meeting"}
          </Badge>
          <div className='flex flex-col gap-y-4'>
            <p className='text-lg font-medium'>Instructions</p>
            <p className='text-neutral-500'>{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
