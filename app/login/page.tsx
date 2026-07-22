// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0e1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
      padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#00ff88",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}>
              ⬡ CRYPTO SENTRY
            </h1>
          </Link>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            OPERATOR AUTHENTICATION REQUIRED
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: "#0f1629",
          border: "1px solid #1e2d4a",
          borderRadius: "8px",
          padding: "2rem",
        }}>
          <h2 style={{
            color: "#e2e8f0",
            fontSize: "1.1rem",
            marginBottom: "1.5rem",
            fontWeight: "600",
          }}>
            Sign In
          </h2>

          {error && (
            <div style={{
              backgroundColor: "#2d0a0a",
              border: "1px solid #ef4444",
              borderRadius: "6px",
              padding: "0.75rem",
              marginBottom: "1rem",
              color: "#ef4444",
              fontSize: "0.85rem",
            }}>
              {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            style={{
              width: "100%",
              padding: "0.85rem",
              backgroundColor: "#ffffff",
              color: "#1a1a1a",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              cursor: googleLoading ? "not-allowed" : "pointer",
              fontFamily: "monospace",
              letterSpacing: "0.03em",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              opacity: googleLoading ? 0.7 : 1,
              transition: "all 0.2s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "REDIRECTING..." : "CONTINUE WITH GOOGLE"}
          </button>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#1e2d4a" }} />
            <span style={{ color: "#475569", fontSize: "0.75rem" }}>OR</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#1e2d4a" }} />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8rem",
                marginBottom: "0.4rem",
                letterSpacing: "0.05em",
              }}>
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="operator@domain.com"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#0a0e1a",
                  border: "1px solid #1e2d4a",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8rem",
                marginBottom: "0.4rem",
                letterSpacing: "0.05em",
              }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#0a0e1a",
                  border: "1px solid #1e2d4a",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.85rem",
                backgroundColor: loading ? "#1e2d4a" : "#00ff88",
                color: loading ? "#64748b" : "#0a0e1a",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
                fontFamily: "monospace",
              }}
            >
              {loading ? "AUTHENTICATING..." : "ACCESS TERMINAL"}
            </button>
          </form>

          <p style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "#64748b",
            fontSize: "0.85rem",
          }}>
            No account?{" "}
            <Link href="/signup" style={{ color: "#00ff88", textDecoration: "none" }}>
              Register as operator
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
