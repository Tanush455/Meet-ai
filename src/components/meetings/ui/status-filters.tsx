import {
    CircleXIcon,
    LoaderIcon,
    ClockArrowUpIcon,
    CircleCheckIcon,
    VideoIcon
} from "lucide-react";


import CommandSelect from "@/components/command-select";
import { MeetingStatus } from "../types";

import { useMeetingsFilters } from "../hooks/use-meeting-filters";
import { useState } from "react";

const options = [
    {
        id: MeetingStatus.Upcoming,
        value: MeetingStatus.Upcoming,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <ClockArrowUpIcon className="size-4" />
                {MeetingStatus.Upcoming}
            </div>
        )
    },
    {
        id: MeetingStatus.Completed,
        value: MeetingStatus.Completed,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleCheckIcon className="size-4" />
                {MeetingStatus.Completed}
            </div>
        )
    },
    {
        id: MeetingStatus.Active,
        value: MeetingStatus.Active,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <VideoIcon className="size-4" />
                {MeetingStatus.Active}
            </div>
        )
    },
    {
        id: MeetingStatus.Processing,
        value: MeetingStatus.Processing,
        children: (
            <div className="flex items-center gap-x-2">
                <LoaderIcon className="size-4" />
                {MeetingStatus.Processing}
            </div>
        )
    },
    {
        id: MeetingStatus.Cancelled,
        value: MeetingStatus.Cancelled,
        children: (
            <div className="flex items-center gap-x-2">
                <CircleXIcon className="size-4" />
                {MeetingStatus.Cancelled}
            </div>
        )
    }
]

export const StatusFilter = () => {
    const [{ status, search }, setFilters] = useMeetingsFilters();
    const [searchValue, setSearchValue] = useState(search);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setFilters({ search: value });
    }
    return (
        <CommandSelect
            options={options}
            className="h-9"
            onSelect={(value) => setFilters({ status: value as MeetingStatus })}
            value={status ?? ""}
            placeholder="Filter by status"
            isSearchable={true}
            searchValue={searchValue}
            onSearch={handleSearch}
        />
    )
}