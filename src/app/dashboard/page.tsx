"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { PlatformOverview } from "@/components/dashboard/PlatformOverview";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useWorkspace } from "@/components/providers/WorkspaceContext";

export default function AnalyticsPage() {
  const { activeWorkspace } = useWorkspace();
  const posts = useQuery(
    api.posts.getPosts,
    activeWorkspace ? { workspaceId: activeWorkspace._id } : "skip",
  );

  if (posts === undefined) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-[#f7f4ef]">
          <div className="w-8 h-8 border-4 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f7f4ef] flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white border border-[#e0dbd3] p-4 rounded-xl shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0f0f0f] mb-1 font-syne">
              Dashboard
            </h1>
            <p className="text-[#6b6b6b]">
              Welcome back! Here&apos;s your content overview.
            </p>
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
