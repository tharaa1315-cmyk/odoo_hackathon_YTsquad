import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "primary" | "emerald" | "amber" | "red" | "indigo";
  hint?: string;
}

const accentStyles: Record<string, string> = {
  primary: "bg-primary-50 text-primary-600 dark:bg-primary-600/10",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10",
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10",
};

const StatCard = ({ label, value, icon: Icon, accent = "primary", hint }: StatCardProps) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1.5 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", accentStyles[accent])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

export default StatCard;
