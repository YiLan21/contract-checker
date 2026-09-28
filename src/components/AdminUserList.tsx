"use client";

import { useEffect, useState } from "react";

type UserStatus = "pending" | "approved" | "rejected";
type UserRole = "user" | "admin";

type AdminUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

const statusLabel: Record<UserStatus, string> = {
  pending: "待審核",
  approved: "已通過",
  rejected: "已拒絕",
};

const statusStyles: Record<UserStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function AdminUserList({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "讀取失敗");
      }
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "讀取失敗");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    loadUsers();
  }, []);

  const updateStatus = async (id: string, status: UserStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "更新失敗");
      }
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新失敗");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted">載入中…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {users.map((u) => (
        <li
          key={u.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 text-sm shadow-sm"
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">
              {u.email}
              {u.role === "admin" && (
                <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                  管理員
                </span>
              )}
            </span>
            <span className="text-xs text-muted">
              {new Date(u.createdAt).toLocaleString("zh-TW")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[u.status]}`}>
              {statusLabel[u.status]}
            </span>

            {u.id !== currentUserId && (
              <div className="flex gap-2">
                {u.status !== "approved" && (
                  <button
                    type="button"
                    disabled={updatingId === u.id}
                    onClick={() => updateStatus(u.id, "approved")}
                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                  >
                    通過
                  </button>
                )}
                {u.status !== "rejected" && (
                  <button
                    type="button"
                    disabled={updatingId === u.id}
                    onClick={() => updateStatus(u.id, "rejected")}
                    className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
                  >
                    拒絕
                  </button>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
