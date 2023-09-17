import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const StockCard = () => {
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
      <div className="flex gap-4">
        <p className="h3">{ticker}</p>
        {!isLoading ? `${data.data.shortname}` : "Fetching Name..."}
      </div>

      {!isLoading
        ? `Market Price: ${data.data.regularMarketPrice}`
        : "Loading Price..."}
      {!isLoading
        ? `Percent Change ${data.data.regularMarketChangePercent}`
        : "Loading Change..."}
    </div>
  );
};

export default StockCard;
