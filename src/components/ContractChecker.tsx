"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FileText, ShieldAlert, UploadCloud } from "lucide-react";

type Risk = {
  clause: string;
  issue: string;
  suggestion: string;
};

type RiskLevel = "low" | "medium" | "high";

type ContractResult = {
  id: string;
  fileName: string;
  summary: string;
  riskLevel: RiskLevel;
  risks: Risk[];
  recommendations: string[];
  createdAt: string;
};

const riskLevelStyles: Record<RiskLevel, string> = {
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const riskLevelLabel: Record<RiskLevel, string> = {
  low: "低風險",
  medium: "中風險",
  high: "高風險",
};

function fileUrl(id: string) {
  return `/api/contracts/${id}/file`;
}

export function ContractChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContractResult | null>(null);
  const [history, setHistory] = useState<ContractResult[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const loadHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch("/api/contracts");
      if (res.ok) {
        setHistory(await res.json());
      }
    } catch {
      // 歷史紀錄載入失敗不影響主要功能，靜默忽略
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    loadHistory();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("請先選擇合約檔案");
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/contracts", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "分析失敗，請稍後再試");
      }

      setResult(data);
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失敗，請稍後再試");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-1 justify-center px-4 py-16 sm:px-8">
      <main className="flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            合約審查
          </h1>
          <p className="text-muted">
            上傳合約檔案（PDF / DOCX / TXT），AI 將自動分析潛在風險條款並提供修改建議。
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <label className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center transition-colors hover:border-accent hover:bg-accent-soft">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent transition-transform group-hover:scale-105">
              <UploadCloud size={22} />
            </span>
            <span className="text-sm font-medium text-foreground">
              {file ? file.name : "點擊選擇檔案，或拖曳合約檔案到此處"}
            </span>
            <span className="text-xs text-muted">支援 PDF、DOCX、TXT，最大 10MB</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isUploading || !file}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                分析中…
              </>
            ) : (
              "上傳並分析合約"
            )}
          </button>
        </form>

        {result && (
          <section className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <a
                href={fileUrl(result.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-foreground hover:text-accent"
              >
                <FileText size={16} className="text-muted" />
                {result.fileName}
              </a>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${riskLevelStyles[result.riskLevel]}`}
              >
                {riskLevelLabel[result.riskLevel]}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-muted">{result.summary}</p>

            {result.risks.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <ShieldAlert size={15} className="text-accent" />
                  風險條款
                </h2>
                {result.risks.map((risk, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-background p-4 text-sm">
                    <p className="font-medium text-foreground">{risk.clause}</p>
                    <p className="mt-1.5 text-muted">問題：{risk.issue}</p>
                    <p className="mt-1 text-muted">建議：{risk.suggestion}</p>
                  </div>
                ))}
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-foreground">整體建議</h2>
                <ul className="list-inside list-disc text-sm leading-relaxed text-muted">
                  {result.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-foreground">歷史紀錄</h2>

          {isHistoryLoading ? (
            <p className="text-sm text-muted">載入中…</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted">尚無審查紀錄</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card p-4 text-sm shadow-sm"
                >
                  <div className="flex flex-col gap-1">
                    <a
                      href={fileUrl(item.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-accent"
                    >
                      <FileText size={14} className="text-muted" />
                      {item.fileName}
                    </a>
                    <span className="text-xs text-muted">
                      {new Date(item.createdAt).toLocaleString("zh-TW")}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${riskLevelStyles[item.riskLevel]}`}
                  >
                    {riskLevelLabel[item.riskLevel]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
