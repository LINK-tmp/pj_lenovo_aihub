"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalItems: number;
  pageSize?: number;
  currentPage: number;
}

export function Pagination({ totalItems, pageSize = 9, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-gray hover:bg-surface-light transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-brand-gray text-sm">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
              p === currentPage
                ? "gradient-brand-2 text-white shadow-sm"
                : "text-brand-gray hover:bg-surface-light"
            )}
          >
            {p}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-gray hover:bg-surface-light transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
