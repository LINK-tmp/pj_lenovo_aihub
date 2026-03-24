export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_COLORS,
  BUDGET_RANGE_LABELS,
  TARGET_AUDIENCE_LABELS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from "@/lib/constants";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

export default async function EnterpriseCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const useCase = await prisma.useCase.findUnique({
    where: { id, createdById: session.user.id },
    include: {
      applications: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!useCase) notFound();

  return (
    <div>
      <Link
        href="/enterprise"
        className="text-sm text-brand-gray hover:text-brand-dark inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        ダッシュボードに戻る
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-semibold font-heading tracking-wide">{useCase.title}</h1>
        <Badge className={CASE_STATUS_COLORS[useCase.status]}>
          {CASE_STATUS_LABELS[useCase.status]}
        </Badge>
      </div>

      <WorkflowStepper currentStatus={useCase.status} className="mb-8" />

      {/* Case Info */}
      <div className="bg-white border border-border-default rounded-lg p-6 space-y-4 mb-8">
        <Section title="ユースケース概要" content={useCase.summary} />
        <Section title="課題内容" content={useCase.challenge} />
        {useCase.expectedDev && (
          <Section title="期待する開発内容" content={useCase.expectedDev} />
        )}

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-default">
          <InfoCell label="対象業界" value={useCase.industry || "ー"} />
          <InfoCell
            label="対象技術"
            value={useCase.technologies.join(", ") || "ー"}
          />
          <InfoCell
            label="PoC予算"
            value={
              useCase.budgetRange
                ? BUDGET_RANGE_LABELS[useCase.budgetRange]
                : "未定"
            }
          />
          <InfoCell
            label="募集対象"
            value={
              useCase.targetAudience
                ? TARGET_AUDIENCE_LABELS[useCase.targetAudience]
                : "ー"
            }
          />
          <InfoCell
            label="投稿日"
            value={format(useCase.createdAt, "yyyy/MM/dd")}
          />
          <InfoCell
            label="更新日"
            value={format(useCase.updatedAt, "yyyy/MM/dd")}
          />
        </div>
      </div>

      {/* Applications */}
      <h2 className="text-lg font-semibold font-heading tracking-wide mb-4">
        応募状況（{useCase.applications.length}件）
      </h2>

      {useCase.applications.length === 0 ? (
        <div className="text-center py-12 bg-surface-light rounded-lg">
          <p className="text-brand-gray text-sm">まだ応募はありません。</p>
        </div>
      ) : (
        <div className="border border-border-default rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-light">
                <TableHead>#</TableHead>
                <TableHead>応募者</TableHead>
                <TableHead>提案概要</TableHead>
                <TableHead>応募日</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {useCase.applications.map((app, i) => (
                <Dialog key={app.id}>
                  <DialogTrigger nativeButton={false} render={<TableRow className="cursor-pointer hover:bg-surface-off-white" />}>
                      <TableCell className="text-sm">{i + 1}</TableCell>
                      <TableCell className="text-sm font-medium">
                        {app.organizationName}
                      </TableCell>
                      <TableCell className="text-sm text-brand-gray max-w-[200px] truncate">
                        {app.proposalSummary}
                      </TableCell>
                      <TableCell className="text-sm text-brand-gray">
                        {format(app.createdAt, "MM/dd")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={APPLICATION_STATUS_COLORS[app.status]}
                        >
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </Badge>
                      </TableCell>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{app.organizationName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-brand-gray">担当者</p>
                        <p className="text-sm">{app.contactName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray">連絡先</p>
                        <p className="text-sm">{app.contactEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray">提案概要</p>
                        <p className="text-sm whitespace-pre-wrap">
                          {app.proposalSummary}
                        </p>
                      </div>
                      {app.message && (
                        <div>
                          <p className="text-xs text-brand-gray">
                            補足メッセージ
                          </p>
                          <p className="text-sm whitespace-pre-wrap">
                            {app.message}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-brand-gray pt-2 border-t border-border-default">
                        <span>
                          応募日: {format(app.createdAt, "yyyy/MM/dd")}
                        </span>
                        <Badge
                          className={APPLICATION_STATUS_COLORS[app.status]}
                        >
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </Badge>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-brand-gray mb-1">{title}</h3>
      <p className="text-sm whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-brand-gray">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
