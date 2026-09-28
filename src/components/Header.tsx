import Link from "next/link";
import type { CurrentUser } from "@/lib/auth";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";

export function Header({ user }: { user: CurrentUser | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span className="text-[15px] font-semibold tracking-tight">
            合約衛星 <span className="text-muted font-normal">Contract Checker</span>
          </span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-5">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="hidden text-sm text-muted transition-colors hover:text-foreground sm:inline"
              >
                管理後台
              </Link>
            )}
            <Link
              href="/app"
              className="hidden text-sm text-muted transition-colors hover:text-foreground sm:inline"
            >
              我的合約
            </Link>
            <span className="hidden text-sm text-muted md:inline">{user.email}</span>
            <LogoutButton />
          </nav>
        ) : (
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground sm:px-4"
            >
              登入
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.98] sm:px-5"
            >
              免費開始
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
