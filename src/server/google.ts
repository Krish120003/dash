// import { PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";

import { google as g } from "googleapis";
import { type PrismaClient } from "@prisma/client";
import { type Session } from "next-auth";

export const getGoogleOauth2Client = async (ctx: {
  db: PrismaClient;
  session: Session | null;
}) => {
  if (ctx.session === null) {
    return null;
  }

  const oauth2Client = new g.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    process.env.VERCEL_URL ?? env.NEXTAUTH_URL,
  );

  const account = (
    await ctx.db.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        accounts: {
          where: {
            provider: "google",
          },
        },
      },
    })
  ).accounts[0];

  oauth2Client.setCredentials({
    access_token: account?.access_token,
    refresh_token: account?.refresh_token,
  });

  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      void ctx.db.account.update({
        where: {
          id: account?.id,
        },
        data: {
          refresh_token: tokens.refresh_token,
        },
      });
      console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
  });

  return oauth2Client;
};
