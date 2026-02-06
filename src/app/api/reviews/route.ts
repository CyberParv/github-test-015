import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const createSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count(),
    ]);

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = createSchema.parse(body);

    const review = await prisma.review.create({
      data: { productId: data.productId, userId: auth.id, rating: data.rating, comment: data.comment },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create review";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
