import { google } from "googleapis";
import { z } from "zod";

import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const gmailRouter = createTRPCRouter({
  getLatestEmails: protectedProcedure.query(async ({ ctx }) => {
    // get 20 latest emails

    const gmail = google.gmail({ version: "v1", auth: ctx.googleOauth2Client });

    const res = await gmail.users.threads.list({
      maxResults: 10,
      userId: "me",
    });

    // const calendar = google.calendar({
    //   version: "v3",
    //   auth: ctx.googleOauth2Client,
    // });

    // const res = await calendar.events.list({
    //   calendarId: "primary",
    //   timeMin: new Date().toISOString(),
    //   maxResults: 10,
    //   singleEvents: true,
    //   orderBy: "startTime",
    // });

    return res;
  }),
});
