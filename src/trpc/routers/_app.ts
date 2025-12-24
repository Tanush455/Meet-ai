import { z } from 'zod';
import { agentsRouter } from '@/components/Agents/server/procedures';
import { createTRPCRouter } from '../init';
import { meetingsRouter } from '@/components/meetings/server/procedures';
import { newsRouter } from '@/app/api/routers/news';
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  news: newsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;