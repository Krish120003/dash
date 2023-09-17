import React from "react";

import GridCard from "./GridCard";
import { api } from "~/utils/api";

const NewsCard = () => {
  const { data, isLoading } = api.news.getNews.useQuery();

  if (isLoading) {
    return <>Loading</>;
  }
  return (
    <div>
      <h2>{data.articles[0].title}</h2>
      {data.articles[0]?.description && <p>{data.articles[0].description}</p>}
      {data.articles[0].source.name}
    </div>
  );
};

export default NewsCard;
