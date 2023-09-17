import React from "react";

import GridCard from "./GridCard";
import { api } from "~/utils/api";

const CalendarCard = () => {
  const { data, isLoading } = api.calendar.getEvents.useQuery();

  if (isLoading) {
    return <>Loading</>;
  }
  if (!data?.[0]) {
    return <>No calendar events found!</>;
  }
  return (
    <div className="text-md">
      <h2 className="text-sm">{data?.[0]?.summary}</h2>
      <p className="text-sm">
        {data?.[0]?.start?.dateTime} - {data?.[0]?.end?.dateTime}
      </p>
    </div>
  );
};

export default CalendarCard;
