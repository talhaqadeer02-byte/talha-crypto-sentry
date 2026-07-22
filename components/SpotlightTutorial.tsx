// components/SpotlightTutorial.tsx
"use client";

import { useState, useEffect } from "react";

interface Step {
  title: string;
  description: string;
  emoji: string;
}

const STEPS: Step[] = [
  {
    title: "Welcome to Crypto Sentry",
    description:
      "Your real-time crypto surveillance terminal. This quick tour will show you how everything works. Press Next to continue.",
    emoji: "⬡",
  },
  {
    title: "Live Market Feed",
    description:
      "The Market page shows live prices for 10 cryptocurrencies, updated every 5 seconds directly from CoinGecko.",
    emoji: "📊",
  },
  {
    title: "Flash Crash Detection",
    description:
      "The surveillance engine monitors prices every 30 seconds. If any asset drops 2% or more, an alert is triggered automatically.",
    emoji: "⚠️",
  },
  {
    title: "Your Watchlist",
    description:
      "Star any asset on the Market page to add it to your personal watchlist. Track only the assets you care about.",
    emoji: "★",
  },
  {
    title: "Alert History",
    description:
      "Every flash crash is recorded in the Alerts page with the exact price, drop percentage, and timestamp.",
    emoji: "📋",
  },
  {
    title: "You're Ready!",
    description:
      "The surveillance engine is running 24/7. Head to the Market page to explore live prices and start building your watchlist.",
    emoji: "✓",
  },
];

interface Props {
  onComplete: () => void;
}

export default function SpotlightTutorial({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in on mount
    setTimeout(() => setVisible(true), 100);
  }, []);

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleComplete();
    }
  }

  function handlePrev() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleComplete() {
    setVisible(false);
    setTimeout(onComplete, 300);
  }

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s ease",
      fontFamily: "monospace",
    }}>
      <div style={{
        backgroundColor: "#0f1629",
        border: "1px solid #00ff88",
        borderRadius: "12px",
        padding: "2.5rem",
        maxWidth: "480px",
        width: "90%",
        boxShadow: "0 0 40px rgba(0,255,136,0.15)",
        position: "relative",
      }}>

        {/* Skip Button */}
        <button
          onClick={handleComplete}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "transparent",
            border: "none",
            color: "#475569",
            fontSize: "0.75rem",
            cursor: "pointer",
            fontFamily: "monospace",
            letterSpacing: "0.05em",
          }}
        >
          SKIP TOUR
        </button>

        {/* Emoji Icon */}
        <div style={{
          fontSize: "3rem",
          textAlign: "center",
          marginBottom: "1.25rem",
        }}>
          {current.emoji}
        </div>

        {/* Step Counter */}
        <div style={{
          textAlign: "center",
          color: "#00ff88",
          fontSize: "0.72rem",
          letterSpacing: "0.1em",
          marginBottom: "0.5rem",
        }}>
          STEP {step + 1} OF {STEPS.length}
        </div>

        {/* Title */}
        <h2 style={{
          color: "#e2e8f0",
          fontSize: "1.2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1rem",
          letterSpacing: "0.04em",
        }}>
          {current.title}
        </h2>

        {/* Description */}
        <p style={{
          color: "#94a3b8",
          fontSize: "0.88rem",
          lineHeight: "1.6",
          textAlign: "center",
          marginBottom: "2rem",
        }}>
          {current.description}
        </p>

        {/* Progress Bar */}
        <div style={{
          backgroundColor: "#1e2d4a",
          borderRadius: "4px",
          height: "4px",
          marginBottom: "1.5rem",
          overflow: "hidden",
        }}>
          <div style={{
            backgroundColor: "#00ff88",
            height: "100%",
            width: `${progress}%`,
            transition: "width 0.3s ease",
            borderRadius: "4px",
          }} />
        </div>

        {/* Dot Indicators */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? "20px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: i === step ? "#00ff88" : "#1e2d4a",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "0.75rem",
        }}>
          {step > 0 && (
            <button
              onClick={handlePrev}
              style={{
                flex: 1,
                padding: "0.75rem",
                backgroundColor: "transparent",
                border: "1px solid #1e2d4a",
                borderRadius: "6px",
                color: "#94a3b8",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "monospace",
                letterSpacing: "0.05em",
              }}
            >
              ← BACK
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              flex: 1,
              padding: "0.75rem",
              backgroundColor: "#00ff88",
              border: "none",
              borderRadius: "6px",
              color: "#0a0e1a",
              fontSize: "0.85rem",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
              transition: "all 0.2s",
            }}
          >
            {step === STEPS.length - 1 ? "GET STARTED →" : "NEXT →"}
          </button>
        </div>
      </div>
    </div>
  );
}
