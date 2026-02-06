import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  imageUrls: z.array(z.string()).optional().default([]),
  available: z.boolean().optional().default(true),
  inventoryCount: z.number().int().min(0),
  featured: z.boolean().optional().default(false),
});

const allowedSortFields = ["createdAt", "price", "name", "updatedAt"]; 

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const tags = searchParams.get("tags");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const where: Record<string, unknown> = {};
    if (category) where.categoryId = category;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      where.tags = { hasSome: tagList };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as { gte?: number }).gte = Number(minPrice);
      if (maxPrice) (where.price as { lte?: number }).lte = Number(maxPrice);
    }

    const orderByField = allowedSortFields.includes(sort) ? sort : "createdAt";
    const orderBy = { [orderByField]: order === "asc" ? "asc" : "desc" } as Record<string, "asc" | "desc">;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const product = await prisma.product.create({ data });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
