## Meet AI

Meet AI is a Next.js 15 application for scheduling, running, and reviewing AI-assisted video meetings. It combines Stream Video for real-time calls, Better Auth for authentication, Prisma/PostgreSQL for data, and tRPC + React Query for client data fetching.

### Features
- Email/password and OAuth (Google, GitHub) auth via Better Auth with Prisma adapter ([src/lib/auth.ts](src/lib/auth.ts)).
- Create/manage AI agents with custom instructions tied to users ([prisma/schema.prisma](prisma/schema.prisma)).
- Schedule meetings bound to agents and track lifecycle states (upcoming/active/processing/complete/cancelled).
- Stream Video calls with AI agent participation and webhooks that start/stop calls, connect OpenAI real-time, and capture recordings/transcripts ([src/app/api/webhook/route.ts](src/app/api/webhook/route.ts)).
- Live AI news feed backed by NewsAPI with graceful fallback ([src/app/api/news/route.ts](src/app/api/news/route.ts)).
- tRPC + React Query client with server-aware base URL handling ([src/trpc/client.tsx](src/trpc/client.tsx)).

### Tech Stack
- Next.js 15 (App Router) with React 19
- Tailwind CSS 4
- Prisma ORM + PostgreSQL
- Better Auth (email/password + Google/GitHub)
- Stream Video (calls, AI agent real-time, webhooks)
- OpenAI Realtime
- tRPC + React Query
- NewsAPI integration

## Getting Started
1) Install dependencies
```bash
npm install
```

2) Configure environment
- Copy `env.example` to `.env.local` and fill the variables below.

3) Database
- Ensure PostgreSQL is running and update `DATABASE_URL`.
- Generate client: `npx prisma generate`
- Apply migrations locally: `npx prisma migrate dev --name init`

4) Run the dev server (Turbopack)
```bash
npm run dev
# open http://localhost:3000
```

5) Optional: expose webhooks for Stream
```bash
npm run dev:webhook
# adjust ngrok URL in Stream dashboard
```

## Environment Variables (.env.local)
- `DATABASE_URL` – PostgreSQL connection string.
- `NEXT_PUBLIC_APP_URL` – origin for SSR API calls (e.g., http://localhost:3000).
- `BETTER_AUTH_SECRET` – Better Auth secret key.
- `BETTER_AUTH_URL` – public auth URL (e.g., http://localhost:3000/api/auth).
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` – Google OAuth (optional if not using Google).
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` – GitHub OAuth (optional if not using GitHub).
- `NEXT_PUBLIC_STREAM_API_KEY` – Stream Video public API key (used client-side).
- `NEXT_API_SECRET_KEY` – Stream secret used by the Stream client in server code ([src/lib/stream-video.ts](src/lib/stream-video.ts)).
- `STREAM_SECRET_KEY` – Stream secret used by the legacy API route ([src/pages/api/live-agent.ts](src/pages/api/live-agent.ts)); set the same value as `NEXT_API_SECRET_KEY` to keep calls consistent.
- `OPENAI_API_KEY` – required for AI agent realtime connection in webhook handler.
- `NEWS_API_KEY` – NewsAPI key for AI news feed.

## Scripts
- `npm run dev` – start Next.js dev server with Turbopack.
- `npm run build` – production build.
- `npm run start` – start production server (after build).
- `npm run lint` – lint the codebase.
- `npm run dev:webhook` – run ngrok tunnel for Stream webhooks (update URL in Stream dashboard).

## Database Schema (Prisma)
- User authentication: `User`, `Session`, `Account`, `Verification`.
- AI agents: `agents` linked to `User` with `instructions`.
- Meetings: `meetings` linked to `User` and `agents`, with status, timestamps, transcript URL, recording URL, and summary.

## Deployment Notes
- Run `npx prisma migrate deploy` during deploys to apply migrations.
- Ensure all env vars are set in the hosting platform.
- If behind a custom domain, set `NEXT_PUBLIC_APP_URL` accordingly so SSR tRPC calls resolve correctly.

## Troubleshooting
- Prisma schema changes: run `npx prisma generate` and `npx prisma migrate dev` locally.
- Stream webhook signature failures: confirm ngrok URL matches Stream settings and `NEXT_API_SECRET_KEY`/`STREAM_SECRET_KEY` are correct.
- News feed errors: ensure `NEWS_API_KEY` has quota; the API falls back to demo data when unavailable.
