import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const createSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(["percent", "fixed"]),
  value: z.number().positive(),
  validFrom: z.string().datetime(),
  validTo: z.string().datetime(),
  active: z.boolean().optional().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const promotions = await prisma.promotion.findMany({ orderBy: { validFrom: "desc" } });
    return NextResponse.json({ success: true, data: promotions }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch promotions";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (auth.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data = createSchema.parse(body);

    const promotion = await prisma.promotion.create({
      data: {
        code: data.code,
        discountType: data.discountType,
        value: data.value,
        validFrom: new Date(data.validFrom),
        validTo: new Date(data.validTo),
        active: data.active,
      },
    });

    return NextResponse.json({ success: true, data: promotion }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create promotion";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
