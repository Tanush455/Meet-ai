"use client"
import React, { Dispatch, SetStateAction } from 'react'
import { CommandDialog, CommandInput, CommandItem } from '../ui/command'
import { CommandList } from 'cmdk'
interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

function DashboardCommand({open,setOpen}:Props) {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
        placeholder='Find a meeting or agent'/>
        <CommandList>
            <CommandItem>
                Test
            </CommandItem>
        </CommandList>
    </CommandDialog>
  )
}

export default DashboardCommand