import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const newsRouter = createTRPCRouter({
  getNews: protectedProcedure.query(async ({ ctx }) => {
    const news = await fetch(
      `https://newsapi.org/v2/top-headlines?country=ca&apiKey=${env.NEWSAPI_API_KEY}`,
    );

    return news.json();
  }),
});
