import { api } from "~/utils/api";
import { cn } from "~/lib/utils";

const GithubCard = () => {
  const { data, isLoading } = api.prs.getLatestPrs.useQuery();

  if (isLoading) {
    return <>Loading</>;
  }

  if (!data) {
    return <>No Repos</>;
  }

  return (
    <div>
      {data.slice(0, 2).map((repo) => (
        <ul>
          <a href={repo.url} target="_blank">
            <div
              className={
                repo.state === "closed"
                  ? cn("mb-2 rounded-xl border-2 border-green-400 p-2 ")
                  : cn("mb-2 rounded-xl border-2 border-red-400 p-2 ")
              }
            >
              <li>{repo.title}</li>
              <li>{repo.url}</li>
            </div>
          </a>
        </ul>
      ))}
    </div>
  );
};

export default GithubCard;
