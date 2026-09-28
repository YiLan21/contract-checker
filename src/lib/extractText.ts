import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractText(buffer: Buffer, mimeType: string, fileName: string): Promise<string> {
  const lowerName = fileName.toLowerCase();

  if (mimeType.includes("pdf") || lowerName.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimeType.includes("wordprocessingml") ||
    lowerName.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimeType.startsWith("text/") || lowerName.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  throw new Error("不支援的檔案格式，請上傳 PDF、DOCX 或 TXT 檔案");
}
