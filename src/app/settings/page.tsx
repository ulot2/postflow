"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { WorkspaceSettings } from "@/components/settings/WorkspaceSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { ConnectedAccounts } from "@/components/settings/ConnectedAccounts";
import { TeamMembers } from "@/components/settings/TeamMembers";
import { Briefcase, User, Link2, Users } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/components/providers/WorkspaceContext";

const tabs = [
  { id: "workspace" as const, label: "Workspace", icon: Briefcase },
  { id: "team" as const, label: "Team", icon: Users },
  { id: "account" as const, label: "Account", icon: User },
  { id: "accounts" as const, label: "Connected Accounts", icon: Link2 },
];

type TabId = "workspace" | "team" | "account" | "accounts";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { activeRole } = useWorkspace();

  const [activeTab, setActiveTab] = useState<TabId>("workspace");

  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (
      tabParam &&
      tabs.some((t) => t.id === tabParam) &&
      tabParam !== activeTab
    ) {
      setActiveTab(tabParam as TabId);
    }
  }

  // Redirect non-admins away from settings entirely
  if (activeRole !== "admin" && activeRole !== null) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f7f4ef]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-10">
          {/* Header */}
          <h1 className="text-[28px] font-extrabold text-[#0f0f0f] tracking-tight font-syne mb-1">
            Settings
          </h1>
          <p className="text-[#6b6b6b] text-[15px] mb-8">
            Manage your workspace and account preferences.
          </p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white rounded-xl border border-[#e0dbd3] mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0f0f0f] text-[#d4f24a] shadow-sm"
                      : "text-[#6b6b6b] hover:text-[#0f0f0f]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "workspace" ? (
            <WorkspaceSettings />
          ) : activeTab === "team" ? (
            <TeamMembers />
          ) : activeTab === "accounts" ? (
            <ConnectedAccounts />
          ) : (
            <AccountSettings />
          )}
        </div>
      </main>
    </div>
  );
}
