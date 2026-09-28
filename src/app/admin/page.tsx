import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminUserList } from "@/components/AdminUserList";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/app");
  }

  return (
    <div className="flex flex-1 justify-center px-4 py-16 sm:px-8">
      <main className="flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            會員管理後台
          </h1>
          <p className="text-sm text-muted">
            審核註冊帳號，只有「已通過」的帳號才能使用合約審查功能。
          </p>
        </header>

        <AdminUserList currentUserId={user.id} />
      </main>
    </div>
  );
}
