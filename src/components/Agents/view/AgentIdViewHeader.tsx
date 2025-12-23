"use client"
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent
} from '@/components/ui/dropdown-menu'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import Link from 'next/link'
import React, { useState } from 'react'
import { ChevronRightSquareIcon ,TrashIcon,PencilIcon,MoreVerticalIcon} from 'lucide-react'
import ConfirmationDialogBox, { EditDialogBox } from '../hooks/use-confirm'

interface Props {
    agentId: string;
    agentName: string;
    agentInstructions: string;
    onEdit: (updatedName: string, updatedInstructions: string) => void;
    onRemove: () => void;
}
export default function AgentIdViewHeader({ agentId, agentName, agentInstructions, onEdit, onRemove }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleEditClick = () => {
        setShowEditDialog(true);
    };

    const handleConfirmDelete = () => {
        onRemove();
        setShowDeleteDialog(false);
    };

    const handleConfirmEdit = (updatedName: string, updatedInstructions: string) => {
        onEdit(updatedName, updatedInstructions);
        setShowEditDialog(false);
    };

    return (
        <>
            <div className='flex items-center justify-between'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className='font-medium text-xl text-foreground'>
                                <Link href={`/agents`}>My Agents</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className='text-foreground text-xl font-medium [&>svg]:size-4'>
                            <ChevronRightSquareIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className='font-medium text-xl text-foreground'>
                                <Link href={`/agents/${agentId}`}>{agentName}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <MoreVerticalIcon/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={handleEditClick}>
                            <PencilIcon className='size-4 text-black'/>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDeleteClick}>
                            <TrashIcon className='size-4 text-black'/>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            <ConfirmationDialogBox
                title="Delete Agent"
                description={`Are you sure you want to delete "${agentName}"? This action cannot be undone.`}
                isOpen={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleConfirmDelete}
            />
            
            <EditDialogBox
                title="Edit Agent"
                description="Update the agent details below."
                isOpen={showEditDialog}
                onOpenChange={setShowEditDialog}
                onConfirm={handleConfirmEdit}
                currentName={agentName}
                currentInstructions={agentInstructions}
            />
        </>
    )
}
