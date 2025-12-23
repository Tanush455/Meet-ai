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
import {ConfirmationDialogBox, EditMeetingDialogBox} from '../hooks/use-meeting-confirm'

interface Props {
    meetingId: string;
    meetingName: string;
    onEdit: (updatedName: string) => void;
    onRemove: () => void;
}
export default function MeetingIdViewHeader({ meetingId, meetingName, onEdit, onRemove }: Props) {
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

    const handleConfirmEdit = (updatedName: string) => {
        onEdit(updatedName);
        setShowEditDialog(false);
    };

    return (
        <>
            <div className='flex items-center justify-between'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className='font-medium text-xl text-foreground'>
                                <Link href={`/meetings`}>My Meetings</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className='text-foreground text-xl font-medium [&>svg]:size-4'>
                            <ChevronRightSquareIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className='font-medium text-xl text-foreground'>
                                <Link href={`/meetings/${meetingId}`}>{meetingName}</Link>
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
                title="Delete Meeting"
                description={`Are you sure you want to delete "${meetingName}"? This action cannot be undone.`}
                isOpen={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleConfirmDelete}
            />
            
            <EditMeetingDialogBox
                title="Edit Meeting"
                description="Update the meeting details below."
                isOpen={showEditDialog}
                onOpenChange={setShowEditDialog}
                onConfirm={handleConfirmEdit}
                currentName={meetingName}
            />
        </>
    )
}
