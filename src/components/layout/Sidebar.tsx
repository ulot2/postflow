import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r border-slate-200 glass-panel flex flex-col pt-6 pb-4">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          PostFlow
        </h1>
        <p className="text-xs text-slate-500 tracking-wider uppercase mt-1">
          Planner
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 text-slate-900 font-medium transition-colors"
        >
          {/* Calendar Icon Placeholder */}
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Calendar
        </Link>
        <Link
          href="/analytics"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          {/* Chart Icon Placeholder */}
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Analytics
        </Link>
      </nav>

      <div className="px-6 mt-auto">
        <Button variant="outline" className="w-full shadow-sm text-slate-700">
          Account Settings
        </Button>
      </div>
    </aside>
  );
}
