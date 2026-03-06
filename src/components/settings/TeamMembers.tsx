"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useWorkspace } from "../providers/WorkspaceContext";
import { InviteMemberModal } from "./InviteMemberModal";
import { toast } from "sonner";
import {
  UserPlus,
  MoreHorizontal,
  Crown,
  Pencil,
  Eye,
  Trash2,
  ChevronDown,
} from "lucide-react";

const roleConfig = {
  admin: {
    label: "Admin",
    icon: Crown,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
  editor: {
    label: "Editor",
    icon: Pencil,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  viewer: {
    label: "Viewer",
    icon: Eye,
    color: "text-gray-500",
    bg: "bg-gray-50 border-gray-200",
  },
};

export function TeamMembers() {
  const { activeWorkspace } = useWorkspace();
  const members = useQuery(
    api.members.getMembers,
    activeWorkspace ? { workspaceId: activeWorkspace._id } : "skip",
  );
  const removeMember = useMutation(api.members.removeMember);
  const updateRole = useMutation(api.members.updateRole);
  const [showInvite, setShowInvite] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);

  // Determine if current user is admin
  const isAdmin = (activeWorkspace as { role?: string })?.role === "admin";

  const handleRemove = async (memberId: Id<"workspaceMembers">) => {
    try {
      await removeMember({ memberId });
      toast.success("Member removed");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to remove member";
      toast.error(message);
    }
    setOpenDropdown(null);
  };

  const handleRoleChange = async (
    memberId: Id<"workspaceMembers">,
    newRole: "admin" | "editor" | "viewer",
  ) => {
    try {
      await updateRole({ memberId, newRole });
      toast.success("Role updated");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to update role";
      toast.error(message);
    }
    setOpenRoleMenu(null);
    setOpenDropdown(null);
  };

  if (!activeWorkspace) {
    return (
      <div className="text-center py-12 text-[#6b6b6b]">
        Select a workspace to manage team members.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#0f0f0f] tracking-tight">
            Team Members
          </h2>
          <p className="text-[13px] text-[#6b6b6b] mt-0.5">
            {members?.length ?? 0} member
            {(members?.length ?? 0) !== 1 ? "s" : ""} in this workspace
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f0f] text-[#d4f24a] rounded-xl text-[13px] font-semibold hover:bg-[#1a1a1a] transition-all active:scale-[0.97] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </div>

      {/* Members List */}
      <div className="bg-white rounded-2xl border border-[#e0dbd3]">
        {!members ? (
          <div className="p-8 text-center text-[#6b6b6b] text-[14px]">
            Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-[#6b6b6b] text-[14px]">
            No members yet. Invite someone to get started.
          </div>
        ) : (
          <div className="divide-y divide-[#f0ede8]">
            {members.map((member) => {
              const config = roleConfig[member.role];
              const RoleIcon = config.icon;
              const name =
                [member.firstName, member.lastName].filter(Boolean).join(" ") ||
                member.email;
              const initials = name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-[#faf8f5] transition-colors group relative"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#0f0f0f] truncate">
                        {name}
                      </p>
                      <p className="text-[12px] text-[#6b6b6b] truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Role & actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[12px] font-semibold ${config.bg} ${config.color}`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {config.label}
                    </span>

                    {isAdmin && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === member._id ? null : member._id,
                            )
                          }
                          aria-label="Member actions"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#e0dbd3]/50 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4 text-[#6b6b6b]" />
                        </button>

                        {openDropdown === member._id && (
                          <>
                            <div
                              className="fixed inset-0 z-60"
                              onClick={() => {
                                setOpenDropdown(null);
                                setOpenRoleMenu(null);
                              }}
                            />
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-[#e0dbd3] shadow-xl z-70 py-1.5">
                              {/* Change Role submenu */}
                              <div>
                                <button
                                  onClick={() =>
                                    setOpenRoleMenu(
                                      openRoleMenu === member._id
                                        ? null
                                        : member._id,
                                    )
                                  }
                                  className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-[#0f0f0f] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                                >
                                  <span className="flex items-center gap-2">
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 transition-transform ${openRoleMenu === member._id ? "rotate-180" : ""}`}
                                    />
                                    Change Role
                                  </span>
                                </button>
                                {openRoleMenu === member._id && (
                                  <div className="mx-2 mb-1 rounded-lg border border-[#f0ede8] overflow-hidden">
                                    {(
                                      ["admin", "editor", "viewer"] as const
                                    ).map((role) => {
                                      const rc = roleConfig[role];
                                      const RIcon = rc.icon;
                                      return (
                                        <button
                                          key={role}
                                          onClick={() =>
                                            handleRoleChange(member._id, role)
                                          }
                                          disabled={member.role === role}
                                          className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] hover:bg-[#faf8f5] transition-colors cursor-pointer ${
                                            member.role === role
                                              ? "opacity-40 cursor-default"
                                              : ""
                                          } ${rc.color}`}
                                        >
                                          <RIcon className="w-3.5 h-3.5" />
                                          {rc.label}
                                          {member.role === role && (
                                            <span className="ml-auto text-[10px] text-[#a8a29e]">
                                              Current
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              {/* Divider */}
                              <div className="h-px bg-[#f0ede8] mx-2 my-1" />
                              {/* Remove */}
                              <button
                                onClick={() => handleRemove(member._id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove Member
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <InviteMemberModal
        open={showInvite}
        onClose={() => setShowInvite(false)}
      />
    </div>
  );
}
