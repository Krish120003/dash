import yahooFinance from "yahoo-finance2";

// req = HTTP incoming message, res = HTTP server response
export default async function handler(req, res) {
  const { ticker } = req.query;

  const quote = await yahooFinance.quote(ticker);

  res.status(200).json({ data: quote });
  /*
  const price = quote.regularMarketPrice;
  const regMarketChangePrice = quote.regularMarketChangePercent;
  return [price, regMarketChangePrice];*/
}
