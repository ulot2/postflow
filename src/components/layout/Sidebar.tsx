"use client";

import Link from "next/link";
import { FileText, Calendar, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import { CustomUserButton } from "./CustomUserButton";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Calendar",
      href: "/",
      icon: Calendar,
      isActive: pathname === "/",
    },
    {
      name: "Posts",
      href: "/posts",
      icon: FileText,
      isActive: pathname === "/posts" || pathname.startsWith("/edit/"),
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0f0f0f] flex flex-col pt-6 pb-4 shrink-0">
      {/* App Branding */}
      <div className="px-5 mb-5">
        <div className="flex items-center gap-[10px]">
          <div className="w-[30px] h-[30px] bg-[#d4f24a] rounded-[8px] flex items-center justify-center shrink-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0f0f0f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-white text-[17px] font-extrabold tracking-[-0.02em] font-syne">
            PostFlow
          </span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 mb-6">
        <WorkspaceSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-[14px] ${
                item.isActive
                  ? "bg-white/[0.1] text-white"
                  : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="px-4 mt-auto">
        <SignedIn>
          <div className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/[0.08] bg-white/[0.04]">
            <CustomUserButton />
          </div>
        </SignedIn>
      </div>
    </aside>
  );
}
