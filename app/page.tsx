// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0e1a",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background Grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        zIndex: 0,
      }} />

      {/* Glow Effect */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "300px",
        background: "radial-gradient(ellipse, rgba(0,255,136,0.06) 0%, transparent 70%)",
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "700px" }}>

        {/* Badge */}
        <div style={{
          display: "inline-block",
          backgroundColor: "#0f1629",
          border: "1px solid #00ff8833",
          borderRadius: "20px",
          padding: "0.4rem 1rem",
          color: "#00ff88",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          marginBottom: "2rem",
        }}>
          ● SURVEILLANCE ENGINE ACTIVE
        </div>

        {/* Logo */}
        <h1 style={{
          fontSize: "4rem",
          fontWeight: "bold",
          color: "#e2e8f0",
          letterSpacing: "0.05em",
          marginBottom: "0.5rem",
          lineHeight: 1.1,
        }}>
          CRYPTO{" "}
          <span style={{ color: "#00ff88" }}>SENTRY</span>
        </h1>

        {/* Tagline */}
        <p style={{
          color: "#64748b",
          fontSize: "1rem",
          marginBottom: "0.75rem",
          letterSpacing: "0.05em",
        }}>
          REAL-TIME FLASH CRASH DETECTION TERMINAL
        </p>

        <p style={{
          color: "#475569",
          fontSize: "0.85rem",
          marginBottom: "3rem",
          lineHeight: 1.6,
          maxWidth: "500px",
          margin: "0 auto 3rem",
        }}>
          Monitor 10 cryptocurrencies 24/7. Get instant alerts when prices
          drop 2% or more. Built for operators who need to stay ahead of the market.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "4rem",
          flexWrap: "wrap",
        }}>
          <Link href="/signup" style={{
            padding: "0.9rem 2rem",
            backgroundColor: "#00ff88",
            color: "#0a0e1a",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "0.9rem",
            letterSpacing: "0.05em",
          }}>
            START MONITORING →
          </Link>
          <Link href="/login" style={{
            padding: "0.9rem 2rem",
            backgroundColor: "transparent",
            color: "#e2e8f0",
            border: "1px solid #1e2d4a",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "0.9rem",
            letterSpacing: "0.05em",
          }}>
            SIGN IN
          </Link>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "3rem",
        }}>
          {[
            {
              icon: "📡",
              title: "Live Surveillance",
              desc: "Prices fetched from CoinGecko every 30 seconds",
            },
            {
              icon: "⚠️",
              title: "Flash Crash Alerts",
              desc: "Instant detection when any asset drops ≥2%",
            },
            {
              icon: "★",
              title: "Personal Watchlist",
              desc: "Track your favorite assets with live price updates",
            },
          ].map((feature) => (
            <div key={feature.title} style={{
              backgroundColor: "#0f1629",
              border: "1px solid #1e2d4a",
              borderRadius: "8px",
              padding: "1.5rem 1rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{feature.icon}</div>
              <div style={{
                color: "#e2e8f0",
                fontWeight: "bold",
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
                letterSpacing: "0.04em",
              }}>
                {feature.title}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.78rem", lineHeight: 1.5 }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
          borderTop: "1px solid #1e2d4a",
          paddingTop: "2rem",
        }}>
          {[
            { value: "10", label: "ASSETS MONITORED" },
            { value: "30s", label: "POLL INTERVAL" },
            { value: "2%", label: "CRASH THRESHOLD" },
            { value: "24/7", label: "UPTIME" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{
                color: "#00ff88",
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.25rem",
              }}>
                {stat.value}
              </div>
              <div style={{ color: "#475569", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
