import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const schema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1) })),
  shippingAddress: z.record(z.string()),
  paymentMethod: z.string().min(1),
  promoCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = schema.parse(body);

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

    if (data.promoCode) {
      const promo = await prisma.promotion.findUnique({ where: { code: data.promoCode } });
      const now = new Date();
      if (promo && promo.active && promo.validFrom <= now && promo.validTo >= now) {
        const discount = promo.discountType === "percent" ? (totalAmount * promo.value) / 100 : promo.value;
        totalAmount = Math.max(0, totalAmount - discount);
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: auth.id,
        totalAmount,
        shippingAddress: data.shippingAddress,
        status: "confirmed",
        paymentStatus: "paid",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    await prisma.cart.update({ where: { userId: auth.id }, data: { items: [] } }).catch(() => undefined);

    return NextResponse.json(
      {
        success: true,
        data: { order, payment: { status: "paid", providerResponse: "simulated" } },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
