export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  BUDGET_RANGE_LABELS,
  TARGET_AUDIENCE_LABELS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from "@/lib/constants";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { StatusChanger } from "@/components/admin/status-changer";
import { ApplicationStatusChanger } from "@/components/admin/application-status-changer";
import { TogglePublishButton } from "@/components/admin/toggle-publish-button";

export default async function AdminCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const useCase = await prisma.useCase.findUnique({
    where: { id },
    include: {
      applications: { orderBy: { createdAt: "desc" } },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        include: { user: true },
        take: 20,
      },
    },
  });

  if (!useCase) notFound();

  return (
    <div>
      <Link
        href="/admin/cases"
        className="text-sm text-brand-gray hover:text-brand-dark inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        案件管理一覧
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold font-heading tracking-wide">{useCase.title}</h1>
        <TogglePublishButton
          caseId={useCase.id}
          isPublished={useCase.isPublished}
        />
      </div>

      {/* Workflow */}
      <WorkflowStepper currentStatus={useCase.status} className="mb-6" />

      {/* Status Changer */}
      <div className="mb-6">
        <StatusChanger caseId={useCase.id} currentStatus={useCase.status} />
      </div>

      {/* Case Info */}
      <div className="bg-white border border-border-default rounded-lg p-5 mb-8 space-y-3">
        <h2 className="text-sm font-semibold font-heading tracking-wide">
          案件情報
        </h2>
        <div className="text-sm space-y-2">
          <p>
            <span className="text-brand-gray">企業:</span>{" "}
            {useCase.companyName}
          </p>
          <p>
            <span className="text-brand-gray">概要:</span> {useCase.summary}
          </p>
          <p>
            <span className="text-brand-gray">課題:</span> {useCase.challenge}
          </p>
          <div className="flex gap-6 pt-2 flex-wrap">
            <span>
              <span className="text-brand-gray">業界:</span>{" "}
              {useCase.industry || "ー"}
            </span>
            <span>
              <span className="text-brand-gray">技術:</span>{" "}
              {useCase.technologies.join(", ") || "ー"}
            </span>
            <span>
              <span className="text-brand-gray">予算:</span>{" "}
              {useCase.budgetRange
                ? BUDGET_RANGE_LABELS[useCase.budgetRange]
                : "未定"}
            </span>
          </div>
          <p className="text-xs text-brand-gray">
            投稿日: {format(useCase.createdAt, "yyyy/MM/dd")}
          </p>
        </div>
      </div>

      {/* Applications */}
      <h2 className="text-sm font-semibold font-heading tracking-wide mb-3">
        応募者一覧（{useCase.applications.length}件）
      </h2>

      {useCase.applications.length > 0 && (
        <div className="border border-border-default rounded-lg overflow-hidden mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-light">
                <TableHead>応募者</TableHead>
                <TableHead>提案概要</TableHead>
                <TableHead>応募日</TableHead>
                <TableHead>対応状況</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {useCase.applications.map((app) => (
                <Dialog key={app.id}>
                  <DialogTrigger nativeButton={false} render={<TableRow className="cursor-pointer hover:bg-surface-off-white" />}>
                      <TableCell className="text-sm font-medium">
                        {app.organizationName}
                      </TableCell>
                      <TableCell className="text-sm text-brand-gray max-w-[180px] truncate">
                        {app.proposalSummary}
                      </TableCell>
                      <TableCell className="text-sm text-brand-gray">
                        {format(app.createdAt, "MM/dd")}
                      </TableCell>
                      <TableCell>
                        <ApplicationStatusChanger
                          applicationId={app.id}
                          currentStatus={app.status}
                        />
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
                          <p className="text-xs text-brand-gray">補足</p>
                          <p className="text-sm whitespace-pre-wrap">
                            {app.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Activity Log */}
      <h2 className="text-sm font-semibold font-heading tracking-wide mb-3">
        アクティビティログ
      </h2>
      <div className="space-y-2">
        {useCase.activityLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 text-sm py-2 border-b border-border-default last:border-0"
          >
            <span className="text-xs text-brand-gray whitespace-nowrap min-w-[60px]">
              {format(log.createdAt, "MM/dd")}
            </span>
            <span>{log.detail || log.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
