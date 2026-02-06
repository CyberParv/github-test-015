import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: params.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where: { productId: params.id } }),
    ]);

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = reviewSchema.parse(body);

    const review = await prisma.review.create({
      data: { productId: params.id, userId: user.id, rating: data.rating, comment: data.comment },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit review";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
