import { Schema, model, models, type InferSchemaType } from "mongoose";

const riskItemSchema = new Schema(
  {
    clause: { type: String, required: true },
    issue: { type: String, required: true },
    suggestion: { type: String, required: true },
  },
  { _id: false }
);

const contractSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    blobPathname: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    summary: { type: String, required: true },
    riskLevel: { type: String, enum: ["low", "medium", "high"], required: true },
    risks: { type: [riskItemSchema], default: [] },
    recommendations: { type: [String], default: [] },
    model: { type: String, required: true },
  },
  { timestamps: true }
);

export type ContractDocument = InferSchemaType<typeof contractSchema>;

export const Contract = models.Contract ?? model("Contract", contractSchema);
