// components/Navbar.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "DASHBOARD" },
    { href: "/market", label: "MARKET" },
    { href: "/watchlist", label: "WATCHLIST" },
    { href: "/alerts", label: "ALERTS" },
  ];

  return (
    <nav style={{
      backgroundColor: "#0f1629",
      borderBottom: "1px solid #1e2d4a",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "60px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      fontFamily: "monospace",
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: "none" }}>
        <span style={{
          color: "#00ff88",
          fontWeight: "bold",
          fontSize: "1.1rem",
          letterSpacing: "0.1em",
        }}>
          ⬡ CRYPTO SENTRY
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: pathname === link.href ? "#00ff88" : "#64748b",
              textDecoration: "none",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              fontWeight: pathname === link.href ? "bold" : "normal",
              borderBottom: pathname === link.href ? "2px solid #00ff88" : "2px solid transparent",
              paddingBottom: "4px",
              transition: "color 0.2s",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{
          color: "#64748b",
          fontSize: "0.8rem",
        }}>
          {session?.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #1e2d4a",
            borderRadius: "4px",
            color: "#ef4444",
            padding: "0.4rem 0.8rem",
            fontSize: "0.75rem",
            cursor: "pointer",
            letterSpacing: "0.05em",
            fontFamily: "monospace",
          }}
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
}
