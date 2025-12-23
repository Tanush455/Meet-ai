"use client"
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { any, z } from 'zod';
import { useForm } from 'react-hook-form';
import { meetingsInsertSchema, meetingsUpdateSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea';
import GenratedAvatar from '@/components/genratedAvatar';
import { FormInput } from 'lucide-react';
import CommandSelect from '@/components/command-select';
import { toast } from 'sonner';
import { MeetingGetOne } from '../types';
import AgentDialog from '@/components/Agents/view/new-AgentDialog';


interface AgentFromProps {
  onSuccess?: (id?: string) => void,
  onCancel?: () => void,
  initialValues?: MeetingGetOne;
}

function MeetingForm({ onSuccess, onCancel, initialValues }: AgentFromProps) {
  const [open, setOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();


  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch
    }),
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        )

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({
              id: initialValues.id,
            })
          )
        }
        toast.success("Meeting created successfully!");
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );


        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({
              id: initialValues.id,
            })
          )
        }

        toast.success("Meeting updated successfully!");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  );


  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    }
  });


  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit && initialValues?.id) {
      updateMeeting.mutate({
        id: initialValues.id,
        ...values
      });
    } else {
      createMeeting.mutate(values);
    }
  }
  return (
    <>
    <AgentDialog open={open} onOpenChange={setOpen}/>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <GenratedAvatar seed={form.watch("name")} variant='bottsNetutral' className='border size-16' />

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='eg: Math Tutor' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        <FormField
          name="agentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
                                  <CommandSelect
                                    options={(agents.data ?? []).map((agent) => ({
                                      id: agent.id,
                                      value: agent.id,
                                      children: (
                                        <div className='flex items-center gap-x-2'>
                                          <GenratedAvatar seed={agent.name} variant='bottsNetutral' className='border size-6' />
                                          <span>{agent.name}</span>
                                        </div>
                                      )
                                    }))}
                                    onSelect={field.onChange}
                                    onSearch={setAgentSearch}
                                    value={field.value}
                                    searchValue={agentSearch}
                                    placeholder={agents.isLoading ? "Loading agents..." : agents.error ? "Error loading agents" : "Select an agent"}
                                    />

              <FormDescription>
                Not Found What you&apos;re looking for?{" "}
                <button
                  type='button'
                  className='text-primary hover:underline'
                  onClick={() => setOpen(true)}>Create new agnet</button>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
        <div className='flex justify-between gap-x-2'>
          {onCancel && (
            <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={(e) => onCancel()}
            >
              cancel
            </Button>
          )}
          <Button disabled={isPending} type='submit'>
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form >
  </>
  )
}

export default MeetingForm