"use client";

import { useWorkspace } from "@/components/providers/WorkspaceContext";
import { useWorkspaceAccounts } from "@/lib/useWorkspaceAccounts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link2, Trash2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

interface PlatformConfig {
  id: "linkedin" | "pinterest" | "twitter" | "instagram";
  name: string;
  icon: string | React.ReactNode;
  color: string;
  comingSoon: boolean;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "bg-[#0A66C2]",
    comingSoon: false,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.604 0 12.017 0z" />
      </svg>
    ),
    color: "bg-[#E60023]",
    comingSoon: false,
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "bg-black",
    comingSoon: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.359 1.058.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.415-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.058-2.152.26-2.915.556-.788.306-1.456.714-2.122 1.382-.667.666-1.076 1.334-1.382 2.122-.296.763-.498 1.637-.556 2.915C.014 8.333 0 8.741 0 12c0 3.259.014 3.667.072 4.947.058 1.277.26 2.152.556 2.915.306.788.714 1.456 1.382 2.122.666.667 1.334 1.076 2.122 1.382.763.296 1.638.498 2.915.556C8.333 23.986 8.741 24 12 24c3.259 0 3.667-.014 4.947-.072 1.277-.058 2.152-.26 2.915-.556.788-.306 1.456-.714 2.122-1.382.667-.666 1.076-1.334 1.382-2.122.296-.763.498-1.638.556-2.915C23.986 15.667 24 15.259 24 12c0-3.259-.014-3.667-.072-4.947-.058-1.277-.26-2.152-.556-2.915-.306-.788-.714-1.456-1.382-2.122-.666-.667-1.334-1.076-2.122-1.382-.763-.296-1.638-.498-2.915-.556C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z" />
      </svg>
    ),
    color: "bg-linear-to-tr from-yellow-400 via-red-500 to-purple-500",
    comingSoon: true,
  },
];

export function ConnectedAccounts() {
  const { activeWorkspace } = useWorkspace();
  const { accounts, isLoading } = useWorkspaceAccounts(activeWorkspace?._id);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const handleConnect = (platformId: string) => {
    if (!activeWorkspace) return;
    window.location.href = `/api/auth/connect/${platformId}?workspaceId=${activeWorkspace._id}`;
  };

  const handleDisconnect = async (accountId: Id<"accounts">) => {
    if (!confirm("Are you sure you want to disconnect this account?")) return;

    setDisconnectingId(accountId);
    try {
      const res = await fetch("/api/auth/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      if (!res.ok) throw new Error("Failed to disconnect");
    } catch (err) {
      console.error(err);
      alert("Failed to disconnect account");
    } finally {
      setDisconnectingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#e0dbd3] shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#f7f4ef] rounded-xl flex items-center justify-center border border-[#e0dbd3]">
            <Link2 className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0f0f0f] font-syne">
              Connected Accounts
            </h2>
            <p className="text-sm text-[#6b6b6b]">
              Connect social media profiles to schedule and publish posts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLATFORMS.map((platform) => {
            const connectedAccount = accounts.find(
              (a) => a.platform === platform.id,
            );
            const isConnected = !!connectedAccount;

            return (
              <div
                key={platform.id}
                className={`flex flex-col p-5 rounded-2xl border transition-all ${
                  isConnected
                    ? "border-[#d4f24a] bg-[#fdfef5]"
                    : "border-[#e0dbd3] bg-[#f7f4ef]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${platform.color} rounded-xl flex items-center justify-center shrink-0`}
                    >
                      {platform.icon}
                    </div>
                    <span className="font-bold text-[#0f0f0f]">
                      {platform.name}
                    </span>
                  </div>

                  {platform.comingSoon && !isConnected && (
                    <span className="px-2.5 py-1 bg-[#e0dbd3]/50 text-[#6b6b6b] text-[11px] font-bold tracking-wider uppercase rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>

                {isConnected ? (
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#e0dbd3]/60">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 rounded-full border border-[#e0dbd3]">
                        {connectedAccount.avatarUrl ? (
                          <AvatarImage src={connectedAccount.avatarUrl} />
                        ) : null}
                        <AvatarFallback className="text-xs font-bold uppercase bg-white">
                          {connectedAccount.handle.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0f0f0f] max-w-[120px] truncate">
                          {connectedAccount.displayName}
                        </span>
                        <span className="text-xs text-[#6b6b6b] truncate">
                          @{connectedAccount.handle}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 h-8"
                      disabled={disconnectingId === connectedAccount._id}
                      onClick={() => handleDisconnect(connectedAccount._id)}
                    >
                      {disconnectingId === connectedAccount._id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-auto pt-4 border-t border-[#e0dbd3]/60 flex justify-end">
                    <Button
                      onClick={() => handleConnect(platform.id)}
                      disabled={
                        platform.comingSoon || !activeWorkspace || isLoading
                      }
                      className={
                        platform.comingSoon
                          ? "bg-[#e0dbd3] text-[#6b6b6b]"
                          : "bg-[#0f0f0f] text-[#d4f24a] hover:bg-black"
                      }
                    >
                      Connect
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
