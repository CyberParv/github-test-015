import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser, hashPassword } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  phone: z.string().optional(),
  addresses: z.array(z.record(z.string())).optional(),
  role: z.enum(["customer", "admin"]).optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (auth.role !== "admin" && auth.id !== params.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, phone: true, addresses: true },
    });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch user";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (auth.role !== "admin" && auth.id !== params.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const updateData: Record<string, unknown> = { ...data };
    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
      delete updateData.password;
    }
    if (auth.role !== "admin") {
      delete updateData.role;
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true, phone: true, addresses: true },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (auth.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { success: true } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
