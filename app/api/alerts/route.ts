// app/api/alerts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — fetch all flash crash alerts
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const asset_id = searchParams.get("asset_id");

  const where = asset_id ? { asset_id } : {};

  const alerts = await prisma.cryptoAlert.findMany({
    where,
    orderBy: { detected_at: "desc" },
    take: limit,
  });

  return NextResponse.json({ alerts });
}
