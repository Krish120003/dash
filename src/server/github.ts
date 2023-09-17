import { type PrismaClient } from "@prisma/client";
import { type Session } from "next-auth";

// const { Octokit } = require('@octokit/rest');
import { Octokit } from "@octokit/rest";

export const getGithubOauth2Client = async (ctx: {
  db: PrismaClient;
  session: Session | null;
}) => {
  if (ctx.session === null) {
    return null;
  }

  const account = (
    await ctx.db.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        accounts: {
          where: {
            provider: "github",
          },
        },
      },
    })
  ).accounts[0];

  const octokit = new Octokit({
    auth: account?.access_token,
  });
  return octokit;
};
