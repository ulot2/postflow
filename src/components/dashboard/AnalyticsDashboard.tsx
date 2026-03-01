"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FileText, Calendar, FileEdit, CheckCircle2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import {
  format,
  subDays,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";

interface Post {
  _id: Id<"posts">;
  _creationTime: number;
  scheduledDate?: number;
  imageUrls?: string[];
  content: string;
  platform: "twitter" | "linkedin" | "instagram" | "pinterest";
  authorId: string;
  status: "draft" | "scheduled" | "published" | "failed" | "publishing";
}

export function AnalyticsDashboard({ posts }: { posts: Post[] }) {
  // 1. KPI Calculations
  const totalPosts = posts.length;
  const scheduledPosts = posts.filter((p) => p.status === "scheduled").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;

  const kpis = [
    {
      title: "Total Posts",
      value: totalPosts,
      subtext: "All time",
      icon: FileText,
      color: "text-slate-500",
      bg: "bg-slate-50",
    },
    {
      title: "Scheduled",
      value: scheduledPosts,
      subtext: "Ready to publish",
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Drafts",
      value: draftPosts,
      subtext: "In progress",
      icon: FileEdit,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Published",
      value: publishedPosts,
      subtext: "Live posts",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];

  // 2. Weekly Posts Data (Last 14 days)
  const today = new Date();
  const fourteenDaysAgo = subDays(today, 13);

  // Initialize the last 14 days with 0 counts
  const weeklyDataMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = subDays(today, i);
    weeklyDataMap.set(format(d, "MMM d"), 0);
  }

  posts.forEach((post) => {
    // Use scheduledDate if available, otherwise fallback to creation time
    const postDate = new Date(post.scheduledDate || post._creationTime);
    if (
      isWithinInterval(postDate, {
        start: startOfDay(fourteenDaysAgo),
        end: endOfDay(today),
      })
    ) {
      const dateKey = format(postDate, "MMM d");
      if (weeklyDataMap.has(dateKey)) {
        weeklyDataMap.set(dateKey, weeklyDataMap.get(dateKey)! + 1);
      }
    }
  });

  const weeklyPostsData = Array.from(weeklyDataMap.entries()).map(
    ([date, count]) => ({
      date,
      count,
    }),
  );

  // 3. Platform Distribution Data
  const platformCounts = {
    twitter: 0,
    linkedin: 0,
    instagram: 0,
    pinterest: 0,
  };
  posts.forEach((post) => {
    if (post.platform === "twitter") platformCounts.twitter++;
    else if (post.platform === "linkedin") platformCounts.linkedin++;
    else if (post.platform === "instagram") platformCounts.instagram++;
    else if (post.platform === "pinterest") platformCounts.pinterest++;
  });

  // Filter out any zero value platforms for the pie chart
  const platformData = [
    { name: "Twitter", value: platformCounts.twitter, fill: "#3b82f6" },
    { name: "LinkedIn", value: platformCounts.linkedin, fill: "#1d4ed8" },
    { name: "Instagram", value: platformCounts.instagram, fill: "#e11d48" },
    { name: "Pinterest", value: platformCounts.pinterest, fill: "#ef4444" },
  ].filter((p) => p.value > 0);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.title}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-6">
                <p className="text-slate-900 font-semibold text-sm">
                  {kpi.title}
                </p>
                <div
                  className={`w-8 h-8 rounded-full ${kpi.bg} flex items-center justify-center ${kpi.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-bold tracking-tight text-slate-900 mb-1">
                  {kpi.value}
                </h3>
                <p className="text-slate-500 text-sm">{kpi.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Area Chart */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-xs lg:col-span-2 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Weekly Posts</h3>
            </div>
          </div>

          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyPostsData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="date"
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontWeight: 500 }}
                />
                <Bar
                  dataKey="count"
                  name="Posts"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution Donut Chart */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-xs flex flex-col min-w-0">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-slate-900">
              Platform Distribution
            </h3>
          </div>

          <div className="flex-1 min-h-[250px] w-full min-w-0 flex flex-col items-center justify-center relative">
            {platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="square"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm">No post data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
