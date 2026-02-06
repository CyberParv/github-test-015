import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, verifyToken, revokeToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(token);
    await revokeToken(payload.jti, new Date(payload.exp ? payload.exp * 1000 : Date.now()));

    return NextResponse.json({ success: true, data: { message: "Logged out" } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
