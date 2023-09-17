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

    const resolved = Promise.all(messages);

    // const url = "https://api.cohere.ai/v1/rerank";
    // const options = {
    //   method: "POST",
    //   headers: {
    //     accept: "application/json",
    //     "content-type": "application/json",
    //     authorization: "Bearer XfvFyHAWgHXDBlO9IxXesYg8LpxG2QALBUXGsiDU",
    //   },
    //   body: JSON.stringify({
    //     return_documents: false,
    //     max_chunks_per_doc: 10,
    //     model: "rerank-english-v2.0",
    //     query: "What is the capital of the United States?",
    //     documents: [
    //       "Carson City is the capital city of the American state of Nevada.",
    //       "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan.",
    //       "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district.",
    //       "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states.",
    //     ],
    //   }),
    // };

    return resolved;
  }),
});
