import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  colorClass?: string;
}

export function KpiCard({ label, value, icon: Icon, colorClass }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-border-default overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-brand-gray mb-1 truncate">{label}</p>
            <p className={cn("text-2xl sm:text-3xl font-semibold font-heading tracking-wide", colorClass || "text-brand-dark")}>
              {value}
              <span className="text-xs sm:text-sm font-normal text-brand-gray ml-1">件</span>
            </p>
          </div>
          {Icon && (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-wine/10 to-brand-purple/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-mid" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
