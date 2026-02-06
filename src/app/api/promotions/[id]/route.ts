import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const updateSchema = z.object({
  code: z.string().min(1).optional(),
  discountType: z.enum(["percent", "fixed"]).optional(),
  value: z.number().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const promotion = await prisma.promotion.findUnique({ where: { id: params.id } });
    if (!promotion) return NextResponse.json({ success: false, error: "Promotion not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: promotion }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch promotion";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (auth.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.promotion.update({
      where: { id: params.id },
      data: {
        ...data,
        validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
        validTo: data.validTo ? new Date(data.validTo) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update promotion";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (auth.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    await prisma.promotion.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { success: true } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete promotion";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
