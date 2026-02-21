"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AnalyticsPage() {
  const posts = useQuery(api.posts.getPosts, { authorId: "user-1" });

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
              Analytics
            </h1>
            <p className="text-slate-500">
              Measure performance across all your connected channels
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10 border border-slate-300">
              <AvatarImage src="" />
              <AvatarFallback className="bg-slate-200 text-slate-600 font-medium">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 w-full min-w-0">
          <AnalyticsDashboard posts={posts} />
        </div>
      </main>
    </div>
  );
}
