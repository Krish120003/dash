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
    // get next 10 events

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
    console.log("GOTTEN CALENDAR EVENTS");

    if (res.data.items) {
      console.log(res.data.items.map((e) => (e.summary ? e.summary : "")));
      const categories = (
        await ctx.cohere.classify({
          inputs: res.data.items.map((e) => (e.summary ? e.summary : "")),
          examples: [
            { text: "WE GO HTN RAHHHHHH", label: "PERSONAL" },
            { text: "SalesBop Sitdown", label: "MEETING" },
            { text: "DeltaHacks Team Meeting", label: "MEETING" },
            { text: "Jason's Coffeehouse", label: "PERSONAL" },
            { text: "STATS 2D03 C02 - Intro To Probability", label: "LECTURE" },
            {
              text: "COMPSCI 3IS3 C01 - Information Security",
              label: "LECTURE",
            },
            { text: "Weekly Review", label: "PERSONAL" },
          ],
        })
      ).body.classifications;

      console.log(categories);

      console.log("GOTTEN COHERE");

      return res.data.items?.map((e, x) => {
        return {
          summary: e.summary,
          desc: e.description,
          start: e.start,
          end: e.end,
          category: categories?.[x]?.prediction,
        };
      });
    }
  }),
});
