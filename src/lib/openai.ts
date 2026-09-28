import OpenAI from "openai";

const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const MAX_CONTRACT_CHARS = 100_000;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type ContractAnalysis = {
  summary: string;
  riskLevel: "low" | "medium" | "high";
  risks: { clause: string; issue: string; suggestion: string }[];
  recommendations: string[];
};

const analysisSchema = {
  type: "object",
  properties: {
    summary: { type: "string", description: "合約內容的整體摘要，使用繁體中文" },
    riskLevel: { type: "string", enum: ["low", "medium", "high"] },
    risks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          clause: { type: "string", description: "相關條款內容或位置" },
          issue: { type: "string", description: "此條款潛在的風險或問題" },
          suggestion: { type: "string", description: "建議的修改方向" },
        },
        required: ["clause", "issue", "suggestion"],
        additionalProperties: false,
      },
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
      description: "整體審查建議清單",
    },
  },
  required: ["summary", "riskLevel", "risks", "recommendations"],
  additionalProperties: false,
} as const;

export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  const truncated = contractText.slice(0, MAX_CONTRACT_CHARS);

  const response = await client.responses.create({
    model: MODEL,
    instructions:
      "你是一位專業的合約審查律師助理，使用繁體中文回覆。請仔細閱讀使用者提供的合約全文，找出對使用者不利或風險較高的條款，並提出具體、可執行的修改建議。",
    input: truncated,
    text: {
      format: {
        type: "json_schema",
        name: "contract_analysis",
        schema: analysisSchema,
        strict: true,
      },
    },
  });

  return JSON.parse(response.output_text) as ContractAnalysis;
}

export { MODEL as OPENAI_MODEL };
