import { google } from "googleapis";
import { z } from "zod";

import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const gmailRouter = createTRPCRouter({
  getLatestEmails: protectedProcedure.query(async ({ ctx }) => {
    // get 20 latest emails

    const gmail = google.gmail({ version: "v1", auth: ctx.googleOauth2Client });

    const messageIds = (
      await gmail.users.messages.list({
        userId: "me",
        maxResults: 20,
      })
    ).data.messages;

    const messages = messageIds?.map(async (m) => {
      if (typeof m.id !== "string") {
        throw new Error("wtf");
      }
      return (
        await gmail.users.messages.get({
          userId: "me",
          id: m.id,
          format: "full",
        })
      ).data;
    });

    if (!messages) {
      throw new Error("wtf");
    }

    const resolved = await Promise.all(messages);
    return resolved;

    // const url = "https://api.cohere.ai/v1/rerank";
    // const options = {
    //   method: "POST",
    //   headers: {
    //     accept: "application/json",
    //     "content-type": "application/json",
    //     authorization: `Bearer ${env.COHERE_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     return_documents: false,
    //     max_chunks_per_doc: 10,
    //     model: "rerank-english-v2.0",
    //     query: "What is the latest important email to view?",
    //     documents: resolved.map((m) => m.snippet),
    //   }),
    // };

    // const cohereData = await fetch(url, options);
    // console.log(await cohereData.json());
    // return await cohereData.json();
  }),
});
