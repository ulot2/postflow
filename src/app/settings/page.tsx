"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { WorkspaceSettings } from "@/components/settings/WorkspaceSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { ConnectedAccounts } from "@/components/settings/ConnectedAccounts";
import { Briefcase, User, Link2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

const tabs = [
  { id: "workspace" as const, label: "Workspace", icon: Briefcase },
  { id: "account" as const, label: "Account", icon: User },
  { id: "accounts" as const, label: "Connected Accounts", icon: Link2 },
];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "workspace" | "account" | "accounts"
  >("workspace");

  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (
      tabParam === "accounts" ||
      tabParam === "account" ||
      tabParam === "workspace"
    ) {
      setActiveTab(tabParam);
    }
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
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-semibold transition-all cursor-pointer ${
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
