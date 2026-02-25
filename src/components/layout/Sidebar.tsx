"use client";

import Link from "next/link";
import { FileText, Calendar, LayoutDashboard, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import { CustomUserButton } from "./CustomUserButton";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { useWorkspaceAccounts } from "@/lib/useWorkspaceAccounts";
import { useWorkspace } from "../providers/WorkspaceContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Sidebar() {
  const pathname = usePathname();
  const { activeWorkspace } = useWorkspace();
  const { accounts } = useWorkspaceAccounts(activeWorkspace?._id);

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
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings",
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
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/6 hover:text-white/80"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Connected Accounts Indicator */}
      {accounts.length > 0 && (
        <div className="px-5 mb-4">
          <Link
            href="/settings?tab=accounts"
            className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
                Accounts
              </span>
              <div className="flex -space-x-2">
                {accounts.map((account, i) => (
                  <Avatar
                    key={account._id}
                    className={`w-6 h-6 border-2 border-[#0f0f0f] relative z-[${10 - i}]`}
                  >
                    {account.avatarUrl && (
                      <AvatarImage src={account.avatarUrl} />
                    )}
                    <AvatarFallback className="bg-[#d4f24a] text-[#0f0f0f] text-[10px] font-bold">
                      {account.handle.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#d4f24a] group-hover:text-[#0f0f0f] text-white/50 transition-colors">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      )}

      {/* User Section */}
      <div className="px-4 mt-auto">
        <SignedIn>
          <div className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/4">
            <CustomUserButton />
          </div>
        </SignedIn>
      </div>
    </aside>
  );
}
