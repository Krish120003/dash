import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export function StockInfo() {
  async function fetchPriceByTicker(ticker: string) {
    const response = await fetch(`http://localhost:3000/api/stock/${ticker}`);
    return response.json();
  }

  const ticker = "k";

  // fetch(`http://localhost:3000/api/stock/${ticker}`)

  const { data, isLoading } = useQuery({
    queryKey: ["todos", ticker],
    queryFn: () => fetchPriceByTicker(ticker),
  });

  return <div></div>;
}

/*
export const StockInfo = () => {
  async function fetchPriceByTicker(ticker: string) {
    const response = await fetch(`http://localhost:3000/api/stock/${ticker}`);
    return response.json();
  }

  const ticker = "k";

  // fetch(`http://localhost:3000/api/stock/${ticker}`)

  const { data, isLoading } = useQuery({
    queryKey: ["todos", ticker],
    queryFn: () => fetchPriceByTicker(ticker),
  });

  return (
    <div>
      {!isLoading
        ? `Market Price: ${data.data.regularMarketPrice} Percent Change ${data.data.regularMarketChangePercent}`
        : " "}
    </div>
  );
};
*/
