import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = Number(searchParams.get("range") || 7);
    const fromDate = new Date(Date.now() - range * 24 * 60 * 60 * 1000);

    const [salesTotal, ordersCount, topProducts, lowStock] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: fromDate }, paymentStatus: "paid" },
      }),
      prisma.order.count({ where: { createdAt: { gte: fromDate } } }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.product.findMany({ where: { inventoryCount: { lt: 10 } }, select: { id: true, inventoryCount: true } }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          salesTotal: salesTotal._sum.totalAmount || 0,
          ordersCount,
          topProducts: topProducts.map((p) => ({ productId: p.productId, sold: p._sum.quantity || 0 })),
          lowStock,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
