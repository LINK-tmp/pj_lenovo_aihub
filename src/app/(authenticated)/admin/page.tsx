export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from "@/lib/constants";
import { AlertTriangle, ArrowRight, FileText, Clock, Radio, Inbox } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalCases, underReview, openCases, totalApps, recentCases, recentApps, alerts] =
    await Promise.all([
      prisma.useCase.count(),
      prisma.useCase.count({ where: { status: "UNDER_REVIEW" } }),
      prisma.useCase.count({ where: { status: "OPEN" } }),
      prisma.application.count(),
      prisma.useCase.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { useCase: true },
      }),
      Promise.all([
        prisma.useCase.findMany({
          where: {
            status: "UNDER_REVIEW",
            createdAt: { lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          },
        }),
        prisma.application.findMany({
          where: {
            status: "NEW",
            createdAt: { lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          },
          include: { useCase: true },
        }),
        prisma.useCase.findMany({
          where: {
            status: "OPEN",
            createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
          include: { _count: { select: { applications: true } } },
        }),
      ]),
    ]);

  const [staleReviews, staleNewApps, staleCases] = alerts;
  const alertItems: string[] = [];

  staleReviews.forEach((c) =>
    alertItems.push(`「${c.title}」の掲載審査が未対応です`)
  );
  staleNewApps.forEach((a) =>
    alertItems.push(
      `「${a.useCase.title}」への応募（${a.organizationName}）が未確認です`
    )
  );
  staleCases
    .filter((c) => c._count.applications === 0)
    .forEach((c) =>
      alertItems.push(
        `「${c.title}」が募集開始から30日経過・応募0件です`
      )
    );

  return (
    <div>
      <h1 className="text-xl font-semibold font-heading tracking-wide border-l-4 border-brand-wine pl-3 mb-6">
        ダッシュボード
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="全案件" value={totalCases} icon={FileText} />
        <KpiCard label="審査待ち" value={underReview} colorClass="text-status-review" icon={Clock} />
        <KpiCard label="募集中" value={openCases} colorClass="text-status-open" icon={Radio} />
        <KpiCard label="応募総数" value={totalApps} icon={Inbox} />
      </div>

      {alertItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold font-heading tracking-wide border-l-4 border-status-review pl-3 mb-3">
            対応が必要なアクション
          </h2>
          <div className="bg-status-review/10 border-l-4 border-status-review rounded-r-lg p-4 space-y-2">
            {alertItems.map((msg, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-status-review shrink-0 mt-0.5" />
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold font-heading tracking-wide border-l-4 border-brand-wine pl-3 mb-3">
            最近の登録案件
          </h2>
          <div className="space-y-2">
            {recentCases.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between bg-white border-l-[3px] border-l-brand-wine border border-border-default rounded-r-lg p-3 hover:shadow-sm transition-shadow"
              >
                <Link
                  href={`/admin/cases/${c.id}`}
                  className="text-sm hover:text-brand-wine truncate"
                >
                  {c.title}
                </Link>
                <Badge className={CASE_STATUS_COLORS[c.status]}>
                  {CASE_STATUS_LABELS[c.status]}
                </Badge>
              </div>
            ))}
            <Link
              href="/admin/cases"
              className="text-xs text-brand-wine hover:underline flex items-center gap-1 mt-2"
            >
              案件管理へ <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold font-heading tracking-wide border-l-4 border-cta-blue pl-3 mb-3">
            最近の応募
          </h2>
          <div className="space-y-2">
            {recentApps.map((a) => (
              <div
                key={a.id}
                className="bg-white border-l-[3px] border-l-cta-blue border border-border-default rounded-r-lg p-3 text-sm hover:shadow-sm transition-shadow"
              >
                <span className="font-medium">{a.organizationName}</span>
                <span className="text-brand-gray"> → </span>
                <span className="text-brand-gray">{a.useCase.title}</span>
              </div>
            ))}
            <Link
              href="/admin/applications"
              className="text-xs text-cta-blue hover:underline flex items-center gap-1 mt-2"
            >
              応募管理へ <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
