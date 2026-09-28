import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileText,
  History,
  Lock,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI 深度風險分析",
    description: "大型語言模型逐條檢視合約內容，揪出對您不利的條款，不再逐字苦讀。",
  },
  {
    icon: FileText,
    title: "支援多種格式",
    description: "PDF、Word、純文字檔案皆可直接上傳，幾秒鐘內完成解析與分析。",
  },
  {
    icon: Lock,
    title: "隱私與安全",
    description: "每份合約都綁定您的帳號，檔案與分析結果只有您本人能查看與下載。",
  },
  {
    icon: History,
    title: "完整歷史紀錄",
    description: "所有審查過的合約自動保存，隨時回顧風險摘要與修改建議。",
  },
];

const steps = [
  {
    icon: Upload,
    title: "上傳合約",
    description: "拖曳或選擇 PDF、DOCX、TXT 檔案，最大支援 10MB。",
  },
  {
    icon: Wand2,
    title: "AI 自動分析",
    description: "系統擷取合約全文，由 AI 逐條判讀風險與潛在問題。",
  },
  {
    icon: Sparkles,
    title: "取得審查報告",
    description: "獲得風險等級、問題條款與具體修改建議，安心簽署。",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, var(--accent-2) 45%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-24 pt-24 text-center sm:px-8 sm:pt-32">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted shadow-sm">
            <Sparkles size={13} className="text-accent" />
            由生成式 AI 驅動的合約審查助理
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.15] tracking-tight sm:text-6xl sm:leading-[1.1]">
            讓 AI 幫你，
            <br className="hidden sm:block" />
            <span className="text-gradient">讀懂每一份合約</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
            上傳租賃、承攬、聘僱或服務合約，幾秒鐘內取得風險等級、問題條款標記與具體修改建議——簽約前，先讓 AI 幫你把關。
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background shadow-lg shadow-foreground/10 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              免費開始審查
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-border-strong hover:bg-card"
            >
              登入既有帳號
            </Link>
          </div>

          {/* Preview card */}
          <div className="relative mt-20 w-full max-w-2xl">
            <div className="absolute inset-0 translate-y-6 scale-[0.97] rounded-3xl bg-gradient-to-br from-accent/20 to-accent-2/20 blur-2xl" />
            <div className="relative rounded-3xl border border-border bg-card p-6 text-left shadow-2xl shadow-black/5 sm:p-8">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">租賃合約_2026.pdf</span>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                  高風險
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                本合約對承租人較為不利：逾期付款即得立即解約並沒收全部押金、修繕費用一律由承租人負擔……
              </p>
              <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                <p className="text-xs font-medium text-foreground">押金條款</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  建議：明定押金用途、扣抵範圍與返還期限，避免出租人任意扣留。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              為什麼選擇合約衛星
            </h2>
            <p className="mt-3 text-muted">
              專為需要頻繁簽約、但沒有法務團隊的個人與小型團隊打造。
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-black/5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={19} strokeWidth={2} />
                </span>
                <h3 className="font-medium text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">三步驟，完成審查</h2>
            <p className="mt-3 text-muted">不需要法律背景，也能快速掌握合約中的關鍵風險。</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="relative flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-lg shadow-accent/20">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-accent">STEP {i + 1}</span>
                <h3 className="font-medium text-foreground">{title}</h3>
                <p className="max-w-[22ch] text-sm leading-relaxed text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            準備好用 AI 保護自己了嗎？
          </h2>
          <p className="max-w-md text-muted">
            註冊即可開始使用，審核通過後就能上傳您的第一份合約。
          </p>
          <Link
            href="/register"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background shadow-lg shadow-foreground/10 transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            免費開始審查
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
