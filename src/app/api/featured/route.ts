import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.product.findMany({ where: { featured: true, available: true }, orderBy: { updatedAt: "desc" } });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch featured";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
