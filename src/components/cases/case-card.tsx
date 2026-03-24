import Link from "next/link";
import Image from "next/image";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_COLORS,
  BUDGET_RANGE_LABELS,
  COVER_IMAGES,
} from "@/lib/constants";
import type { CaseStatus, BudgetRange } from "@prisma/client";
import { format, differenceInDays } from "date-fns";
import { Users, Wallet } from "lucide-react";

interface CaseCardProps {
  title: string;
  companyName: string;
  status: CaseStatus;
  industry?: string | null;
  technologies: string[];
  budgetRange?: BudgetRange | null;
  applicationCount: number;
  createdAt: Date;
  coverImage?: string | null;
  href: string;
}

export function CaseCard({
  title,
  companyName,
  status,
  industry,
  technologies,
  budgetRange,
  applicationCount,
  createdAt,
  coverImage,
  href,
}: CaseCardProps) {
  const isNew = differenceInDays(new Date(), createdAt) <= 7;
  const imgSrc = coverImage || COVER_IMAGES[industry || ""] || COVER_IMAGES["default"];

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl border border-border-default overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        {/* Image - clean, no text overlay */}
        <div className="relative h-36 overflow-hidden">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Top gradient for badge readability */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
          {/* Badges pinned to image corners */}
          {isNew && (
            <span className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
              NEW
            </span>
          )}
          <span className={`absolute top-3 right-3 inline-flex items-center bg-black/40 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-md`}>
            {CASE_STATUS_LABELS[status]}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 mb-2 group-hover:text-brand-wine transition-colors">
            {title}
          </h3>

          {/* Company & date */}
          <div className="flex items-center gap-2 text-xs text-brand-gray mb-3">
            <span className="truncate">{companyName}</span>
            <span className="text-border-dark">·</span>
            <span className="shrink-0">{format(createdAt, "yyyy/MM/dd")}</span>
          </div>

          {/* Tags */}
          {(industry || technologies.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {industry && (
                <span className="text-[11px] font-medium bg-brand-wine/8 text-brand-wine px-2.5 py-0.5 rounded-full">
                  {industry}
                </span>
              )}
              {technologies.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-medium bg-surface-light text-brand-gray px-2.5 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Bottom stats */}
          <div className="mt-auto pt-3 border-t border-border-default flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-brand-gray">
              <Wallet className="w-3.5 h-3.5" />
              <span className="font-medium text-brand-dark">
                {budgetRange ? BUDGET_RANGE_LABELS[budgetRange] : "未定"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-brand-gray">
              <Users className="w-3.5 h-3.5" />
              <span>
                応募 <span className="font-medium text-brand-dark">{applicationCount}</span>件
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
