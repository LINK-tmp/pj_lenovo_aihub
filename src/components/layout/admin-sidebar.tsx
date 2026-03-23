"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Inbox, PlusCircle } from "lucide-react";

const ADMIN_NAV = [
  { label: "案件管理", href: "/admin/cases", icon: FileText },
  { label: "応募管理", href: "/admin/applications", icon: Inbox },
  { label: "代理登録", href: "/admin/proxy-register", icon: PlusCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-sidebar shrink-0 border-r border-border-default bg-surface-off-white min-h-[calc(100vh-60px)]">
      <div className="px-4 py-4 border-b border-border-default">
        <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">
          管理メニュー
        </p>
      </div>
      <nav className="p-3 space-y-1">
        {ADMIN_NAV.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-brand-wine/10 to-brand-purple/5 text-brand-wine font-medium border-l-[3px] border-brand-wine pl-[calc(0.75rem-2px)]"
                  : "text-brand-gray hover:bg-surface-light hover:text-brand-dark"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-brand-wine" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
