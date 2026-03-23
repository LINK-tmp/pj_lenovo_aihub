export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from "@/lib/constants";
import { TogglePublishButton } from "@/components/admin/toggle-publish-button";

const PAGE_SIZE = 10;

export default async function AdminCaseListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));

  const [cases, totalCount] = await Promise.all([
    prisma.useCase.findMany({
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.useCase.count(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-heading tracking-wide border-l-4 border-brand-red pl-3">
          案件管理
        </h1>
        <span className="text-sm text-brand-gray">{totalCount}件</span>
      </div>

      <div className="border border-border-default rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-light">
                <TableHead>案件名</TableHead>
                <TableHead>企業名</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="text-center">応募</TableHead>
                <TableHead className="text-center">公開</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow key={c.id} className="hover:bg-surface-off-white even:bg-surface-off-white/50">
                  <TableCell>
                    <Link href={`/admin/cases/${c.id}`} className="text-sm text-cta-blue hover:underline font-medium">
                      {c.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{c.companyName}</TableCell>
                  <TableCell>
                    <Badge className={CASE_STATUS_COLORS[c.status]}>{CASE_STATUS_LABELS[c.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {c._count.applications > 0 ? c._count.applications : "ー"}
                  </TableCell>
                  <TableCell className="text-center">
                    <TogglePublishButton caseId={c.id} isPublished={c.isPublished} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Suspense>
        <Pagination totalItems={totalCount} pageSize={PAGE_SIZE} currentPage={page} />
      </Suspense>
    </div>
  );
}
