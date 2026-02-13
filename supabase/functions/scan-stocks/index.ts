import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STOCK_UNIVERSE = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'V', 'UNH',
  'JNJ', 'WMT', 'JPM', 'MA', 'PG', 'XOM', 'HD', 'CVX', 'LLY', 'ABBV',
  'MRK', 'AVGO', 'KO', 'PEP', 'COST', 'TMO', 'BAC', 'CSCO', 'ACN', 'MCD',
  'ADBE', 'DHR', 'NFLX', 'ABT', 'CRM', 'VZ', 'DIS', 'NKE', 'CMCSA', 'TXN',
  'AMD', 'INTC', 'QCOM', 'ORCL', 'PFE', 'UPS', 'RTX', 'HON', 'PM', 'NEE',
  'UNP', 'LOW', 'SPGI', 'COP', 'IBM', 'BA', 'GS', 'INTU', 'BMY', 'AMGN',
  'BLK', 'SBUX', 'AXP', 'DE', 'CAT', 'GILD', 'MDLZ', 'LMT', 'ADI', 'ISRG',
  'NOW', 'TJX', 'SYK', 'PLD', 'BKNG', 'VRTX', 'MMM', 'CI', 'ZTS', 'CB',
  'REGN', 'MO', 'EOG', 'DUK', 'SO', 'BDX', 'HUM', 'PNC', 'USB', 'AON'
];

const CONFIG = {
  marketCapMin: 10000000000,
  avgVolumeMin: 5000000,
  priceMin: 5,
  rsiMin: 50,
  rsiMax: 70,
};

function calculateRSI(prices: number[]): number {
  if (prices.length < 14) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < 14; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / 14;
  const avgLoss = losses / 14;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateVWAP(aggregates: any[]): number {
  if (!aggregates || aggregates.length === 0) return 0;

  let sumPV = 0;
  let sumV = 0;

  aggregates.forEach(agg => {
    const typicalPrice = (agg.h + agg.l + agg.c) / 3;
    sumPV += typicalPrice * agg.v;
    sumV += agg.v;
  });

  return sumV > 0 ? sumPV / sumV : aggregates[aggregates.length - 1].c;
}

async function fetchStockData(symbol: string, polygonApiKey: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const prevCloseUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${polygonApiKey}`;
    const prevCloseRes = await fetch(prevCloseUrl);
    const prevCloseData = await prevCloseRes.json();

    if (!prevCloseData.results || prevCloseData.results.length === 0) {
      return null;
    }

    const prevClose = prevCloseData.results[0].c;

    const snapshotUrl = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=${polygonApiKey}`;
    const snapshotRes = await fetch(snapshotUrl);
    const snapshotData = await snapshotRes.json();

    if (!snapshotData.ticker) {
      return null;
    }

    const ticker = snapshotData.ticker;
    const currentPrice = ticker.day?.c || ticker.min?.c || ticker.prevDay?.c || prevClose;
    const volume = ticker.day?.v || 0;

    const detailsUrl = `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${polygonApiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    const marketCap = detailsData.results?.market_cap || 0;
    const sharesOutstanding = detailsData.results?.share_class_shares_outstanding || 0;
    const float = sharesOutstanding * 0.9;

    const aggUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${thirtyDaysAgo}/${today}?adjusted=true&sort=asc&apiKey=${polygonApiKey}`;
    const aggRes = await fetch(aggUrl);
    const aggData = await aggRes.json();

    const aggregates = aggData.results || [];
    const prices = aggregates.map((a: any) => a.c);
    const avgVolume = aggregates.length > 0 ? aggregates.reduce((sum: number, a: any) => sum + a.v, 0) / aggregates.length : 0;

    const rsi = calculateRSI(prices);
    const vwap = calculateVWAP(aggregates.slice(-5));

    const gapPercent = ((currentPrice - prevClose) / prevClose) * 100;

    return {
      symbol,
      price: currentPrice,
      prevClose,
      change: ((currentPrice - prevClose) / prevClose) * 100,
      gap: gapPercent,
      volume,
      avgVolume,
      marketCap,
      float,
      rsi,
      vwap
    };

  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

function meetsAPlusCriteria(stock: any): boolean {
  return (
    stock.marketCap > CONFIG.marketCapMin &&
    stock.avgVolume > CONFIG.avgVolumeMin &&
    stock.price > CONFIG.priceMin &&
    stock.price > stock.vwap &&
    stock.rsi >= CONFIG.rsiMin &&
    stock.rsi <= CONFIG.rsiMax
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("polygon_api_key")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.polygon_api_key) {
      throw new Error("No Polygon.io API key configured. Please add your API key in Settings.");
    }

    const results = [];

    for (let i = 0; i < STOCK_UNIVERSE.length; i += 10) {
      const batch = STOCK_UNIVERSE.slice(i, i + 10);
      const batchPromises = batch.map(symbol => fetchStockData(symbol, profile.polygon_api_key));
      const batchResults = await Promise.all(batchPromises);

      results.push(...batchResults.filter(stock => stock !== null));

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const aPlusStocks = results.filter(meetsAPlusCriteria);

    return new Response(
      JSON.stringify({ results: aPlusStocks }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
