import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { env } from "~/env.mjs";

const WeatherCard = () => {
  const geolocation = useGeolocation();

  const { data, isLoading } = useQuery(
    ["weather", geolocation.latitude, geolocation.longitude],
    () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${geolocation.latitude}&lon=${geolocation.longitude}&appid=${env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`;
      const backup = `https://api.openweathermap.org/data/2.5/weather?q=Waterloo&appid=${env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`;
      return fetch(geolocation.latitude === null ? backup : url).then((res) =>
        res.json(),
      );
    },
    { enabled: !geolocation.error },
  );

  console.log(data);

  if (isLoading) {
    return <div>Loading Weather...</div>;
  }

  return (
    <div className="flex h-full flex-col justify-end">
      {/* TODO ADD A CLOUD LIKE FIGMA? */}
      <div className="text-4xl font-bold">
        {data.main?.temp ? (data.main.temp - 272.15).toFixed(1) : "N/A"}° C
      </div>
      <div className="capitalize">{data.weather?.[0].description}</div>
      <div className="capitalize">{data?.name}</div>
    </div>
  );
};

export default WeatherCard;
