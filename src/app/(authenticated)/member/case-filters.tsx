"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface CaseFiltersProps {
  industries: string[];
  currentIndustry?: string;
  currentSort?: string;
  currentQuery?: string;
}

export function CaseFilters({
  industries,
  currentIndustry,
  currentSort,
  currentQuery,
}: CaseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/member?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => {
    router.push("/member");
  };

  const hasFilters = currentIndustry || currentQuery;

  return (
    <div className="bg-white rounded-xl border border-border-default p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
          <Input
            placeholder="キーワードで検索..."
            defaultValue={currentQuery}
            className="pl-9 h-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParam("q", (e.target as HTMLInputElement).value || null);
              }
            }}
          />
        </div>

        <Select
          value={currentIndustry || "all"}
          onValueChange={(v) => updateParam("industry", v === "all" ? null : v)}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="業界" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての業界</SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentSort || "newest"}
          onValueChange={(v) =>
            updateParam("sort", v === "newest" ? null : v)
          }
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="並び順" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">新着順</SelectItem>
            <SelectItem value="applications">応募数順</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-brand-gray hover:text-brand-dark"
          >
            <X className="w-4 h-4 mr-1" />
            クリア
          </Button>
        )}
      </div>
    </div>
  );
}
