export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { CaseCard } from "@/components/cases/case-card";
import { Pagination } from "@/components/ui/pagination";
import { INDUSTRY_OPTIONS } from "@/lib/constants";
import { CaseFilters } from "./case-filters";
import type { BudgetRange, Prisma } from "@prisma/client";

const PAGE_SIZE = 9;

export default async function MemberCaseListPage({
  searchParams,
}: {
  searchParams: Promise<{
    industry?: string;
    technology?: string;
    budget?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));

  const where: Prisma.UseCaseWhereInput = {
    isPublished: true,
    status: { in: ["OPEN", "IN_PROGRESS"] },
  };

  if (sp.industry) where.industry = sp.industry;
  if (sp.technology) where.technologies = { has: sp.technology };
  if (sp.budget) where.budgetRange = sp.budget as BudgetRange;
  if (sp.q) {
    where.OR = [
      { title: { contains: sp.q, mode: "insensitive" } },
      { companyName: { contains: sp.q, mode: "insensitive" } },
      { summary: { contains: sp.q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.UseCaseOrderByWithRelationInput =
    sp.sort === "applications"
      ? { applications: { _count: "desc" } }
      : { createdAt: "desc" };

  const [cases, totalCount] = await Promise.all([
    prisma.useCase.findMany({
      where,
      include: { _count: { select: { applications: true } } },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.useCase.count({ where }),
  ]);

  return (
    <div>
      <h1 className="text-xl font-semibold font-heading tracking-wide mb-2">
        公開中のユースケース
      </h1>
      <p className="text-sm text-brand-gray mb-6">
        {totalCount}件の案件が公開中です
      </p>

      <Suspense fallback={<div className="h-[60px] bg-white rounded-xl border border-border-default mb-6 animate-pulse" />}>
        <CaseFilters
          industries={INDUSTRY_OPTIONS}
          currentIndustry={sp.industry}
          currentSort={sp.sort}
          currentQuery={sp.q}
        />
      </Suspense>

      {cases.length === 0 ? (
        <div className="text-center py-16 bg-surface-light rounded-xl">
          <p className="text-brand-gray text-sm">条件に一致するユースケースはありません。</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <CaseCard
                key={c.id}
                title={c.title}
                companyName={c.companyName}
                status={c.status}
                industry={c.industry}
                technologies={c.technologies}
                budgetRange={c.budgetRange}
                applicationCount={c._count.applications}
                createdAt={c.createdAt}
                coverImage={c.coverImage}
                href={`/member/${c.id}`}
              />
            ))}
          </div>
          <Suspense>
            <Pagination totalItems={totalCount} pageSize={PAGE_SIZE} currentPage={page} />
          </Suspense>
        </>
      )}
    </div>
  );
}
