"use client"

import { ColumnDef } from "@tanstack/react-table"
import GenratedAvatar from "@/components/genratedAvatar"

import { CornerDownRightIcon, CornerRightDownIcon, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AgentGetMany, AgentGetOne } from "../types"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// export type AgentGetOne = {
//   id: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
//   name: string;
//   instructions: string;
//   _count: { meetings: number };
// };

export const columns: ColumnDef<AgentGetMany[0]>[] = [
  {
    accessorKey: "name",
    header: "Agent name",
    cell: ({row}) => (
        <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
                <GenratedAvatar variant="bottsNetutral" seed={row.original?.name ?? "default-seed"} className="size-6"/>
                <span className="font-semibold capitalize">{
                    row.original?.name}</span>
            </div>
            <div className="flex items-center gap-x-1.5">
                    <CornerDownRightIcon className="size-3 text-muted-foreground"/>
                    <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                        {row.original?.instructions}
                    </span>
            </div>
        </div>
    )
  },
  {
    accessorKey: "meetingCount",
    header: "Meeting",
    cell: ({row}) => {
        return (
            <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                <VideoIcon className="text-blue-700"/>
                {row.original?._count?.meetings ?? 0} {row.original?._count?.meetings === 1 ? "meeting" : "meetings"}
            </Badge>
        )
    }
  }
]