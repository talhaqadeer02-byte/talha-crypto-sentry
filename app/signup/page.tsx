// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create account");
      return;
    }

    // Redirect to login after successful signup
    router.push("/login?registered=true");
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0e1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        padding: "2rem",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#00ff88",
            letterSpacing: "0.1em",
            marginBottom: "0.5rem",
          }}>
            CRYPTO SENTRY
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            OPERATOR REGISTRATION
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
            Create Account
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

            <div style={{ marginBottom: "1rem" }}>
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

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8rem",
                marginBottom: "0.4rem",
                letterSpacing: "0.05em",
              }}>
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              }}
            >
              {loading ? "CREATING ACCOUNT..." : "REGISTER OPERATOR"}
            </button>
          </form>

          <p style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "#64748b",
            fontSize: "0.85rem",
          }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#00ff88", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
