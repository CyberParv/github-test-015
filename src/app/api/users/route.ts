import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser, hashPassword } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["customer", "admin"]).optional(),
  phone: z.string().optional(),
  addresses: z.array(z.record(z.string())).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, phone: true, addresses: true },
    });

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
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
    const passwordHash = await hashPassword(data.password);

    const created = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || "customer",
        phone: data.phone,
        addresses: data.addresses,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true, phone: true, addresses: true },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
