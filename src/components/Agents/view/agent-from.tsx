"use client"
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react'
import { any, z } from 'zod';
import { useForm } from 'react-hook-form';
import { agentsInsertSchema } from '../schemas';
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
import { toast } from 'sonner';
import { AgentGetOne } from '../types';


interface AgentFromProps {
  onSuccess?: () => void,
  onCancel?: () => void,
  initialValues?: AgentGetOne;
}

function AgentForm({ onSuccess, onCancel, initialValues }: AgentFromProps) {

  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async() => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        )

        if(initialValues?.id){
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({
              id: initialValues.id,
            })
          )
        }
        toast.success("Agent created successfully!");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async() => {
        // Clear all agents-related cache and force refetch
        await queryClient.removeQueries({
          queryKey: ['agents']
        });
        
        // Force immediate refetch of all agents data
        await queryClient.refetchQueries({
          queryKey: ['agents']
        });
        
        toast.success("Agent updated successfully!");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  );


  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    }
  });


  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit && initialValues?.id) {
      updateAgent.mutate({
        id: initialValues.id,
        ...values
      });
    } else {
      createAgent.mutate(values);
    }
  }
  return (
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
                <Input {...field} placeholder='eg: Math Tutor'/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder='Explain the content Needed'/>
              </FormControl>
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
  )
}

export default AgentForm