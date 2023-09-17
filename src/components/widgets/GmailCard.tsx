import React from "react";

import GridCard from "../GridCard";
import { api } from "~/utils/api";

const GmailCard = () => {
  const { data, isLoading } = api.gmail.getLatestEmails.useQuery();

  if (isLoading) {
    return <>Loading</>;
  }
  return (
    <div>
      <p>{data?.data?.threads?.[0]?.snippet}</p>
    </div>
  );
};

export default GmailCard;
