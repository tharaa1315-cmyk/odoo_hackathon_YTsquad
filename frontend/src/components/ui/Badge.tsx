import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import type { AssetStatus } from "@/types";

const statusStyles: Record<AssetStatus, string> = {
  available: "bg-emerald-100 text-emerald-700",
  allocated: "bg-primary-100 text-primary-700",
  in_maintenance: "bg-amber-100 text-amber-700",
  requested: "bg-indigo-100 text-indigo-700",
  scrapped: "bg-slate-200 text-slate-600",
  lost: "bg-red-100 text-red-700",
};

export const StatusBadge = ({ status }: { status: AssetStatus }) => (
  <span className={cn("badge", statusStyles[status])}>{status.replace("_", " ")}</span>
);

export const Badge = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("badge bg-slate-100 text-slate-700", className)} {...props} />
);
