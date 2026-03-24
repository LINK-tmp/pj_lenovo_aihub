export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from "@/lib/constants";
import { format } from "date-fns";

const PAGE_SIZE = 10;

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));

  const [applications, totalCount, newCount] = await Promise.all([
    prisma.application.findMany({
      include: { useCase: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-heading tracking-wide">
          応募管理
        </h1>
        <span className="text-sm text-brand-gray">{totalCount}件</span>
      </div>

      {newCount > 0 && (
        <div className="bg-cta-blue/5 border border-cta-blue/20 rounded-lg p-3 mb-4">
          <p className="text-sm">
            「新着」が <strong className="text-cta-blue">{newCount}件</strong> あります
          </p>
        </div>
      )}

      <div className="border border-border-default rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-light">
                <TableHead>応募者</TableHead>
                <TableHead>案件名</TableHead>
                <TableHead>応募日</TableHead>
                <TableHead>対応状況</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-surface-off-white even:bg-surface-off-white/50">
                  <TableCell className="text-sm font-medium">{app.organizationName}</TableCell>
                  <TableCell>
                    <Link href={`/admin/cases/${app.useCaseId}`} className="text-sm text-cta-blue hover:underline">
                      {app.useCase.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-brand-gray">{format(app.createdAt, "yyyy/MM/dd")}</TableCell>
                  <TableCell>
                    <Badge className={APPLICATION_STATUS_COLORS[app.status]}>
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </Badge>
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
