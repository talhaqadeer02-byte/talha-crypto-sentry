// components/PriceCard.tsx
"use client";

interface PriceData {
  usd: number;
  usd_24h_change: number;
  status: "stable" | "alert";
}

interface Props {
  assetId: string;
  assetName: string;
  data: PriceData;
  isWatchlisted: boolean;
  onWatchlistToggle: (assetId: string, assetName: string) => void;
}

export default function PriceCard({
  assetId,
  assetName,
  data,
  isWatchlisted,
  onWatchlistToggle,
}: Props) {
  const isAlert = data.status === "alert";
  const isPositive = data.usd_24h_change >= 0;

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

  const symbol = ASSET_SYMBOLS[assetId] || assetId.toUpperCase();

  return (
    <div style={{
      backgroundColor: isAlert ? "#1a0a0a" : "#0f1629",
      border: `1px solid ${isAlert ? "#ef4444" : "#1e2d4a"}`,
      borderRadius: "8px",
      padding: "1.25rem",
      fontFamily: "monospace",
      position: "relative",
      transition: "all 0.3s",
      boxShadow: isAlert ? "0 0 12px rgba(239,68,68,0.2)" : "none",
    }}>
      {/* Alert Badge */}
      {isAlert && (
        <div style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          backgroundColor: "#ef4444",
          color: "white",
          fontSize: "0.65rem",
          padding: "0.2rem 0.5rem",
          borderRadius: "4px",
          fontWeight: "bold",
          letterSpacing: "0.05em",
          animation: "pulse 1s infinite",
        }}>
          ⚠ FLASH CRASH
        </div>
      )}

      {/* Asset Name + Symbol */}
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{
          color: "#94a3b8",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          marginBottom: "0.2rem",
        }}>
          {symbol}
        </div>
        <div style={{
          color: "#e2e8f0",
          fontSize: "1rem",
          fontWeight: "600",
        }}>
          {assetName}
        </div>
      </div>

      {/* Price */}
      <div style={{
        color: isAlert ? "#ef4444" : "#00ff88",
        fontSize: "1.4rem",
        fontWeight: "bold",
        marginBottom: "0.5rem",
      }}>
        ${data.usd.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>

      {/* 24h Change */}
      <div style={{
        color: isPositive ? "#00ff88" : "#ef4444",
        fontSize: "0.85rem",
        marginBottom: "1rem",
      }}>
        {isPositive ? "▲" : "▼"} {Math.abs(data.usd_24h_change).toFixed(2)}% (24h)
      </div>

      {/* Watchlist Button */}
      <button
        onClick={() => onWatchlistToggle(assetId, assetName)}
        style={{
          width: "100%",
          padding: "0.5rem",
          backgroundColor: isWatchlisted ? "#1a2a1a" : "transparent",
          border: `1px solid ${isWatchlisted ? "#00ff88" : "#1e2d4a"}`,
          borderRadius: "4px",
          color: isWatchlisted ? "#00ff88" : "#64748b",
          fontSize: "0.75rem",
          cursor: "pointer",
          fontFamily: "monospace",
          letterSpacing: "0.05em",
          transition: "all 0.2s",
        }}
      >
        {isWatchlisted ? "★ WATCHING" : "☆ ADD TO WATCHLIST"}
      </button>
    </div>
  );
}
