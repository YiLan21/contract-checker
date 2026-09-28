import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "無權限" }, { status: 403 });
  }

  await connectToDatabase();
  const users = await User.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json(
    users.map((u) => ({
      id: u._id.toString(),
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    }))
  );
}
