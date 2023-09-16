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

  const access_token = (
    await ctx.db.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        accounts: {
          where: {
            provider: "google",
          },
          select: {
            access_token: true,
          },
        },
      },
    })
  ).accounts[0]?.access_token;

  oauth2Client.setCredentials({ access_token: access_token });

  return oauth2Client;
};
