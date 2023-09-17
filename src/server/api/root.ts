import { createTRPCRouter } from "~/server/api/trpc";
import { calendarRouter } from "~/server/api/routers/calendar";
import { locationRouter } from "./routers/location";
import { gmailRouter } from "./routers/gmail";
import { newsRouter } from "./routers/news";
import { layoutRouter } from "./routers/layout";
import { githubRouter } from "./routers/prs";
import { docsRouter } from "./routers/docs";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  calendar: calendarRouter,
  location: locationRouter,
  gmail: gmailRouter,
  news: newsRouter,
  layout: layoutRouter,
  prs: githubRouter,
  docs: docsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
