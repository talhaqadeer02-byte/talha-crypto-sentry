// app/watchlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface WatchlistItem {
  id: string;
  asset_id: string;
  asset_name: string;
  added_at: string;
}

interface PriceData {
  usd: number;
  usd_24h_change: number;
  status: "stable" | "alert";
}

interface Prices {
  [key: string]: PriceData;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [prices, setPrices] = useState<Prices>({});
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const [watchlistRes, pricesRes] = await Promise.all([
        fetch("/api/watchlist"),
        fetch("/api/prices"),
      ]);

      if (watchlistRes.ok) {
        const data = await watchlistRes.json();
        setWatchlist(data.watchlist || []);
      }

      if (pricesRes.ok) {
        const data = await pricesRes.json();
        setPrices(data.prices || {});
      }
    } catch (err) {
      console.error("Watchlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(assetId: string) {
    await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset_id: assetId }),
    });
    setWatchlist((prev) => prev.filter((w) => w.asset_id !== assetId));
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0e1a",
      fontFamily: "monospace",
    }}>
      <Navbar />

      <main style={{ padding: "1.5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}>
          <div>
            <h1 style={{
              color: "#3b82f6",
              fontSize: "1.3rem",
              fontWeight: "bold",
              letterSpacing: "0.08em",
              marginBottom: "0.25rem",
            }}>
              ★ MY WATCHLIST
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.8rem" }}>
              {watchlist.length} asset{watchlist.length !== 1 ? "s" : ""} tracked — prices update every 5s
            </p>
          </div>
          <Link href="/market" style={{
            padding: "0.5rem 1rem",
            backgroundColor: "transparent",
            border: "1px solid #1e2d4a",
            borderRadius: "6px",
            color: "#00ff88",
            fontSize: "0.78rem",
            textDecoration: "none",
            letterSpacing: "0.05em",
          }}>
            + ADD ASSETS
          </Link>
        </div>

        {/* Empty State */}
        {!loading && watchlist.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "4rem 2rem",
            border: "1px dashed #1e2d4a",
            borderRadius: "8px",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>☆</div>
            <p style={{ color: "#e2e8f0", fontSize: "1rem", marginBottom: "0.5rem" }}>
              Your watchlist is empty
            </p>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Go to the Market page and star assets to track them here
            </p>
            <Link href="/market" style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#00ff88",
              color: "#0a0e1a",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "0.85rem",
            }}>
              BROWSE MARKET
            </Link>
          </div>
        )}

        {/* Watchlist Table */}
        {!loading && watchlist.length > 0 && (
          <div style={{
            backgroundColor: "#0f1629",
            border: "1px solid #1e2d4a",
            borderRadius: "8px",
            overflow: "hidden",
          }}>
            {/* Table Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr",
              padding: "0.75rem 1.25rem",
              backgroundColor: "#0a0e1a",
              borderBottom: "1px solid #1e2d4a",
              color: "#64748b",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
            }}>
              <span>ASSET</span>
              <span>CURRENT PRICE</span>
              <span>24H CHANGE</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>

            {/* Table Rows */}
            {watchlist.map((item, index) => {
              const price = prices[item.asset_id];
              const isAlert = price?.status === "alert";
              const isPositive = (price?.usd_24h_change || 0) >= 0;

              return (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr",
                    padding: "1rem 1.25rem",
                    borderBottom: index < watchlist.length - 1
                      ? "1px solid #1e2d4a"
                      : "none",
                    backgroundColor: isAlert ? "#1a0a0a" : index % 2 === 0 ? "#0f1629" : "#0a0e1a",
                    alignItems: "center",
                    transition: "background-color 0.3s",
                  }}
                >
                  {/* Asset Name */}
                  <div>
                    <div style={{
                      color: "#e2e8f0",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      marginBottom: "0.15rem",
                    }}>
                      {item.asset_name}
                    </div>
                    <div style={{ color: "#475569", fontSize: "0.72rem" }}>
                      Added {new Date(item.added_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Price */}
                  <span style={{
                    color: isAlert ? "#ef4444" : "#00ff88",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                  }}>
                    {price
                      ? `$${price.usd.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "—"}
                  </span>

                  {/* 24h Change */}
                  <span style={{
                    color: isPositive ? "#00ff88" : "#ef4444",
                    fontSize: "0.85rem",
                  }}>
                    {price
                      ? `${isPositive ? "▲" : "▼"} ${Math.abs(price.usd_24h_change).toFixed(2)}%`
                      : "—"}
                  </span>

                  {/* Status */}
                  <span style={{
                    color: isAlert ? "#ef4444" : "#00ff88",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}>
                    {isAlert ? "⚠ ALERT" : "● STABLE"}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.asset_id)}
                    style={{
                      padding: "0.35rem 0.7rem",
                      backgroundColor: "transparent",
                      border: "1px solid #2d1a1a",
                      borderRadius: "4px",
                      color: "#ef4444",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontFamily: "monospace",
                      transition: "all 0.2s",
                    }}
                  >
                    REMOVE
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {loading && (
          <div style={{
            textAlign: "center",
            padding: "3rem",
            color: "#00ff88",
          }}>
            LOADING WATCHLIST...
          </div>
        )}
      </main>
    </div>
  );
}
