"use client"
import React, { Dispatch, SetStateAction } from 'react'
import { CommandResponsiveDialog, CommandInput, CommandItem } from '../ui/command'
import { CommandList } from 'cmdk'
interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

function DashboardCommand({open,setOpen}:Props) {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
        <CommandInput
        placeholder='Find a meeting or agent'/>
        <CommandList>
            <CommandItem>
                Test
            </CommandItem>
        </CommandList>
    </CommandResponsiveDialog>
  )
}

export default DashboardCommand