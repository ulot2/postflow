"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Settings, ExternalLink } from "lucide-react";

export function AccountSettings() {
  const { user } = useUser();
  const clerk = useClerk();

  if (!user) {
    return (
      <div className="text-[#6b6b6b] text-center py-12">Loading profile…</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <div className="flex items-center gap-5 p-5 rounded-2xl border border-[#e0dbd3] bg-white">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
          <AvatarFallback className="bg-[#d4f24a] text-[#0f0f0f] text-lg font-bold">
            {user.firstName?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-bold text-[#0f0f0f] truncate">
            {user.fullName ?? "User"}
          </h3>
          <p className="text-[14px] text-[#6b6b6b] truncate">
            {user.primaryEmailAddress?.emailAddress}
          </p>
          <p className="text-[12px] text-[#6b6b6b] mt-1">
            Joined{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>

      {/* Account Fields (read-only) */}
      <div className="space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-[#0f0f0f] mb-2 font-syne uppercase tracking-wider">
            Full Name
          </label>
          <div className="px-4 py-3 rounded-xl border border-[#e0dbd3] bg-white/60 text-[#0f0f0f] text-[14px]">
            {user.fullName ?? "—"}
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#0f0f0f] mb-2 font-syne uppercase tracking-wider">
            Email Address
          </label>
          <div className="px-4 py-3 rounded-xl border border-[#e0dbd3] bg-white/60 text-[#0f0f0f] text-[14px]">
            {user.primaryEmailAddress?.emailAddress ?? "—"}
          </div>
        </div>
      </div>

      {/* Manage Account Button */}
      <div className="pt-2">
        <button
          onClick={() => clerk.openUserProfile()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0f0f0f] text-[#d4f24a] text-[14px] font-semibold hover:opacity-90 transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          Manage Account
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </button>
        <p className="text-[12px] text-[#6b6b6b] mt-2">
          Update your name, email, password, and profile photo via Clerk.
        </p>
      </div>
    </div>
  );
}
