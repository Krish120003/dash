import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { env } from "~/env.mjs";

const weatherLogo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="full" viewBox="0 0 36 36">
      <path
        fill="#FFAC33"
        d="M13 6s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2V6zM4 17s2 0 2 2s-2 2-2 2H2s-2 0-2-2s2-2 2-2h2zm3.872-6.957s1.414 1.414 0 2.828s-2.828 0-2.828 0l-1.415-1.414s-1.414-1.414 0-2.829c1.415-1.414 2.829 0 2.829 0l1.414 1.415zm17.085 2.828s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828l-1.414 1.414z"
      />
      <circle cx="15" cy="19" r="8" fill="#FFAC33" />
      <path
        fill="#E1E8ED"
        d="M28.223 16.8c-.803 0-1.575.119-2.304.34c-.862-2.409-3.201-4.14-5.961-4.14c-2.959 0-5.437 1.991-6.123 4.675a4.399 4.399 0 0 0-2.626-.875c-2.417 0-4.375 1.914-4.375 4.275c0 .573.12 1.118.329 1.618a4.949 4.949 0 0 0-1.302-.193C3.176 22.5 1 24.626 1 27.25S3.176 32 5.861 32h22.361C32.518 32 36 28.598 36 24.4s-3.482-7.6-7.777-7.6z"
      />
    </svg>
  );
};

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

  if (isLoading) {
    return <div>Loading Weather...</div>;
  }

  return (
    <div className="flex h-full justify-between">
      <div className="flex h-full flex-col justify-end">
        {/* TODO ADD A CLOUD LIKE FIGMA? */}
        <div className="text-4xl font-bold">
          {data.main?.temp ? (data.main.temp - 272.15).toFixed(1) : "N/A"}° C
        </div>
        <div className="capitalize">{data.weather?.[0].description}</div>
        <div className="capitalize">{data?.name}</div>
      </div>
      <div className="float-right w-12 ">{weatherLogo()}</div>
    </div>
  );
};

export default WeatherCard;
