import { createTRPCRouter, protectedProcedure } from "../trpc";

// export const gmailRouter = createTRPCRouter({
// //     getLatestEmails: protectedProcedure.query(async ({ ctx }) => {
// //       // get 20 latest emails

// //       const gmail = google.gmail({ version: "v1", auth: ctx.googleOauth2Client });

// //       const res = await gmail.users.threads.list({
// //         maxResults: 10,
// //         userId: "me",
// //       });

// //       return res;
// //     }),
// //   });

// Function to get all pull requests for a repository

interface PullRequest {
  title: string;
  state: "open" | "closed";
  url: string;
}

export const githubRouter = createTRPCRouter({
  getLatestPrs: protectedProcedure.query(async ({ ctx }) => {
    async function getAllPullRequests(repoOwner: string, repoName: string) {
      const response = await ctx.githubOauth2Client?.pulls.list({
        owner: repoOwner,
        repo: repoName,
        state: "all", // 'all' will include both open and closed pull requests
      });

      return response?.data;
    }

    async function getTop5ReposByCommits(username: string) {
      const response = await ctx.githubOauth2Client?.repos.listForUser({
        username: username,
        sort: "pushed", // Sort by the date of the latest commit
        direction: "desc",
        per_page: 5,
      });

      return response?.data;
    }
    return getTop5ReposByCommits("arian81")
      .then(async (topRepos) => {
        const prs: PullRequest[] = [];
        for (const repo of topRepos ?? []) {
          const pullRequests = await getAllPullRequests("arian81", repo.name);
          pullRequests?.forEach((pr, index) => {
            const state: "open" | "closed" =
              pr.state === "open" ? "open" : "closed";
            prs.push({ title: pr.title, state: state, url: pr.html_url });
          });
        }
        return prs;
      })
      .catch((error) => {
        console.error("Error fetching repositories:", error.message);
      });
  }),
});
