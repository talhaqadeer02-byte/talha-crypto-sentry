// app/market/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import PriceCard from "@/components/PriceCard";

interface PriceData {
  usd: number;
  usd_24h_change: number;
  status: "stable" | "alert";
}

interface Prices {
  [key: string]: PriceData;
}

const ASSET_NAMES: Record<string, string> = {
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

export default function MarketPage() {
  const { data: session } = useSession();
  const [prices, setPrices] = useState<Prices>({});
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"all" | "alerts" | "watchlist">("all");

  async function fetchPrices() {
    try {
      const res = await fetch("/api/prices");
      if (res.ok) {
        const data = await res.json();
        setPrices(data.prices || {});
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Price fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWatchlist() {
    try {
      const res = await fetch("/api/watchlist");
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data.watchlist?.map((w: any) => w.asset_id) || []);
      }
    } catch (err) {
      console.error("Watchlist fetch error:", err);
    }
  }

  async function handleWatchlistToggle(assetId: string, assetName: string) {
    const isWatching = watchlist.includes(assetId);

    if (isWatching) {
      await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset_id: assetId }),
      });
      setWatchlist((prev) => prev.filter((id) => id !== assetId));
    } else {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset_id: assetId, asset_name: assetName }),
      });
      setWatchlist((prev) => [...prev, assetId]);
    }
  }

  useEffect(() => {
    fetchPrices();
    fetchWatchlist();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = Object.entries(prices).filter(([id, data]) => {
    if (filter === "alerts") return data.status === "alert";
    if (filter === "watchlist") return watchlist.includes(id);
    return true;
  });

  const alertCount = Object.values(prices).filter((p) => p.status === "alert").length;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0e1a",
      fontFamily: "monospace",
    }}>
      <Navbar />

      <main style={{ padding: "1.5rem 2rem", maxWidth: "1300px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}>
          <div>
            <h1 style={{
              color: "#00ff88",
              fontSize: "1.3rem",
              fontWeight: "bold",
              letterSpacing: "0.08em",
              marginBottom: "0.25rem",
            }}>
              LIVE MARKET FEED
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.8rem" }}>
              {lastUpdated
                ? `Last updated: ${lastUpdated.toLocaleTimeString()} — auto-refreshes every 5s`
                : "Loading prices..."}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {alertCount > 0 && (
              <div style={{
                backgroundColor: "#2d0a0a",
                border: "1px solid #ef4444",
                borderRadius: "6px",
                padding: "0.4rem 0.8rem",
                color: "#ef4444",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}>
                ⚠ {alertCount} FLASH CRASH{alertCount > 1 ? "ES" : ""} DETECTED
              </div>
            )}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#0f1629",
              border: "1px solid #1e2d4a",
              borderRadius: "6px",
              padding: "0.4rem 0.8rem",
            }}>
              <div style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#00ff88",
                boxShadow: "0 0 6px #00ff88",
              }} />
              <span style={{ color: "#00ff88", fontSize: "0.75rem" }}>LIVE</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}>
          {[
            { key: "all", label: `ALL ASSETS (${Object.keys(prices).length})` },
            { key: "alerts", label: `⚠ ALERTS (${alertCount})` },
            { key: "watchlist", label: `★ WATCHLIST (${watchlist.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: filter === tab.key ? "#00ff88" : "transparent",
                color: filter === tab.key ? "#0a0e1a" : "#64748b",
                border: `1px solid ${filter === tab.key ? "#00ff88" : "#1e2d4a"}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                fontWeight: filter === tab.key ? "bold" : "normal",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Price Grid */}
        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            color: "#00ff88",
            fontSize: "1rem",
          }}>
            LOADING MARKET DATA...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "3rem",
            border: "1px dashed #1e2d4a",
            borderRadius: "8px",
            color: "#64748b",
          }}>
            {filter === "watchlist"
              ? "No assets in watchlist. Star an asset to track it."
              : filter === "alerts"
              ? "No flash crashes detected. Market is stable. ✓"
              : "No data available."}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}>
            {filteredAssets.map(([id, data]) => (
              <PriceCard
                key={id}
                assetId={id}
                assetName={ASSET_NAMES[id] || id}
                data={data}
                isWatchlisted={watchlist.includes(id)}
                onWatchlistToggle={handleWatchlistToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
