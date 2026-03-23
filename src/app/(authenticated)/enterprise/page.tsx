export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CaseCard } from "@/components/cases/case-card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Pagination } from "@/components/ui/pagination";
import { Plus, FileText, Radio, Inbox } from "lucide-react";

const PAGE_SIZE = 9;

export default async function EnterpriseDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));

  const where = { createdById: session.user.id };

  const [cases, totalCount, allCases] = await Promise.all([
    prisma.useCase.findMany({
      where,
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.useCase.count({ where }),
    prisma.useCase.findMany({
      where,
      include: { _count: { select: { applications: true } } },
    }),
  ]);

  const totalApplications = allCases.reduce((sum, c) => sum + c._count.applications, 0);
  const openCount = allCases.filter((c) => c.status === "OPEN" || c.status === "IN_PROGRESS").length;

  return (
    <div>
      <div className="gradient-brand-2 -mx-4 -mt-8 px-6 py-6 mb-8 rounded-b-2xl">
        <h1 className="text-white text-lg font-semibold font-heading tracking-wide">ダッシュボード</h1>
        <p className="text-white/70 text-sm mt-1">
          {session.user.organizationName} 様
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KpiCard label="全案件" value={totalCount} icon={FileText} />
        <KpiCard label="募集中" value={openCount} colorClass="text-status-open" icon={Radio} />
        <KpiCard label="応募件数" value={totalApplications} colorClass="text-status-progress" icon={Inbox} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold font-heading tracking-wide border-l-4 border-brand-wine pl-3">
          投稿した案件
        </h2>
        <Link href="/enterprise/new">
          <Button className="gradient-brand-2 gradient-brand-2-hover text-white shadow-md">
            <Plus className="w-4 h-4 mr-1" />
            新規登録
          </Button>
        </Link>
      </div>

      {cases.length === 0 && page === 1 ? (
        <div className="text-center py-16 bg-surface-light rounded-xl">
          <FileText className="w-12 h-12 text-brand-gray/30 mx-auto mb-3" />
          <p className="text-brand-gray text-sm mb-3">まだ案件を登録していません。</p>
          <Link href="/enterprise/new">
            <Button variant="outline" size="sm">最初のユースケースを登録する</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cases.map((c) => (
              <CaseCard
                key={c.id}
                id={c.id}
                title={c.title}
                companyName={c.companyName}
                status={c.status}
                industry={c.industry}
                technologies={c.technologies}
                budgetRange={c.budgetRange}
                applicationCount={c._count.applications}
                createdAt={c.createdAt}
                coverImage={c.coverImage}
                href={`/enterprise/${c.id}`}
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
