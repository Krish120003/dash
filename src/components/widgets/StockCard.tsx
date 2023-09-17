import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

interface StockCardProps {
  ticker: string;
}

const StockCard: React.FC<StockCardProps> = ({ ticker }) => {
  async function fetchPriceByTicker(ticker: string) {
    const response = await fetch(`http://localhost:3000/api/stock/${ticker}`);
    return response.json();
  }

  const { data, isLoading } = useQuery({
    queryKey: ["todos", ticker],
    queryFn: () => fetchPriceByTicker(ticker),
  });

  console.log(ticker, data, isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full flex-col justify-between">
      <div className="gap-4">
        <div className="text-4xl font-bold">
          {!isLoading
            ? `\$${data.data.regularMarketPrice}`
            : "Loading Price..."}
        </div>
        {!isLoading
          ? ` ${data.data.regularMarketChangePercent}\%`
          : "Loading Change..."}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold">{ticker}</p>
        <p className="text-xl">
          {!isLoading ? `${data.data.shortName}` : "Fetching Name..."}
        </p>
      </div>
    </div>
  );
};

export default StockCard;
