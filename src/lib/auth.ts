import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export interface AuthTokenPayload {
  sub: string;
  role: "customer" | "admin";
  jti: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const TOKEN_EXPIRES_IN = "7d";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const signToken = (payload: Omit<AuthTokenPayload, "jti">): string => {
  const jti = crypto.randomUUID();
  return jwt.sign({ ...payload, jti }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

export const verifyToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
};

export const revokeToken = async (jti: string, expiresAt: Date): Promise<void> => {
  await prisma.revokedToken.create({
    data: { jti, expiresAt },
  });
};

export const isTokenRevoked = async (jti: string): Promise<boolean> => {
  const revoked = await prisma.revokedToken.findUnique({ where: { jti } });
  return Boolean(revoked);
};

export const getAuthUser = async (req: NextRequest): Promise<{ id: string; role: "customer" | "admin" } | null> => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  try {
    const payload = verifyToken(token);
    const revoked = await isTokenRevoked(payload.jti);
    if (revoked) return null;
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
};
