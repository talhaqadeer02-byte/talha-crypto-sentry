// app/api/watchlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — fetch user's watchlist
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const watchlist = await prisma.watchlist.findMany({
    where: { user_id: session.user.id },
    orderBy: { added_at: "desc" },
  });

  return NextResponse.json({ watchlist });
}

// POST — add asset to watchlist
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { asset_id, asset_name } = await req.json();

  if (!asset_id || !asset_name) {
    return NextResponse.json({ error: "asset_id and asset_name are required" }, { status: 400 });
  }

  try {
    const item = await prisma.watchlist.create({
      data: {
        user_id: session.user.id,
        asset_id,
        asset_name,
      },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (err: any) {
    // Unique constraint — already in watchlist
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Already in watchlist" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
  }
}

// DELETE — remove asset from watchlist
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { asset_id } = await req.json();

  if (!asset_id) {
    return NextResponse.json({ error: "asset_id is required" }, { status: 400 });
  }

  await prisma.watchlist.deleteMany({
    where: {
      user_id: session.user.id,
      asset_id,
    },
  });

  return NextResponse.json({ success: true });
}
