import { api } from "~/utils/api";
import { cn } from "~/lib/utils";
import { HtmlHTMLAttributes } from "react";

const GDocsCard = () => {
  const { data, isLoading } = api.docs.getLatestDocs.useQuery();
  if (isLoading) {
    return <>Loading</>;
  }

  if (!data) {
    return <>No Repos</>;
  }

  // Type assertion or type guard to ensure 'data' is an array
  if (!Array.isArray(data)) {
    return <>Invalid Data</>;
  }
  }

  return (
    <div>
      {data.length > 0 && data.slice(0, 5).map((repo) => (
        <ul key={repo.title}>
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
        </ul>
      ))}
    </div>
  );
};

export default GDocsCard;
