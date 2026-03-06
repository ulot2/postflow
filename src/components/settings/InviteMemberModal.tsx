"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useWorkspace } from "../providers/WorkspaceContext";
import { toast } from "sonner";
import { X, Mail, Shield, Loader2 } from "lucide-react";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ open, onClose }: InviteMemberModalProps) {
  const { activeWorkspace } = useWorkspace();
  const inviteMember = useMutation(api.members.inviteMember);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace || !email.trim()) return;

    setLoading(true);
    try {
      await inviteMember({
        workspaceId: activeWorkspace._id,
        email: email.trim(),
        role,
      });
      toast.success("Member invited successfully!");
      setEmail("");
      setRole("editor");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to invite member",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl border border-[#e0dbd3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ede8]">
          <h3 className="text-[16px] font-bold text-[#0f0f0f]">
            Invite Member
          </h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0ede8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#6b6b6b]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0f0f0f]">
              <Mail className="w-3.5 h-3.5 text-[#6b6b6b]" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#e0dbd3] bg-[#faf8f5] text-[14px] text-[#0f0f0f] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#0f0f0f]/10 focus:border-[#0f0f0f]/20 transition-all"
            />
            <p className="text-[11px] text-[#6b6b6b]">
              The user must have a PostFlow account to be invited.
            </p>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0f0f0f]">
              <Shield className="w-3.5 h-3.5 text-[#6b6b6b]" />
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["admin", "editor", "viewer"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 rounded-xl text-[13px] font-semibold border transition-all cursor-pointer ${
                    role === r
                      ? "bg-[#0f0f0f] text-[#d4f24a] border-[#0f0f0f]"
                      : "bg-white text-[#6b6b6b] border-[#e0dbd3] hover:border-[#0f0f0f]/20"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#6b6b6b]">
              {role === "admin"
                ? "Full access: can manage members, settings, and all content."
                : role === "editor"
                  ? "Can create, edit, and schedule posts and ideas."
                  : "Read-only access to workspace content."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-[#6b6b6b] border border-[#e0dbd3] hover:bg-[#faf8f5] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold bg-[#0f0f0f] text-[#d4f24a] hover:bg-[#1a1a1a] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send Invite"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
