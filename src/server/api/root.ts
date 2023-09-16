import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { calendarRouter } from "~/server/api/routers/calendar";
import { locationRouter } from "./routers/location";
import { gmailRouter } from "./routers/gmail";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  calendar: calendarRouter,
  location: locationRouter,
  gmail: gmailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
