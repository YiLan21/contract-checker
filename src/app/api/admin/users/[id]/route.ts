import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const VALID_STATUSES = ["pending", "approved", "rejected"];

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/users/[id]">
) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "無權限" }, { status: 403 });
  }

  const { id } = await ctx.params;

  if (id === currentUser.id) {
    return NextResponse.json({ error: "無法變更自己的狀態" }, { status: 400 });
  }

  const body = await request.json();
  if (typeof body.status !== "string" || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "無效的狀態" }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.findByIdAndUpdate(id, { status: body.status }, { new: true }).lean();

  if (!user) {
    return NextResponse.json({ error: "找不到使用者" }, { status: 404 });
  }

  return NextResponse.json({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    status: user.status,
  });
}
