import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  code: z.string().min(1),
  cartTotal: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const promo = await prisma.promotion.findUnique({ where: { code: data.code } });
    if (!promo || !promo.active) {
      return NextResponse.json({ success: true, data: { valid: false, discountAmount: 0, message: "Invalid code" } }, { status: 200 });
    }
    const now = new Date();
    if (promo.validFrom > now || promo.validTo < now) {
      return NextResponse.json({ success: true, data: { valid: false, discountAmount: 0, message: "Code expired" } }, { status: 200 });
    }

    const discountAmount = promo.discountType === "percent" ? (data.cartTotal * promo.value) / 100 : promo.value;

    return NextResponse.json({ success: true, data: { valid: true, discountAmount } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to validate promo";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
