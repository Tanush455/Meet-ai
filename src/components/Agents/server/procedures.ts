import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import prisma from "@/utils/prismaClient";
import { number, promise, string, z } from "zod";
import { agentsInsertSchema } from "../schemas";
import { id } from "date-fns/locale";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { Search } from "lucide-react";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const removeAgents = await prisma.agents.deleteMany({
        where: {
          AND: [
            {
              id: input.id
            },
            {
              userId: ctx.session?.user.id
            }
          ]
        }
      });

      if (removeAgents.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent cannot be deleted"
        });
      }
      
      return removeAgents;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const existingAgent = await prisma.agents.findFirst({
        include: {
          _count: {
            select: {
              meetings: true
            }
          }
        },
        where: {
          AND: [
            {
              id: input.id
            },
            {
              userId: ctx.session?.user.id
            }
          ]
        },
      });

      if (!existingAgent) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Agent not found" 
        });
      }
      
      return existingAgent;
    }),

  getMany: protectedProcedure
    .input(z.object({
      page: z.number().default(DEFAULT_PAGE),
      pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
      search: z.string().nullish()
    }))
    .query(async ({ ctx, input }) => {
      const data = await prisma.agents.findMany({
        where: {
          AND: [
            {
              userId: ctx.session!.user.id,
            },
            input.search ? {
              name: {
                contains: input.search,
                mode: 'insensitive'
              }
            } : {}
          ]
        },
        include: {
          _count: {
            select: {
              meetings: true
            }
          }
        },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        orderBy: {
          createdAt: 'desc'
        }
      });

      return data;
    }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const createdAgent = await prisma.agents.create({
        data: {
          ...input,
          instructions: input.instructions,
          userId: ctx.session!.user.id,
        },
      });
      return createdAgent;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      ...agentsInsertSchema.shape
    }))
    .mutation(async ({ input, ctx }) => {
      const updatedAgent = await prisma.agents.update({
        where: {
          id: input.id,
          userId: ctx.session!.user.id, 
        },
        data: {
          name: input.name,
          instructions: input.instructions,
        },
      });

      if (!updatedAgent) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Cannot Upadate Agents" 
        });
      }

      return updatedAgent;
    }),
});
