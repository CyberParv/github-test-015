import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const updateSchema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1) })),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const cart = await prisma.cart.findUnique({ where: { userId: auth.id } });
    if (!cart) {
      const created = await prisma.cart.create({ data: { userId: auth.id, items: [] } });
      return NextResponse.json({ success: true, data: created }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch cart";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = updateSchema.parse(body);

    const cart = await prisma.cart.upsert({
      where: { userId: auth.id },
      update: { items: data.items },
      create: { userId: auth.id, items: data.items },
    });

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update cart";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
