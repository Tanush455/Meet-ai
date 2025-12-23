import EmptyState from "@/components/Error-State-copy"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { VideoIcon, BanIcon } from "lucide-react"



export const ProcessingState = (
   
) => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
                image="\processing.svg"
                title="Meeting is Completed"
                description="Meeting was completed is under processing" />
            
        </div>
    )
}