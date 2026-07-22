// app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SpotlightTutorial from "@/components/SpotlightTutorial";
import Link from "next/link";

interface Alert {
  id: string;
  asset_name: string;
  price_at_drop: number;
  drop_percentage: number;
  detected_at: string;
}

interface PriceData {
  usd: number;
  usd_24h_change: number;
  status: "stable" | "alert";
}

interface Prices {
  [key: string]: PriceData;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [prices, setPrices] = useState<Prices>({});
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [engineStatus, setEngineStatus] = useState<"online" | "offline">("offline");
  const [showTutorial, setShowTutorial] = useState(false);
  const [cursor, setCursor] = useState(true);

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

  const ASSET_SYMBOLS: Record<string, string> = {
    bitcoin: "BTC",
    ethereum: "ETH",
    cardano: "ADA",
    solana: "SOL",
    ripple: "XRP",
    polkadot: "DOT",
    dogecoin: "DOGE",
    "avalanche-2": "AVAX",
    chainlink: "LINK",
    litecoin: "LTC",
  };

  // Show tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("crypto_sentry_tutorial_done");
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 800);
    }
  }, []);

  function handleTutorialComplete() {
    localStorage.setItem("crypto_sentry_tutorial_done", "true");
    setShowTutorial(false);
  }

  async function loadData() {
    try {
      const [alertsRes, pricesRes, watchlistRes, healthRes] = await Promise.all([
        fetch("/api/alerts?limit=5"),
        fetch("/api/prices"),
        fetch("/api/watchlist"),
        fetch("/api/health"),
      ]);

      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data.alerts || []);
      }
      if (pricesRes.ok) {
        const data = await pricesRes.json();
        setPrices(data.prices || {});
        setLastUpdated(new Date());
      }
      if (watchlistRes.ok) {
        const data = await watchlistRes.json();
        setWatchlistCount(data.watchlist?.length || 0);
      }
      if (healthRes.ok) {
        setEngineStatus("online");
      } else {
        setEngineStatus("offline");
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const c = setInterval(() => setCursor((v) => !v), 500);
    return () => clearInterval(c);
  }, []);

  const activeAlerts = Object.values(prices).filter((p) => p.status === "alert").length;
  const topGainer = Object.entries(prices).sort((a, b) => b[1].usd_24h_change - a[1].usd_24h_change)[0];
  const topLoser = Object.entries(prices).sort((a, b) => a[1].usd_24h_change - b[1].usd_24h_change)[0];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e1a", fontFamily: "monospace" }}>
      {showTutorial && <SpotlightTutorial onComplete={handleTutorialComplete} />}
      <Navbar />

      <main style={{ padding: "1.5rem 2rem", maxWidth: "1300px", margin: "0 auto" }}>

        {/* Terminal Header */}
        <div style={{
          backgroundColor: "#0f1629",
          border: "1px solid #1e2d4a",
          borderRadius: "8px",
          padding: "1rem 1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <span style={{ color: "#64748b", fontSize: "0.8rem" }}>OPERATOR: </span>
            <span style={{ color: "#00ff88", fontSize: "0.8rem" }}>{session?.user?.email}</span>
            <span style={{ color: "#00ff88", marginLeft: "2px" }}>{cursor ? "█" : " "}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                backgroundColor: engineStatus === "online" ? "#00ff88" : "#ef4444",
                boxShadow: engineStatus === "online" ? "0 0 6px #00ff88" : "0 0 6px #ef4444",
              }} />
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
                ENGINE {engineStatus.toUpperCase()}
              </span>
            </div>
            <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
              LAST SYNC: {lastUpdated ? lastUpdated.toLocaleTimeString() : "..."}
            </span>
            <button
              onClick={() => setShowTutorial(true)}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #1e2d4a",
                borderRadius: "4px",
                color: "#00ff88",
                padding: "0.3rem 0.7rem",
                fontSize: "0.72rem",
                cursor: "pointer",
                fontFamily: "monospace",
                letterSpacing: "0.05em",
              }}
            >
              ? HELP
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          {[
            { label: "ASSETS MONITORED", value: Object.keys(prices).length || 10, color: "#00ff88", icon: "📡", sub: "Live surveillance" },
            { label: "WATCHLIST", value: watchlistCount, color: "#3b82f6", icon: "⭐", sub: "Tracked assets" },
            { label: "ACTIVE ALERTS", value: activeAlerts, color: activeAlerts > 0 ? "#ef4444" : "#00ff88", icon: "⚠️", sub: activeAlerts > 0 ? "Flash crash!" : "Market stable" },
            { label: "ALERTS HISTORY", value: alerts.length, color: "#f59e0b", icon: "📋", sub: "Total recorded" },
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: "#0f1629",
              border: `1px solid ${stat.color}22`,
              borderRadius: "8px",
              padding: "1.25rem",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "1.5rem", opacity: 0.3 }}>
                {stat.icon}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.7rem", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                {stat.label}
              </div>
              <div style={{ color: stat.color, fontSize: "2.2rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
                {loading ? "—" : stat.value}
              </div>
              <div style={{ color: "#475569", fontSize: "0.72rem" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>

          {/* Live Price Ticker */}
          <div style={{ backgroundColor: "#0f1629", border: "1px solid #1e2d4a", borderRadius: "8px", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ color: "#e2e8f0", fontSize: "0.8rem", letterSpacing: "0.08em" }}>LIVE PRICE FEED</h2>
              <span style={{ color: "#00ff88", fontSize: "0.7rem" }}>● LIVE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {Object.entries(prices).slice(0, 6).map(([id, data]) => (
                <div key={id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0.75rem",
                  backgroundColor: data.status === "alert" ? "#1a0a0a" : "#0a0e1a",
                  border: `1px solid ${data.status === "alert" ? "#ef444433" : "#1e2d4a"}`,
                  borderRadius: "4px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {data.status === "alert" && <span style={{ color: "#ef4444", fontSize: "0.7rem" }}>⚠</span>}
                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{ASSET_SYMBOLS[id]}</span>
                  </div>
                  <span style={{ color: data.status === "alert" ? "#ef4444" : "#e2e8f0", fontSize: "0.85rem", fontWeight: "bold" }}>
                    ${data.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ color: data.usd_24h_change >= 0 ? "#00ff88" : "#ef4444", fontSize: "0.78rem" }}>
                    {data.usd_24h_change >= 0 ? "▲" : "▼"} {Math.abs(data.usd_24h_change).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
            <Link href="/market" style={{ display: "block", textAlign: "center", marginTop: "0.75rem", color: "#00ff88", fontSize: "0.75rem", textDecoration: "none" }}>
              VIEW ALL 10 ASSETS →
            </Link>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Top Movers */}
            <div style={{ backgroundColor: "#0f1629", border: "1px solid #1e2d4a", borderRadius: "8px", padding: "1.25rem", flex: 1 }}>
              <h2 style={{ color: "#e2e8f0", fontSize: "0.8rem", letterSpacing: "0.08em", marginBottom: "1rem" }}>TOP MOVERS (24H)</h2>
              {topGainer && (
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.6rem 0.75rem", backgroundColor: "#0a1a0f",
                  border: "1px solid #00ff8833", borderRadius: "4px", marginBottom: "0.5rem",
                }}>
                  <div>
                    <div style={{ color: "#00ff88", fontSize: "0.7rem", marginBottom: "0.1rem" }}>TOP GAINER</div>
                    <div style={{ color: "#e2e8f0", fontSize: "0.85rem" }}>{ASSET_NAMES[topGainer[0]] || topGainer[0]}</div>
                  </div>
                  <div style={{ color: "#00ff88", fontWeight: "bold" }}>▲ {topGainer[1].usd_24h_change.toFixed(2)}%</div>
                </div>
              )}
              {topLoser && (
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.6rem 0.75rem", backgroundColor: "#1a0a0a",
                  border: "1px solid #ef444433", borderRadius: "4px",
                }}>
                  <div>
                    <div style={{ color: "#ef4444", fontSize: "0.7rem", marginBottom: "0.1rem" }}>TOP LOSER</div>
                    <div style={{ color: "#e2e8f0", fontSize: "0.85rem" }}>{ASSET_NAMES[topLoser[0]] || topLoser[0]}</div>
                  </div>
                  <div style={{ color: "#ef4444", fontWeight: "bold" }}>▼ {Math.abs(topLoser[1].usd_24h_change).toFixed(2)}%</div>
                </div>
              )}
            </div>

            {/* System Status */}
            <div style={{ backgroundColor: "#0f1629", border: "1px solid #1e2d4a", borderRadius: "8px", padding: "1.25rem" }}>
              <h2 style={{ color: "#e2e8f0", fontSize: "0.8rem", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>SYSTEM STATUS</h2>
              {[
                { label: "Surveillance Engine", status: engineStatus === "online" },
                { label: "Price Feed (CoinGecko)", status: Object.keys(prices).length > 0 },
                { label: "Database", status: true },
                { label: "Flash Crash Detector", status: engineStatus === "online" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{item.label}</span>
                  <span style={{ color: item.status ? "#00ff88" : "#ef4444", fontSize: "0.72rem", fontWeight: "bold" }}>
                    {item.status ? "● ONLINE" : "● OFFLINE"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div style={{ backgroundColor: "#0f1629", border: "1px solid #1e2d4a", borderRadius: "8px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ color: "#e2e8f0", fontSize: "0.8rem", letterSpacing: "0.08em" }}>RECENT FLASH CRASH ALERTS</h2>
            <Link href="/alerts" style={{ color: "#00ff88", fontSize: "0.75rem", textDecoration: "none" }}>VIEW ALL →</Link>
          </div>
          {loading ? (
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Loading alerts...</p>
          ) : alerts.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center", border: "1px dashed #1e2d4a", borderRadius: "6px" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>✓</div>
              <p style={{ color: "#00ff88", fontSize: "0.85rem" }}>No flash crashes detected. Market is stable.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {alerts.map((alert) => (
                <div key={alert.id} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#1a0a0a",
                  border: "1px solid #2d1a1a",
                  borderRadius: "6px",
                }}>
                  <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "0.85rem" }}>⚠ {alert.asset_name}</span>
                  <span style={{ color: "#ef4444", fontSize: "0.85rem" }}>▼ {Math.abs(alert.drop_percentage).toFixed(2)}%</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>@ ${alert.price_at_drop.toFixed(2)}</span>
                  <span style={{ color: "#475569", fontSize: "0.75rem", textAlign: "right" }}>
                    {new Date(alert.detected_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
