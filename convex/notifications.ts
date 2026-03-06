import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get notifications for the current user (recent 50, unread first).
 */
export const getNotifications = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);

    return notifications;
  },
});

/**
 * Get unread notification count.
 */
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return 0;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    return unread.length;
  },
});

/**
 * Mark a single notification as read.
 */
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error("Notification not found");

    // Verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user || notification.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

/**
 * Mark all notifications as read for the current user.
 */
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    for (const n of unread) {
      await ctx.db.patch(n._id, { isRead: true });
    }

    return { marked: unread.length };
  },
});

/**
 * Create a system notification for all members of a workspace.
 * Used by internal actions (publish, etc.) to notify relevant users.
 */
export const createSystemNotification = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    type: v.union(
      v.literal("post_published"),
      v.literal("post_failed"),
      v.literal("workspace_invite"),
      v.literal("role_update"),
    ),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all members of this workspace
    const members = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // If no members (pre-migration), fall back to workspace owner
    if (members.length === 0) {
      const workspace = await ctx.db.get(args.workspaceId);
      if (workspace) {
        await ctx.db.insert("notifications", {
          userId: workspace.userId,
          workspaceId: args.workspaceId,
          type: args.type,
          title: args.title,
          body: args.body,
          isRead: false,
          createdAt: Date.now(),
        });
      }
      return;
    }

    // Create a notification for each workspace member
    for (const member of members) {
      await ctx.db.insert("notifications", {
        userId: member.userId,
        workspaceId: args.workspaceId,
        type: args.type,
        title: args.title,
        body: args.body,
        isRead: false,
        createdAt: Date.now(),
      });
    }
  },
});
