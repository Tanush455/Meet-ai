"use client"

import { useState } from "react";
import CommandSelect from "@/components/command-select";
import { useMeetingsFilters } from "../hooks/use-meeting-filters";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import GenratedAvatar from "@/components/genratedAvatar";
export function AgentIdFilter() {
    const [{ agentId }, setFilters] = useMeetingsFilters();
    const [search, setSearch] = useState("");
    const trpc = useTRPC();

    const agentsQuery = useQuery(
        trpc.agents.getMany.queryOptions({ search })
    );

    const handleSelect = (newAgentId: string | null) => {
        setFilters({ agentId: newAgentId });
    }

    const options = (agentsQuery.data ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
            <div className="flex items-center gap-x-2">
                <GenratedAvatar seed={agent.name} variant="bottsNetutral" className="border size-6" />
                <span>{agent.name}</span>
            </div>
        ),
    }));

    return (
        <CommandSelect
            options={options}
            onSelect={handleSelect}
            value={agentId}
            placeholder="Filter by agent"
            onSearch={setSearch}
            searchValue={search}
            isSearchable={true}
        />
    )
}