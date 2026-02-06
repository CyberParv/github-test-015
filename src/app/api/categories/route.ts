import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().min(1),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeCounts = searchParams.get("includeCounts") === "true";

    const categories = await prisma.category.findMany({
      include: includeCounts ? { _count: { select: { products: true } } } : undefined,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch categories";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data = createSchema.parse(body);

    const category = await prisma.category.create({ data });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
