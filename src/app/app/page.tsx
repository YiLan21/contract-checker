import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ContractChecker } from "@/components/ContractChecker";
import { Logo } from "@/components/Logo";

export default async function AppPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.status === "pending") {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <Logo />
          <h1 className="text-lg font-semibold text-foreground">帳號審核中</h1>
          <p className="text-sm leading-relaxed text-muted">
            您的帳號正在等待管理員審核，審核通過後即可使用合約審查功能，請耐心等候。
          </p>
        </div>
      </div>
    );
  }

  if (user.status === "rejected") {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <Logo />
          <h1 className="text-lg font-semibold text-foreground">帳號未通過審核</h1>
          <p className="text-sm leading-relaxed text-muted">
            很抱歉，您的帳號未通過審核，如有疑問請聯繫管理員。
          </p>
        </div>
      </div>
    );
  }

  return <ContractChecker />;
}
