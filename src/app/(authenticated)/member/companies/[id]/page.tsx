export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CaseCard } from "@/components/cases/case-card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, Calendar } from "lucide-react";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const company = await prisma.user.findUnique({
    where: { id, role: "ENTERPRISE" },
    include: {
      cases: {
        where: { isPublished: true },
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) notFound();

  return (
    <div>
      <Link
        href="/member/companies"
        className="text-sm text-brand-gray hover:text-brand-dark inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        企業一覧に戻る
      </Link>

      <div className="gradient-brand-2 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <Building2 className="w-10 h-10 text-white/60" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold font-heading tracking-wide text-white mb-1">
              {company.organizationName}
            </h1>
            {company.organizationDesc && (
              <p className="text-white/70 text-sm">{company.organizationDesc}</p>
            )}
            <p className="text-white/50 text-xs mt-2">
              公開案件: {company.cases.length}件
            </p>
          </div>
          <Link href={`/member/meetings?hostId=${company.id}&hostName=${encodeURIComponent(company.organizationName)}`}>
            <Button className="bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm">
              <Calendar className="w-4 h-4 mr-2" />
              面談を予約
            </Button>
          </Link>
        </div>
      </div>

      <h2 className="text-lg font-semibold font-heading tracking-wide border-l-4 border-brand-wine pl-3 mb-6">
        公開中のユースケース
      </h2>

      {company.cases.length === 0 ? (
        <div className="text-center py-12 bg-surface-light rounded-xl">
          <p className="text-brand-gray text-sm">
            現在公開中のユースケースはありません。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {company.cases.map((c) => (
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
              href={`/member/${c.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
