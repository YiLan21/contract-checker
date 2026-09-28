import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-sm flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="text-sm font-semibold tracking-tight">合約衛星</span>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            用 AI 在幾秒鐘內找出合約中的風險條款，讓每一次簽約都更安心。
          </p>
        </div>

        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-3">
            <span className="font-medium text-foreground">產品</span>
            <Link href="/" className="text-muted transition-colors hover:text-foreground">
              首頁
            </Link>
            <Link href="/app" className="text-muted transition-colors hover:text-foreground">
              合約審查
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-medium text-foreground">帳號</span>
            <Link href="/login" className="text-muted transition-colors hover:text-foreground">
              登入
            </Link>
            <Link href="/register" className="text-muted transition-colors hover:text-foreground">
              註冊
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted sm:px-8">
          © {new Date().getFullYear()} 合約衛星 Contract Checker — AI
          分析結果僅供參考，正式簽約前請諮詢專業律師。
        </div>
      </div>
    </footer>
  );
}
