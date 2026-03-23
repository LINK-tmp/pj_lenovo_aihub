export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_COLORS,
  BUDGET_RANGE_LABELS,
  TARGET_AUDIENCE_LABELS,
} from "@/lib/constants";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default async function MemberCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [useCase, existingApplication] = await Promise.all([
    prisma.useCase.findUnique({
      where: { id, isPublished: true },
      include: { _count: { select: { applications: true } } },
    }),
    session?.user
      ? prisma.application.findUnique({
          where: {
            useCaseId_applicantId: {
              useCaseId: id,
              applicantId: session.user.id,
            },
          },
        })
      : null,
  ]);

  if (!useCase) notFound();

  return (
    <div className="pb-20 lg:pb-0">
      <Link
        href="/member"
        className="text-sm text-brand-gray hover:text-brand-dark inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        案件一覧に戻る
      </Link>

      <WorkflowStepper currentStatus={useCase.status} className="mb-8" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={CASE_STATUS_COLORS[useCase.status]}>
              {CASE_STATUS_LABELS[useCase.status]}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold">{useCase.title}</h1>

          <section>
            <h2 className="text-sm font-semibold font-heading tracking-wide text-brand-dark mb-2">
              ユースケース概要
            </h2>
            <p className="text-sm whitespace-pre-wrap">{useCase.summary}</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold font-heading tracking-wide text-brand-dark mb-2">
              課題内容
            </h2>
            <p className="text-sm whitespace-pre-wrap">{useCase.challenge}</p>
          </section>

          {useCase.expectedDev && (
            <section>
              <h2 className="text-sm font-semibold font-heading tracking-wide text-brand-dark mb-2">
                期待する開発内容
              </h2>
              <p className="text-sm whitespace-pre-wrap">
                {useCase.expectedDev}
              </p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-[76px] space-y-4">
            <div className="bg-surface-off-white rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold font-heading tracking-wide border-b border-border-default pb-2">
                案件情報
              </h3>
              <InfoRow label="企業名" value={useCase.companyName} />
              <InfoRow label="業界" value={useCase.industry || "ー"} />
              <InfoRow
                label="技術"
                value={
                  useCase.technologies.length > 0
                    ? useCase.technologies.join(", ")
                    : "ー"
                }
              />
              <InfoRow
                label="予算"
                value={
                  useCase.budgetRange
                    ? BUDGET_RANGE_LABELS[useCase.budgetRange]
                    : "未定"
                }
              />
              <InfoRow
                label="募集対象"
                value={
                  useCase.targetAudience
                    ? TARGET_AUDIENCE_LABELS[useCase.targetAudience]
                    : "ー"
                }
              />
              <InfoRow
                label="投稿日"
                value={format(useCase.createdAt, "yyyy/MM/dd")}
              />
              <InfoRow
                label="応募数"
                value={`${useCase._count.applications}件`}
              />
            </div>

            {existingApplication ? (
              <div className="w-full bg-status-progress/10 text-status-progress border border-status-progress/20 rounded-lg py-3 text-center text-sm font-medium flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                応募済み
              </div>
            ) : (
              <Link href={`/member/${id}/apply`}>
                <Button className="w-full h-12 gradient-brand-2 gradient-brand-2-hover text-white text-base font-bold shadow-lg hover:shadow-xl transition-all">
                  応募する
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {!existingApplication && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden gradient-brand-2 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-40">
          <Link href={`/member/${id}/apply`}>
            <Button className="w-full h-12 bg-white text-brand-dark text-base font-bold shadow-lg hover:shadow-xl transition-all">
              応募する
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-brand-gray">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
