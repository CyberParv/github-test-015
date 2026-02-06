import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) (where.createdAt as { gte?: Date }).gte = new Date(dateFrom);
      if (dateTo) (where.createdAt as { lte?: Date }).lte = new Date(dateTo);
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true, user: { select: { id: true, email: true, name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch admin orders";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
