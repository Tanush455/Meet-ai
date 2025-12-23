import ResponsiveDialog from '@/components/ResponsiveDialog'
import AgentForm from './agent-from'

interface NewAgentDialogProps {
  open: boolean,
  onOpenChange: (open: boolean) => void
}

function AgentDialog({ open, onOpenChange }: NewAgentDialogProps) {
  return (
    <div>
      <ResponsiveDialog
        title='New Agent'
        description='Create a new agent'
        open={open}
        onOpenChange={onOpenChange}>
        <AgentForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)} />
      </ResponsiveDialog>
    </div>
  )
}

export default AgentDialog