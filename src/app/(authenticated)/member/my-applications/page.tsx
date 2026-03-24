export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from "@/lib/constants";
import { format } from "date-fns";

export default async function MyApplicationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const applications = await prisma.application.findMany({
    where: { applicantId: session.user.id },
    include: { useCase: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold font-heading tracking-wide mb-6">
        マイ応募一覧
      </h1>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-surface-light rounded-lg">
          <p className="text-brand-gray text-sm">まだ応募した案件はありません。</p>
          <Link
            href="/member"
            className="text-cta-blue text-sm mt-2 inline-block hover:underline"
          >
            案件一覧を見る →
          </Link>
        </div>
      ) : (
        <div className="border border-border-default rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-light">
                <TableHead>案件名</TableHead>
                <TableHead>企業名</TableHead>
                <TableHead>応募日</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-surface-off-white">
                  <TableCell>
                    <Link
                      href={`/member/${app.useCaseId}`}
                      className="text-cta-blue hover:underline text-sm"
                    >
                      {app.useCase.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    {app.useCase.companyName}
                  </TableCell>
                  <TableCell className="text-sm text-brand-gray">
                    {format(app.createdAt, "MM/dd")}
                  </TableCell>
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
      )}
    </div>
  );
}
