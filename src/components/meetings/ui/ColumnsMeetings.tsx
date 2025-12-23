"use client"

import { ColumnDef } from "@tanstack/react-table"
import GenratedAvatar from "@/components/genratedAvatar"
import { format } from "date-fns"
import humanizeDuration from "humanize-duration"
import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, CornerDownRightIcon, LoaderIcon, ClockIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Meeting } from "../types"

// Define the type for our table data
interface MeetingTableData extends Omit<Meeting, "duration"> {
  duration?: number | null;
}

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  complete: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon
}

const statusColorMap = {
  upcoming: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
  active: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
  complete: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
  processing: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200"
}

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"]
  })
}

export const MeetingsColumns: ColumnDef<MeetingTableData>[] = [
  {
    accessorKey: "name",
    header: () => <span className="px-6 py-4 font-semibold text-gray-700 text-left">Meeting Name</span>,
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-2 px-6 py-4">
        <span className="font-semibold text-gray-900 capitalize truncate max-w-[200px]">
          {row.original?.name ?? "Unknown"}
        </span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1.5">
            <CornerDownRightIcon className="size-3.5 text-gray-400" />
            <span className="text-sm text-gray-600 truncate max-w-[120px] capitalize">
              {row.original?.agents?.name || "Unnamed Agent"}
            </span>
          </div>
          <GenratedAvatar
            variant="bottsNetutral"
            seed={row.original?.agents?.name || "default"}
            className="size-5 border border-gray-200"
          />
          <span className="text-sm text-gray-500 ml-1">
            {row.original?.StartedAt ? format(row.original.StartedAt, "MMM d, yyyy") : ""}
          </span>
        </div>
      </div>
    )
  },
  {
    accessorKey: "status",
    header: () => <span className="px-6 py-4 font-semibold text-gray-700 text-left">Status</span>,
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusIconMap;
      const Icon = statusIconMap[status] || CircleCheckIcon;
      return (
        <div className="px-6 py-4">
          <Badge
            variant="outline"
            className={cn(
              "capitalize py-1.5 px-3 rounded-lg border-2 font-medium flex items-center gap-x-1.5 w-fit",
              statusColorMap[status]
            )}
          >
            <Icon className={cn("size-4", status === "processing" && "animate-spin")} />
            {status}
          </Badge>
        </div>
      )
    }
  },
  {
    accessorKey: "duration",
    header: () => <span className="px-6 py-4 font-semibold text-gray-700 text-left">Duration</span>,
    cell: ({ row }) => (
      <div className="px-6 py-4">
        <Badge
          variant="outline"
          className="flex items-center gap-x-2 py-1.5 px-3 rounded-lg border-2 bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
        >
          <ClockIcon className="size-4 text-blue-600" />
          {row.original.duration
            ? formatDuration(row.original.duration)
            : "No duration"}
        </Badge>
      </div>
    )
  }
]