import { NextApiRequest, NextApiResponse } from "next/types";
import yahooFinance from "yahoo-finance2";

type ResponseData = {
  data: unknown;
};

// req = HTTP incoming message, res = HTTP server response
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { ticker } = req.query;

  const quote = await yahooFinance.quote(ticker || "AAPL");

  res.status(200).json({ data: quote });
  /*
  const price = quote.regularMarketPrice;
  const regMarketChangePrice = quote.regularMarketChangePercent;
  return [price, regMarketChangePrice];*/
}
