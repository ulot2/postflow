import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * List all members of a workspace (with user details).
 */
export const getMembers = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const members = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // Attach user info
    return await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          email: user?.email ?? "",
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
        };
      }),
    );
  },
});

/**
 * Invite a user to a workspace by email.
 * Creates a pending notification — user must accept to be added.
 */
export const inviteMember = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Resolve calling user
    const caller = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!caller) throw new Error("User not found");

    // Verify caller is admin of this workspace
    const callerMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", caller._id),
      )
      .unique();

    if (!callerMembership || callerMembership.role !== "admin") {
      throw new Error("Only admins can invite members");
    }

    // Find target user by email
    const allUsers = await ctx.db.query("users").collect();
    const targetUser = allUsers.find(
      (u) => u.email.toLowerCase() === args.email.toLowerCase(),
    );

    if (!targetUser) {
      throw new Error(
        "No user found with that email. They must sign up first.",
      );
    }

    // Check if already a member
    const existing = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", targetUser._id),
      )
      .unique();

    if (existing) {
      throw new Error("User is already a member of this workspace");
    }

    // Check if there's already a pending invite notification
    const existingNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", targetUser._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), "workspace_invite"),
          q.eq(q.field("isRead"), false),
        ),
      )
      .collect();

    const hasPendingInvite = existingNotifications.some(
      (n) => n.workspaceId === args.workspaceId,
    );

    if (hasPendingInvite) {
      throw new Error(
        "This user already has a pending invite to this workspace",
      );
    }

    // Get workspace name for notification
    const workspace = await ctx.db.get(args.workspaceId);

    // Create a pending invite notification (NOT adding to workspaceMembers yet)
    await ctx.db.insert("notifications", {
      userId: targetUser._id,
      workspaceId: args.workspaceId,
      type: "workspace_invite",
      title: "Workspace Invitation",
      body: `You've been invited to join "${workspace?.name ?? "a workspace"}" as ${args.role}.`,
      isRead: false,
      metadata: { invitedBy: caller._id, role: args.role, status: "pending" },
      createdAt: Date.now(),
    });

    return targetUser._id;
  },
});

/**
 * Accept a workspace invite notification.
 * Adds the user to workspaceMembers with the invited role.
 */
export const acceptInvite = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error("Notification not found");
    if (notification.userId !== user._id) throw new Error("Unauthorized");
    if (notification.type !== "workspace_invite") {
      throw new Error("Not an invite notification");
    }

    const meta = notification.metadata as
      | { role?: string; status?: string }
      | undefined;
    if (meta?.status === "accepted") {
      throw new Error("Invite already accepted");
    }
    if (meta?.status === "declined") {
      throw new Error("Invite was already declined");
    }

    const workspaceId = notification.workspaceId;
    if (!workspaceId) throw new Error("Invalid invite");

    // Check not already a member
    const existing = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", user._id),
      )
      .unique();

    if (!existing) {
      const role = (meta?.role as "admin" | "editor" | "viewer") ?? "viewer";
      await ctx.db.insert("workspaceMembers", {
        workspaceId,
        userId: user._id,
        role,
        joinedAt: Date.now(),
      });
    }

    // Update the notification as accepted
    await ctx.db.patch(args.notificationId, {
      isRead: true,
      metadata: { ...meta, status: "accepted" },
    });

    // Get workspace name for the toast
    const workspace = await ctx.db.get(workspaceId);
    return { workspaceName: workspace?.name ?? "Workspace" };
  },
});

/**
 * Decline a workspace invite notification.
 */
export const declineInvite = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error("Notification not found");
    if (notification.userId !== user._id) throw new Error("Unauthorized");
    if (notification.type !== "workspace_invite") {
      throw new Error("Not an invite notification");
    }

    const meta = notification.metadata as { status?: string } | undefined;

    // Mark as declined and read
    await ctx.db.patch(args.notificationId, {
      isRead: true,
      metadata: { ...meta, status: "declined" },
    });
  },
});

/**
 * Remove a member from a workspace (admin only).
 */
export const removeMember = mutation({
  args: { memberId: v.id("workspaceMembers") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const caller = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!caller) throw new Error("User not found");

    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");

    // Verify caller is admin
    const callerMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", caller._id),
      )
      .unique();

    if (!callerMembership || callerMembership.role !== "admin") {
      throw new Error("Only admins can remove members");
    }

    // Prevent removing yourself
    if (member.userId === caller._id) {
      throw new Error("You cannot remove yourself from the workspace");
    }

    await ctx.db.delete(args.memberId);
  },
});

/**
 * Update a member's role (admin only).
 */
export const updateRole = mutation({
  args: {
    memberId: v.id("workspaceMembers"),
    newRole: v.union(
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer"),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const caller = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!caller) throw new Error("User not found");

    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");

    // Verify caller is admin
    const callerMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", caller._id),
      )
      .unique();

    if (!callerMembership || callerMembership.role !== "admin") {
      throw new Error("Only admins can change roles");
    }

    await ctx.db.patch(args.memberId, { role: args.newRole });

    // Notify the member about the role change
    const workspace = await ctx.db.get(member.workspaceId);
    await ctx.db.insert("notifications", {
      userId: member.userId,
      workspaceId: member.workspaceId,
      type: "role_update",
      title: "Role Updated",
      body: `Your role in "${workspace?.name ?? "a workspace"}" has been changed to ${args.newRole}.`,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

/**
 * Migration helper: ensure existing workspace creators have admin membership.
 * Safe to run multiple times (idempotent).
 */
export const migrateExistingWorkspaces = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const allWorkspaces = await ctx.db.query("workspaces").collect();
    let migrated = 0;

    for (const ws of allWorkspaces) {
      // Check if creator already has membership
      const existing = await ctx.db
        .query("workspaceMembers")
        .withIndex("by_workspace_and_user", (q) =>
          q.eq("workspaceId", ws._id).eq("userId", ws.userId),
        )
        .unique();

      if (!existing) {
        await ctx.db.insert("workspaceMembers", {
          workspaceId: ws._id,
          userId: ws.userId,
          role: "admin",
          joinedAt: Date.now(),
        });
        migrated++;
      }
    }

    return { migrated };
  },
});
