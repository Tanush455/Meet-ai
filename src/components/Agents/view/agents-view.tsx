"use client"
import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Loader, TriangleAlert } from "lucide-react";
import {columns} from '@/components/Agents/view/columns';
import EmptyState from "@/components/Error-State-copy";
import { useAgentsFilters } from "../hooks/use-agent-filters";
import DataPagination from "./DataPagination ";
import { useRouter } from "next/navigation";
import { DataTables } from "@/components/data-tables";

const AgentsView = () => {
    const [filters,setFilters] = useAgentsFilters();
    const router = useRouter();
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));
    
    return (
        <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4">
            {
                data.length === 0 ? (
                    <EmptyState title="No agents found" description="Create an agent to get started"/>
                ) : (
                    <>
                    <DataTables 
                    data={data}  
                    columns={columns} 
                    onRowClick={(row) => router.push(`/agents/${row.id}`)}/>
                    <DataPagination 
                        page={filters.page} 
                        totalPages={data[0]._count.meetings}
                        setPage={(page) => setFilters(prev => ({ ...prev, page }))}
                        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                    />
                    </>
                )
            }
        </div>
    );
};

export default AgentsView;