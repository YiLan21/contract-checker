import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { connectToDatabase } from "@/lib/mongodb";
import { Contract } from "@/models/Contract";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/contracts/[id]/file">
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }
  if (currentUser.status !== "approved") {
    return NextResponse.json({ error: "您的帳號尚未通過審核" }, { status: 403 });
  }

  const { id } = await ctx.params;

  await connectToDatabase();
  const contract = await Contract.findById(id).lean();

  if (!contract) {
    return NextResponse.json({ error: "找不到合約" }, { status: 404 });
  }

  if (contract.userId.toString() !== currentUser.id) {
    return NextResponse.json({ error: "無權限存取此檔案" }, { status: 403 });
  }

  const blob = await get(contract.blobPathname, { access: "public" });
  if (!blob || blob.statusCode !== 200) {
    return NextResponse.json({ error: "檔案不存在" }, { status: 404 });
  }

  return new Response(blob.stream, {
    headers: {
      "Content-Type": contract.mimeType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(contract.fileName)}"`,
    },
  });
}
