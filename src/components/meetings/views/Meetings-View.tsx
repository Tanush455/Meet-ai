"use client"

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
import React from 'react';
import { DataTables } from '@/components/data-tables';
import { MeetingsColumns } from '../ui/ColumnsMeetings';
import EmptyState from '@/components/Error-State-copy';
import { Meeting } from '../types';
import { useMeetingsFilters } from '../hooks/use-meeting-filters';
import DataPagination from '../ui/MeetingsPagination';
import { DEFAULT_PAGE_SIZE } from '@/constants';

// Define a new type that matches your data structure
interface MeetingWithDuration extends Omit<Meeting, 'EndedAt' | 'duration'> {
  EndedAt: Date | null;
  duration?: number | null;
}

export default function MeetingsView() {
  const trpc = useTRPC();
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters();

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
    ...filters,
  }));

  const totalPages = Math.ceil((data?.count ?? 0) / DEFAULT_PAGE_SIZE);

  // Convert all necessary date strings to Date objects
  const rows = (data?.dataWithDuration ?? []).map((meeting): MeetingWithDuration => ({
    ...meeting,
    createdAt: new Date(meeting.createdAt),
    updatedAt: new Date(meeting.updatedAt),
    StartedAt: meeting.StartedAt ? new Date(meeting.StartedAt) : new Date(meeting.createdAt),
    EndedAt: meeting.EndedAt ? new Date(meeting.EndedAt) : null,
    duration: meeting.duration,
    agents: {
      ...meeting.agents,
      createdAt: new Date(meeting.agents.createdAt),
      updatedAt: new Date(meeting.agents.updatedAt),
    }
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
        <p className="text-gray-600">View and manage all your meetings</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTables 
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
        data={rows} 
        columns={MeetingsColumns as any}/>
        <DataPagination page={filters.page} totalPages={totalPages} onPageChange={(page) => setFilters(prev => ({ ...prev, page }))} />
        {rows.length === 0 && (
          <div className="p-8">
            <EmptyState 
              title="Create your first meeting" 
              description="Plan your first session to start tracking summaries and durations." 
            />
          </div>
        )}
      </div>
    </div>
  )
}