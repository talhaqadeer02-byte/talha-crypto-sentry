// app/api/prices/route.ts
// Proxy route — fetches from Express engine on the server side
// This avoids CORS issues with direct browser → localhost:4000 calls

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://talha-crypto-sentryy.up.railway.app/api/prices", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Engine unavailable" },
        { status: 503 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch prices from surveillance engine" },
      { status: 503 }
    );
  }
}
