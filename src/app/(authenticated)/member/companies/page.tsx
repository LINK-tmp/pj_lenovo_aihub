export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Building2 } from "lucide-react";

export default async function CompaniesPage() {
  const enterprises = await prisma.user.findMany({
    where: { role: "ENTERPRISE" },
    include: {
      cases: {
        where: { isPublished: true },
        include: { _count: { select: { applications: true } } },
      },
    },
    orderBy: { organizationName: "asc" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold font-heading tracking-wide border-l-4 border-brand-wine pl-3 mb-2">
        参加企業一覧
      </h1>
      <p className="text-sm text-brand-gray mb-8">
        ユースケースを公開している企業を一覧で確認できます
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enterprises.map((company) => {
          const publishedCount = company.cases.length;
          const totalApps = company.cases.reduce(
            (sum, c) => sum + c._count.applications,
            0
          );

          return (
            <Link key={company.id} href={`/member/companies/${company.id}`} className="block group">
              <div className="bg-white rounded-2xl border border-border-default overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Header image */}
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src="/company_card.png"
                    alt={company.organizationName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-brand-wine/8 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-brand-wine" />
                    </div>
                    <h2 className="font-semibold text-[15px] leading-snug line-clamp-2 group-hover:text-brand-wine transition-colors">
                      {company.organizationName}
                    </h2>
                  </div>
                  {company.organizationDesc && (
                    <p className="text-xs text-brand-gray leading-relaxed mb-3 line-clamp-2">
                      {company.organizationDesc}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-border-default flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                        <FileText className="w-3.5 h-3.5" />
                        案件 <span className="font-medium text-brand-dark">{publishedCount}</span>件
                      </span>
                      {totalApps > 0 && (
                        <Badge className="bg-brand-wine/8 text-brand-wine text-[10px] font-medium">
                          応募{totalApps}件
                        </Badge>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center group-hover:bg-brand-wine/10 transition-colors">
                      <ArrowRight className="w-4 h-4 text-brand-gray group-hover:text-brand-wine transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
