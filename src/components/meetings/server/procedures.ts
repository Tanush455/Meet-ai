import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import prisma from "@/utils/prismaClient";
import { number, promise, string, z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { GenratedAvatar } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({
    // meetings router: generateToken
    generateToken: protectedProcedure.mutation(async ({ ctx }) => {
        await streamVideo.upsertUsers([
            {
                id: ctx.auth.user.id,
                name: ctx.auth.user.name ?? undefined,
                role: "admin",
                image:
                    ctx.auth.user.image ??
                    GenratedAvatar({ seed: ctx.auth.user.name, variant: "initials" }),
            },
        ]); // create/ensure user before issuing token [web:68]
        const exprirationTime = Math.floor(Date.now() / 1000) + 3600; // optional expiration time (1 hour from now) [web:68][web:112]
        const issuedAt = Math.floor(Date.now() / 1000) - 60; // optional issued at time (now) [web:68][web:112]
        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: exprirationTime,
            validity_in_seconds: issuedAt
            // validity_in_seconds: 3600, // optional
        }); // server-only token generation [web:68][web:112]

        return { token }; // return the raw JWT in a property
    }),

    remove: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const removeMeeting = await prisma.meetings.delete({
                where: {
                    id: input.id,
                    userId: ctx.session!.user.id,
                },
            });

            if (!removeMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cannot Update Meeting"
                });
            }

            return removeMeeting;
        }),
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const meeting = await prisma.meetings.findFirst({
                where: {
                    AND: [
                        { id: input.id },
                        { userId: ctx.session!.user.id }, // enforce user constraint
                    ],
                },
                include: {
                    agents: true,
                },
            });

            if (!meeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }

            const dataWithDuration = {
                ...meeting,
                duration:
                    meeting.EndedAt && meeting.StartedAt
                        ? Math.floor(
                            (new Date(meeting.EndedAt).getTime() -
                                new Date(meeting.StartedAt).getTime()) / 1000
                        )
                        : null,
            };

            return { existingMeeting: meeting, dataWithDuration };
        }),


    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
            agentId: z.string().nullish(),
            status: z.enum([
                MeetingStatus.Upcoming,
                MeetingStatus.Active,
                MeetingStatus.Processing,
                MeetingStatus.Completed,
                MeetingStatus.Cancelled
            ]).nullish()
        }))
        .query(async ({ ctx, input }) => {
            const data = await prisma.meetings.findMany({
                include: {
                    agents: true,
                },
                where: {
                    AND: [
                        {
                            userId: ctx.session!.user.id,
                        },
                        input.agentId ? {
                            agentId: input.agentId
                        } : {},
                        input.search ? {
                            name: {
                                contains: input.search,
                                mode: 'insensitive'
                            }
                        } : {},

                    ]
                },
                skip: (input.page - 1) * input.pageSize,
                take: input.pageSize,
                orderBy: {
                    createdAt: 'desc'
                }
            });

            const dataWithDuration = data.map(meeting => ({
                ...meeting,
                id: meeting.id,
                duration: meeting.EndedAt && meeting.StartedAt
                    ? Math.floor((new Date(meeting.EndedAt).getTime() - new Date(meeting.StartedAt).getTime()) / 1000)
                    : null
            }));

            const meetingCount = await prisma.meetings.count({
                where: {
                    AND: [
                        {
                            userId: ctx.session!.user.id
                        },
                        input.agentId ? {
                            agentId: input.agentId
                        } : {},
                        input.search ? {
                            name: {
                                contains: input.search,
                                mode: 'insensitive'
                            }
                        } : {},

                    ]
                }
            });

            return {
                data,
                dataWithDuration,
                count: meetingCount
            };
        }),
    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const createdMeeting = await prisma.meetings.create({
                data: {
                    ...input,
                    userId: ctx.session!.user.id,
                    StartedAt: new Date(),
                    EndedAt: new Date(),
                    transcriptUrl: "",
                    recordingUrl: "",
                    summary: "",
                },
            });
            const call = streamVideo.video.call("default", createdMeeting.id);
            await call.create({
                data: {
                    created_by_id: ctx.auth.user.id,
                    custom: {
                        meetingId: createdMeeting.id,
                        meetingName: createdMeeting.name
                    },
                    settings_override: {
                        transcription: {
                            language: "en",
                            mode: "auto-on",
                            closed_caption_mode: "auto-on"
                        },
                        recording: {
                            mode: "auto-on",
                            quality: "1080p"
                        }
                    }
                }
            });

            const existingAgent = await prisma.agents.findFirst({
                where: {
                    id: createdMeeting.agentId,
                }
            })

            if (!existingAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found"
                })
            }

            await streamVideo.upsertUsers([
                {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    role: "user",
                    image: GenratedAvatar({ seed: existingAgent.name, variant: "botttsNeutral" })
                }
            ])
            return createdMeeting;
        }),

    update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const updatedMeeting = await prisma.meetings.update({
                where: {
                    id: input.id,
                    userId: ctx.session!.user.id,
                },
                data: {
                    name: input.name,
                    agentId: input.agentId,
                },
            });

            if (!updatedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cannot Update Meeting"
                });
            }

            return updatedMeeting;
        }),
});
