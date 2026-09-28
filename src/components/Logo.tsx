import { ShieldCheck } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const icon = size === "sm" ? 15 : 18;

  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-[0_4px_16px_-4px_var(--ring)]`}
    >
      <ShieldCheck size={icon} strokeWidth={2.25} />
    </span>
  );
}
