import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connectToDatabase } from "./mongodb";
import { User } from "@/models/User";

export const SESSION_COOKIE_NAME = "session";
const SESSION_TTL = "7d";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type UserRole = "user" | "admin";
export type UserStatus = "pending" | "approved" | "rejected";

export type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

export type CurrentUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET environment variable");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Authoritative check: re-reads the user's live status/role from the database. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;

  await connectToDatabase();
  const user = await User.findById(session.userId).lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email as string,
    role: user.role as UserRole,
    status: user.status as UserStatus,
  };
}
