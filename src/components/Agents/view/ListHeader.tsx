"use client"
import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import AgentDialog from './new-AgentDialog'
import { SearchFilter } from './agent-search-filter'
import { useAgentsFilters } from '../hooks/use-agent-filters'

function ListHeader() {
  const [filters, setFilters] = useAgentsFilters();
  const [isopen, setIsopen] = useState(false);
  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: 1
    });
  }
  return (
    <>
      <AgentDialog open={isopen} onOpenChange={setIsopen} />
      <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h5 className='text-black font-medium'>My Agents</h5>
          <Button onClick={() => setIsopen((open) => !open)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <div className='flex items-center gap-x-2 p-1'>
          <SearchFilter />
          {isAnyFilterModified && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <XCircleIcon />
              clear
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default ListHeader