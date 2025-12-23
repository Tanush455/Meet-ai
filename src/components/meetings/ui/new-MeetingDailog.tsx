import ResponsiveDialog from '@/components/ResponsiveDialog'
import MeetingForm from './meetingForm'
import { useRouter } from 'next/navigation'

interface NewMeetingDialogProps {
  open: boolean,
  onOpenChange: (open: boolean) => void
}

function NewMeetingDialog({ open, onOpenChange }: NewMeetingDialogProps) {
  const router = useRouter();
  return (
    <ResponsiveDialog
      title='New Meeting'
      description='Create a new meeting'
      open={open}
      onOpenChange={onOpenChange}>
      <div className="p-4">
        <MeetingForm
          onSuccess={(id) => {
            onOpenChange(false);
            router.push(`/meetings/${id}`)
          }}
          onCancel={() => onOpenChange(false)} />
      </div>
    </ResponsiveDialog>
  )
}

export default NewMeetingDialog