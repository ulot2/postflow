"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, BarChart3, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

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
    <aside className="w-64 h-screen border-r border-slate-200 glass-panel flex flex-col pt-6 pb-4 shrink-0">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          PostFlow
        </h1>
        <p className="text-xs text-slate-500 tracking-wider uppercase mt-1">
          Planner
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                item.isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <Button variant="outline" className="w-full shadow-sm text-slate-700">
          Account Settings
        </Button>
      </div>
    </aside>
  );
}
