import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { connectToDatabase } from "@/lib/mongodb";
import { Contract } from "@/models/Contract";
import { extractText } from "@/lib/extractText";
import { analyzeContract, OPENAI_MODEL } from "@/lib/openai";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }
  if (currentUser.status !== "approved") {
    return NextResponse.json({ error: "您的帳號尚未通過審核，無法使用此功能" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "請選擇要上傳的合約檔案" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "檔案是空的" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "檔案大小不可超過 10MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let contractText: string;
    try {
      contractText = await extractText(buffer, file.type, file.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : "無法讀取檔案內容";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!contractText.trim()) {
      return NextResponse.json({ error: "無法從檔案中擷取到任何文字內容" }, { status: 400 });
    }

    const [blob, analysis] = await Promise.all([
      put(`contracts/${currentUser.id}/${Date.now()}-${file.name}`, buffer, {
        // This Vercel Blob store only supports public access; per-user access
        // control is enforced in the app layer instead (see /api/contracts/[id]/file),
        // which is the only place the blob's URL/pathname is ever exposed.
        access: "public",
        contentType: file.type || undefined,
      }),
      analyzeContract(contractText),
    ]);

    await connectToDatabase();
    const doc = await Contract.create({
      userId: currentUser.id,
      fileName: file.name,
      blobPathname: blob.pathname,
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
      summary: analysis.summary,
      riskLevel: analysis.riskLevel,
      risks: analysis.risks,
      recommendations: analysis.recommendations,
      model: OPENAI_MODEL,
    });

    return NextResponse.json({
      id: doc._id.toString(),
      fileName: doc.fileName,
      summary: doc.summary,
      riskLevel: doc.riskLevel,
      risks: doc.risks,
      recommendations: doc.recommendations,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    console.error("Contract analysis failed:", err);
    return NextResponse.json({ error: "合約分析失敗，請稍後再試" }, { status: 500 });
  }
}

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }
  if (currentUser.status !== "approved") {
    return NextResponse.json({ error: "您的帳號尚未通過審核" }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const contracts = await Contract.find({ userId: currentUser.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(
      contracts.map((c) => ({
        id: c._id.toString(),
        fileName: c.fileName,
        summary: c.summary,
        riskLevel: c.riskLevel,
        risks: c.risks,
        recommendations: c.recommendations,
        createdAt: c.createdAt,
      }))
    );
  } catch (err) {
    console.error("Failed to fetch contracts:", err);
    return NextResponse.json({ error: "讀取歷史紀錄失敗" }, { status: 500 });
  }
}
