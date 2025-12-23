import React from 'react'
import { Button } from '@/components/ui/button';
interface DataPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
export default function DataPagination ({page, totalPages, onPageChange}: DataPaginationProps) {
  return (
    <div className='flex items-center justify-between border-t px-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
            Page {page} of {totalPages || 1}
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
            <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1,page - 1))} disabled={page === 1}>
                Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages || 1,page + 1))} disabled={page === totalPages || !totalPages}>
                Next
            </Button>
        </div>
    </div>
  )
}
