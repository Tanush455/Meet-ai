"use client"
import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import { SearchFilter } from '@/components/Agents/view/agent-search-filter'
import AgentDialog from '@/components/Agents/view/new-AgentDialog'
import NewMeetingDialog from './new-MeetingDailog'
import { MeetingsSearchFilter } from './meetings-search-filters'
import { StatusFilter } from './status-filters'
import { AgentIdFilter } from './agent-id-filters'
import { useMeetingsFilters } from '../hooks/use-meeting-filters'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
function MeetingListHeader() {
  const [isopen, setIsopen] = useState(false);
  const [filters, setFilters] = useMeetingsFilters();

  const isAnyFilterModified = !!filters.status || !!filters.search || !!filters.agentId;

  const onClearFilter = () => {
    setFilters({
      status: null,
      search: "",
      agentId: "",
      page: 1
    })
  }

  return (
    <>
      <NewMeetingDialog open = {isopen} onOpenChange={setIsopen}/>
      <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h5 className='text-black font-medium'>My Meetings</h5>
          <Button onClick={() => setIsopen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <ScrollArea>
        <div className='flex items-center gap-x-2 p-1'>
          <MeetingsSearchFilter/>
          <StatusFilter/>
          <AgentIdFilter/>
          {
            isAnyFilterModified && (
              <Button variant="outline" onClick={onClearFilter} className='cursor-pointer'>
                <XCircleIcon/>
                Clear Filters</Button>
            )
          }
        </div>
        <ScrollBar orientation='horizontal'></ScrollBar>
        </ScrollArea>
      </div>
    </>
  )
}

export default MeetingListHeader