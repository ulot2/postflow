"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { PlatformOverview } from "@/components/dashboard/PlatformOverview";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UserButton } from "@clerk/nextjs";

export default function AnalyticsPage() {
  const posts = useQuery(api.posts.getPosts);

  if (posts === undefined) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 glass-card p-4 rounded-xl shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
              Dashboard
            </h1>
            <p className="text-slate-500">
              Welcome back! Here&apos;s your content overview.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 w-full min-w-0">
          <AnalyticsDashboard posts={posts} />
        </div>

        {/* Platform Overview */}
        <PlatformOverview posts={posts} />
      </main>
    </div>
  );
}
