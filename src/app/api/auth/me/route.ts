import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userInfo = await getAuthUser(req);
    if (!userInfo) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userInfo.id } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: { id: user.id, name: user.name, email: user.email, role: user.role, addresses: user.addresses, phone: user.phone, createdAt: user.createdAt },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
