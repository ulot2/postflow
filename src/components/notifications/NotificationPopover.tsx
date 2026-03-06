"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCheck,
  Bell,
  Send,
  AlertTriangle,
  UserPlus,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

const typeConfig = {
  post_published: {
    icon: Send,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  post_failed: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  workspace_invite: {
    icon: UserPlus,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  role_update: {
    icon: ShieldCheck,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

export function NotificationPopover({ onClose }: { onClose: () => void }) {
  const notifications = useQuery(api.notifications.getNotifications);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const acceptInvite = useMutation(api.members.acceptInvite);
  const declineInvite = useMutation(api.members.declineInvite);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleClickNotification = async (
    notificationId: Id<"notifications">,
    type: string,
  ) => {
    // Don't auto-close for invites — user needs to accept/decline
    if (type === "workspace_invite") return;
    try {
      await markAsRead({ notificationId });
    } catch {
      // silently fail
    }
    onClose();
  };

  const handleAcceptInvite = async (notificationId: Id<"notifications">) => {
    try {
      const result = await acceptInvite({ notificationId });
      toast.success(`Joined "${result.workspaceName}" successfully!`);
      onClose();
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to accept invite";
      toast.error(message);
    }
  };

  const handleDeclineInvite = async (notificationId: Id<"notifications">) => {
    try {
      await declineInvite({ notificationId });
      toast.success("Invite declined");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to decline invite";
      toast.error(message);
    }
  };

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-2xl border border-[#e0dbd3] shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0ede8]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#0f0f0f]" />
          <span className="text-[14px] font-bold text-[#0f0f0f]">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#6b6b6b] hover:text-[#0f0f0f] transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="max-h-[380px] overflow-y-auto">
        {!notifications ? (
          <div className="p-6 text-center text-[13px] text-[#6b6b6b]">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="w-8 h-8 mx-auto text-[#e0dbd3] mb-2" />
            <p className="text-[13px] text-[#6b6b6b]">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const config =
              typeConfig[notification.type as keyof typeof typeConfig];
            const Icon = config?.icon ?? Bell;
            const meta = notification.metadata as
              | { status?: string }
              | undefined;
            const isInvite = notification.type === "workspace_invite";
            const isPending =
              isInvite && meta?.status === "pending" && !notification.isRead;
            const isAccepted = isInvite && meta?.status === "accepted";
            const isDeclined = isInvite && meta?.status === "declined";

            return (
              <div
                key={notification._id}
                onClick={() =>
                  handleClickNotification(notification._id, notification.type)
                }
                className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#faf8f5] transition-colors border-b border-[#f0ede8] last:border-0 ${
                  !notification.isRead ? "bg-[#faf8f5]" : ""
                } ${!isInvite ? "cursor-pointer" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg ${config?.bg ?? "bg-gray-50"} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <Icon
                    className={`w-4 h-4 ${config?.color ?? "text-gray-500"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#0f0f0f] truncate">
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[12px] text-[#6b6b6b] mt-0.5 line-clamp-2">
                    {notification.body}
                  </p>

                  {/* Accept / Decline buttons for pending invites */}
                  {isPending && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptInvite(notification._id);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0f0f0f] text-[#d4f24a] rounded-lg text-[11px] font-semibold hover:bg-[#1a1a1a] transition-all cursor-pointer active:scale-[0.97]"
                      >
                        <Check className="w-3 h-3" />
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeclineInvite(notification._id);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 border border-[#e0dbd3] text-[#6b6b6b] rounded-lg text-[11px] font-semibold hover:bg-[#f0ede8] transition-all cursor-pointer active:scale-[0.97]"
                      >
                        <X className="w-3 h-3" />
                        Decline
                      </button>
                    </div>
                  )}

                  {/* Status badges for handled invites */}
                  {isAccepted && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-green-600">
                      <Check className="w-3 h-3" />
                      Accepted
                    </span>
                  )}
                  {isDeclined && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-red-500">
                      <X className="w-3 h-3" />
                      Declined
                    </span>
                  )}

                  <p className="text-[10px] text-[#a8a29e] mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
