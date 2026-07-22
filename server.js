// server.js
// Bitbash Crypto Sentry — Express Surveillance Engine

require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// 1. MEMORY CACHE
// ─────────────────────────────────────────────
class MemoryCache {
  constructor() {
    this.cache = null;
    this.MAX_AGE_MS = 60000;
  }

  update(prices, alertSet) {
    this.cache = {
      timestamp: Date.now(),
      prices: Object.entries(prices).reduce((acc, [id, data]) => {
        acc[id] = {
          usd: data.usd,
          usd_24h_change: data.usd_24h_change,
          status: alertSet.has(id) ? "alert" : "stable",
        };
        return acc;
      }, {}),
    };
    console.log(
      `[${new Date().toISOString()}] CACHE_UPDATED | ${Object.keys(prices).length} assets`
    );
  }

  get() {
    return this.cache;
  }

  isStale() {
    if (!this.cache) return true;
    return Date.now() - this.cache.timestamp > this.MAX_AGE_MS;
  }
}

// ─────────────────────────────────────────────
// 2. FLASH CRASH DETECTOR
// ─────────────────────────────────────────────
class FlashCrashDetector {
  constructor() {
    this.baseline = new Map();
    this.lastAlertTime = new Map();
    this.activeAlerts = new Set();
    this.ALERT_COOLDOWN_MS = 60000;
    this.CRASH_THRESHOLD = -2.0;
  }

  async check(currentPrices) {
    for (const [assetId, data] of Object.entries(currentPrices)) {
      if (!this.baseline.has(assetId)) {
        this.baseline.set(assetId, data.usd);
        continue;
      }

      const baselinePrice = this.baseline.get(assetId);
      const currentPrice = data.usd;
      const dropPct = ((currentPrice - baselinePrice) / baselinePrice) * 100;

      if (dropPct <= this.CRASH_THRESHOLD) {
        const lastAlert = this.lastAlertTime.get(assetId) || 0;
        const timeSinceLastAlert = Date.now() - lastAlert;

        if (timeSinceLastAlert > this.ALERT_COOLDOWN_MS) {
          await this._createAlert(assetId, currentPrice, dropPct);
          this.lastAlertTime.set(assetId, Date.now());
          this.activeAlerts.add(assetId);
        } else {
          console.log(
            `[${new Date().toISOString()}] ALERT_COOLDOWN | Asset: ${assetId} | Skipping duplicate`
          );
        }
      } else {
        this.activeAlerts.delete(assetId);
      }

      this.baseline.set(assetId, currentPrice);
    }

    return this.activeAlerts;
  }

  async _createAlert(assetId, price, dropPct) {
    const assetName = ASSET_NAMES[assetId] || assetId;

    try {
      const existing = await prisma.cryptoAlert.findFirst({
        where: {
          asset_id: assetId,
          detected_at: { gte: new Date(Date.now() - 60000) },
        },
      });

      if (existing) {
        console.log(
          `[${new Date().toISOString()}] ALERT_DUPLICATE | Asset: ${assetId} | DB check prevented duplicate`
        );
        return;
      }

      const alert = await prisma.cryptoAlert.create({
        data: {
          asset_id: assetId,
          asset_name: assetName,
          price_at_drop: price,
          drop_percentage: dropPct,
        },
      });

      console.log(
        `[${new Date().toISOString()}] ALERT_TRIGGERED | Asset: ${assetName} | Price: $${price.toFixed(2)} | Drop: ${dropPct.toFixed(2)}% | AlertID: ${alert.id}`
      );
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] ALERT_FAILED | Asset: ${assetId} | Error: ${err.message}`
      );
    }
  }
}

// ─────────────────────────────────────────────
// 3. ASSETS TO MONITOR
// ─────────────────────────────────────────────
const MONITORED_ASSETS = [
  "bitcoin",
  "ethereum",
  "cardano",
  "solana",
  "ripple",
  "polkadot",
  "dogecoin",
  "avalanche-2",
  "chainlink",
  "litecoin",
];

const ASSET_NAMES = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  cardano: "Cardano",
  solana: "Solana",
  ripple: "XRP",
  polkadot: "Polkadot",
  dogecoin: "Dogecoin",
  "avalanche-2": "Avalanche",
  chainlink: "Chainlink",
  litecoin: "Litecoin",
};

// ─────────────────────────────────────────────
// 4. COINGECKO FETCHER WITH RETRY
// ─────────────────────────────────────────────
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        const waitTime = Math.pow(2, i) * 1000;
        console.log(
          `[${new Date().toISOString()}] RATE_LIMITED | Waiting ${waitTime}ms before retry ${i + 1}/${retries}`
        );
        await sleep(waitTime);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] FETCH_ERROR | Attempt ${i + 1}/${retries} | ${err.message}`
      );
      if (i === retries - 1) throw err;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}

async function fetchPrices() {
  const ids = MONITORED_ASSETS.join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  return await fetchWithRetry(url);
}

// ─────────────────────────────────────────────
// 5. SURVEILLANCE LOOP
// ─────────────────────────────────────────────
const cache = new MemoryCache();
const detector = new FlashCrashDetector();

async function surveillanceCycle() {
  console.log(`[${new Date().toISOString()}] CYCLE_START | Fetching prices...`);

  try {
    const prices = await fetchPrices();
    const activeAlerts = await detector.check(prices);
    cache.update(prices, activeAlerts);

    console.log(
      `[${new Date().toISOString()}] CYCLE_COMPLETE | Assets: ${Object.keys(prices).length} | Active alerts: ${activeAlerts.size}`
    );
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] CYCLE_FAILED | ${err.message}`
    );
  }
}

surveillanceCycle();
const surveillanceInterval = setInterval(surveillanceCycle, 30000);

// ─────────────────────────────────────────────
// 6. EXPRESS ENDPOINTS
// ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime_seconds: Math.floor(process.uptime()),
    cache_age_ms: cache.get() ? Date.now() - cache.get().timestamp : null,
    cache_stale: cache.isStale(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/prices", (req, res) => {
  const data = cache.get();

  if (!data) {
    return res.status(503).json({
      error: "Price data not yet available. Engine is warming up.",
      code: "CACHE_EMPTY",
    });
  }

  res.json({
    prices: data.prices,
    timestamp: data.timestamp,
    stale: cache.isStale(),
  });
});

// ─────────────────────────────────────────────
// 7. STARTUP & GRACEFUL SHUTDOWN
// ─────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(
    `[${new Date().toISOString()}] ENGINE_START | Surveillance engine listening on port ${PORT}`
  );
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received — shutting down gracefully...");
  clearInterval(surveillanceInterval);
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

process.on("SIGINT", async () => {
  console.log("SIGINT received — shutting down gracefully...");
  clearInterval(surveillanceInterval);
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
