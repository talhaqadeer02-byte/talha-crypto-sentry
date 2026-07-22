// app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:4000/health", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ status: "offline" }, { status: 503 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ status: "offline" }, { status: 503 });
  }
}
