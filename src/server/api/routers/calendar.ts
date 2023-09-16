import { google } from "googleapis";
import { z } from "zod";

import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const calendarRouter = createTRPCRouter({
  //   hello: publicProcedure
  //     .input(z.object({ text: z.string() }))
  //     .query(({ input }) => {
  //       return {
  //         greeting: `Hello ${input.text}`,
  //       };
  //     }),

  //   getAll: publicProcedure.query(({ ctx }) => {
  //     return ctx.db.example.findMany();
  //   }),

  //   getSecretMessage: protectedProcedure.query(() => {
  //     return "you can now see this secret message!";
  //   }),
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    // get all events within the next 24 hours

    const calendar = google.calendar({
      version: "v3",
      auth: ctx.googleOauth2Client,
    });

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.data.items?.map((i) => {
      return {
        summary: i.summary,
        desc: i.description,
        start: i.start,
        end: i.end,
      };
    });
  }),
});
