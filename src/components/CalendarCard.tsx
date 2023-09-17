import React from "react";

import GridCard from "./GridCard";
import { api } from "~/utils/api";

const CalendarCard = () => {
  const { data, isLoading } = api.calendar.getEvents.useQuery();

  if (isLoading) {
    return <>Loading</>;
  }
  return (
    <div>
      <h2>{data?.[0]?.desc}</h2>
      <p>
        {data?.[0]?.start?.dateTime} - {data?.[0]?.end?.dateTime}
      </p>
    </div>
  );
};

export default CalendarCard;
