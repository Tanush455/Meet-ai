import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export enum MeetingStatus {
    Upcoming = "upcoming",
    Active = "active",
    Completed = "complete",
    Processing = "processing",
    Cancelled = "cancelled"
}
// Single meeting row type
export type Meeting = {
    id: string;
    name: string;
    userId: string;
    agentId: string;
    status: string;
    createdAt: Date;
    StartedAt: Date;
    EndedAt: Date;
    updatedAt: Date;
    transcriptUrl: string;
    recordingUrl: string;
    summary: string;
    agents: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        instructions: string;
    };
    duration?: number;
};

export type MeetingGetManyResponse = {
    data: Meeting[];
    dataWithDuration: (Meeting & { duration: number })[];
    count: number;
};