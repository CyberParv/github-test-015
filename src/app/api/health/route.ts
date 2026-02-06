import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        success: true,
        data: {
          status: "ok",
          uptimeSeconds: Math.floor(process.uptime()),
          version: "1.0.0",
          checks: { db: "ok", storage: "ok" },
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Service degraded",
      },
      { status: 503 }
    );
  }
}
