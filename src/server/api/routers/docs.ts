import { google } from "googleapis";
import { z } from "zod";

import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

interface File {
  name: string;
  description: string;
  webContentLink: string;
  size: number;
  iconLink: string;
}

export const docsRouter = createTRPCRouter({
  getLatestDocs: protectedProcedure.query(async ({ ctx }) => {
    // get 20 latest emails

    const drive = google.drive({
      version: "v3",
      auth: ctx.googleOauth2Client,
    });

    drive.files.list(
      {
        q: 'modifiedTime >= "2023-09-01T00:00:00.000Z"', // Customize the date as needed
        orderBy: "modifiedTime desc", // Sort by modification time in descending order
      },
      (err, res) => {
        if (err) {
          console.error("Error retrieving files:", err);
          return;
        }

        const files = res?.data.files;
        const result: File[] = [];
        if (files?.length === 0) {
          console.log("No recently edited documents found.");
        } else {
          console.log("Recently edited documents:");
          files?.forEach((file) => {
            result.push({
              name: file.name ?? "File",
              description: file.description ?? "File",
              webContentLink: file.webContentLink ?? "",
              size: parseInt(file.size ?? "0"),
              iconLink: file.iconLink ?? "",
            });
          });
        }
        return { result };
      },
    );
  }),
});
