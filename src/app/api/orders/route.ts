import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const createSchema = z.object({
  userId: z.string().optional(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1) })),
  shippingAddress: z.record(z.string()),
  paymentMethod: z.string().optional(),
  promoCode: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (auth.role === "customer") where.userId = auth.id;
    if (auth.role === "admin" && userId) where.userId = userId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = createSchema.parse(body);

    const userId = auth.role === "admin" && data.userId ? data.userId : auth.id;
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== data.items.length) {
      return NextResponse.json({ success: false, error: "Invalid products" }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error("Product not found");
      totalAmount += product.price * item.quantity;
      return { productId: item.productId, quantity: item.quantity, price: product.price };
    });

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress: data.shippingAddress,
        items: { create: orderItems },
        status: "pending",
        paymentStatus: "pending",
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: { order, payment: { status: "pending", providerResponse: "simulated" } } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
