import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Email 格式不正確" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "密碼至少需要 8 個字元" }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "此 Email 已被註冊" }, { status: 409 });
    }

    // Bootstrap: the very first registered account becomes an approved admin
    // so there is always someone able to review subsequent sign-ups.
    const isFirstUser = (await User.countDocuments()) === 0;

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      role: isFirstUser ? "admin" : "user",
      status: isFirstUser ? "approved" : "pending",
    });

    await createSession({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (err) {
    console.error("Registration failed:", err);
    return NextResponse.json({ error: "註冊失敗，請稍後再試" }, { status: 500 });
  }
}
