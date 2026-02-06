import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const updateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const review = await prisma.review.findUnique({ where: { id: params.id } });
    if (!review) return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch review";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.review.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    if (auth.role !== "admin" && existing.userId !== auth.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.review.update({ where: { id: params.id }, data });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update review";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.review.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    if (auth.role !== "admin" && existing.userId !== auth.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await prisma.review.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { success: true } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete review";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
