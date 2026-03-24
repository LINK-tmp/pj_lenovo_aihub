"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { LogOut, User, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

type NavItem = { label: string; href: string };

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  ENTERPRISE: [
    { label: "ダッシュボード", href: "/enterprise" },
    { label: "新規登録", href: "/enterprise/new" },
  ],
  MEMBER: [
    { label: "案件一覧", href: "/member" },
    { label: "企業一覧", href: "/member/companies" },
    { label: "マイ応募", href: "/member/my-applications" },
  ],
  ADMIN: [
    { label: "ダッシュボード", href: "/admin" },
    { label: "案件管理", href: "/admin/cases" },
    { label: "応募管理", href: "/admin/applications" },
    { label: "代理登録", href: "/admin/proxy-register" },
  ],
};

interface HeaderProps {
  userName: string;
  organizationName: string;
  role: UserRole;
}

export function Header({ userName, organizationName, role }: HeaderProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role];
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 gradient-brand shadow-lg">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link href={NAV_ITEMS[role][0].href} className="flex items-center gap-2 shrink-0">
          <div>
            <div className="text-base font-bold text-white leading-tight">
              関西AI Hub
            </div>
            <div className="text-[10px] text-white/60 leading-tight">
              Kansai AI Hub
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" &&
                item.href.length > 1 &&
                pathname.startsWith(item.href) &&
                item.href !== `/${role.toLowerCase()}`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2.5 text-sm rounded-md transition-colors min-h-[44px] flex items-center ${
                  isActive
                    ? "text-white font-bold bg-white/15"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="flex items-center gap-2 text-sm hover:bg-white/10 min-h-[44px]" />}>
                <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 hidden sm:inline max-w-[120px] truncate">
                  {organizationName}
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-3 py-2 text-sm">
                <div className="font-medium">{userName}</div>
                <div className="text-muted-foreground text-xs">
                  {organizationName}
                </div>
              </div>
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-brand-red cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-white rounded-md hover:bg-white/10"
            aria-label="メニュー"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" &&
                item.href.length > 1 &&
                pathname.startsWith(item.href) &&
                item.href !== `/${role.toLowerCase()}`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm rounded-lg transition-colors min-h-[44px] ${
                  isActive
                    ? "text-white font-bold bg-white/15"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
