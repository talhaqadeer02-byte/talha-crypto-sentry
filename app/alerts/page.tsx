// app/alerts/page.tsx
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface Alert {
  id: string;
  asset_id: string;
  asset_name: string;
  price_at_drop: number;
  drop_percentage: number;
  detected_at: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const ASSET_IDS = [
    "all", "bitcoin", "ethereum", "solana",
    "cardano", "ripple", "dogecoin",
  ];

  async function fetchAlerts() {
    try {
      const url = filter === "all"
        ? "/api/alerts"
        : `/api/alerts?asset_id=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error("Alerts fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const ASSET_LABELS: Record<string, string> = {
    all: "ALL",
    bitcoin: "BTC",
    ethereum: "ETH",
    solana: "SOL",
    cardano: "ADA",
    ripple: "XRP",
    dogecoin: "DOGE",
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0e1a",
      fontFamily: "monospace",
    }}>
      <Navbar />

      <main style={{ padding: "1.5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{
            color: "#ef4444",
            fontSize: "1.3rem",
            fontWeight: "bold",
            letterSpacing: "0.08em",
            marginBottom: "0.25rem",
          }}>
            ⚠ FLASH CRASH ALERTS
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.8rem" }}>
            Triggered when any asset drops ≥2% within a 30-second window
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          {[
            {
              label: "TOTAL ALERTS",
              value: alerts.length,
              color: "#ef4444",
            },
            {
              label: "MOST AFFECTED",
              value: alerts.length > 0
                ? alerts.reduce((acc, a) => {
                    acc[a.asset_name] = (acc[a.asset_name] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                  && Object.entries(
                    alerts.reduce((acc, a) => {
                      acc[a.asset_name] = (acc[a.asset_name] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
                : "—",
              color: "#f59e0b",
            },
            {
              label: "BIGGEST DROP",
              value: alerts.length > 0
                ? `${Math.abs(
                    Math.min(...alerts.map((a) => a.drop_percentage))
                  ).toFixed(2)}%`
                : "—",
              color: "#ef4444",
            },
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: "#0f1629",
              border: "1px solid #1e2d4a",
              borderRadius: "8px",
              padding: "1rem 1.25rem",
            }}>
              <div style={{
                color: "#64748b",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                marginBottom: "0.4rem",
              }}>
                {stat.label}
              </div>
              <div style={{
                color: stat.color,
                fontSize: "1.4rem",
                fontWeight: "bold",
              }}>
                {loading ? "—" : stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filter by Asset */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}>
          {ASSET_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              style={{
                padding: "0.4rem 0.9rem",
                backgroundColor: filter === id ? "#ef4444" : "transparent",
                color: filter === id ? "white" : "#64748b",
                border: `1px solid ${filter === id ? "#ef4444" : "#1e2d4a"}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                fontWeight: filter === id ? "bold" : "normal",
                transition: "all 0.2s",
              }}
            >
              {ASSET_LABELS[id]}
            </button>
          ))}
        </div>

        {/* Alerts Table */}
        <div style={{
          backgroundColor: "#0f1629",
          border: "1px solid #1e2d4a",
          borderRadius: "8px",
          overflow: "hidden",
        }}>
          {/* Table Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr",
            padding: "0.75rem 1.25rem",
            backgroundColor: "#0a0e1a",
            borderBottom: "1px solid #1e2d4a",
            color: "#64748b",
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
          }}>
            <span>ASSET</span>
            <span>DROP %</span>
            <span>PRICE AT DROP</span>
            <span>SEVERITY</span>
            <span>DETECTED AT</span>
          </div>

          {/* Table Body */}
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
              Loading alerts...
            </div>
          ) : alerts.length === 0 ? (
            <div style={{
              padding: "3rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
              <p style={{ color: "#00ff88", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                No flash crashes detected
              </p>
              <p style={{ color: "#64748b", fontSize: "0.8rem" }}>
                The surveillance engine is monitoring all assets
              </p>
            </div>
          ) : (
            alerts.map((alert, index) => {
              const severity =
                Math.abs(alert.drop_percentage) >= 10
                  ? { label: "CRITICAL", color: "#ef4444" }
                  : Math.abs(alert.drop_percentage) >= 5
                  ? { label: "HIGH", color: "#f59e0b" }
                  : { label: "MODERATE", color: "#3b82f6" };

              return (
                <div
                  key={alert.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr",
                    padding: "0.85rem 1.25rem",
                    borderBottom: index < alerts.length - 1
                      ? "1px solid #1e2d4a"
                      : "none",
                    backgroundColor: index % 2 === 0 ? "#0f1629" : "#0a0e1a",
                    alignItems: "center",
                  }}
                >
                  <span style={{
                    color: "#e2e8f0",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                  }}>
                    ⚠ {alert.asset_name}
                  </span>
                  <span style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: "bold" }}>
                    ▼ {Math.abs(alert.drop_percentage).toFixed(2)}%
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                    ${alert.price_at_drop.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span style={{
                    color: severity.color,
                    fontSize: "0.72rem",
                    fontWeight: "bold",
                    letterSpacing: "0.05em",
                  }}>
                    {severity.label}
                  </span>
                  <span style={{ color: "#64748b", fontSize: "0.78rem" }}>
                    {new Date(alert.detected_at).toLocaleString()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
