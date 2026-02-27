import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";

export const getAccountsByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("accounts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const getAccountsByWorkspaceInternal = internalQuery({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("accounts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const connectAccount = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    platform: v.union(
      v.literal("twitter"),
      v.literal("linkedin"),
      v.literal("instagram"),
      v.literal("pinterest"),
    ),
    platformAccountId: v.string(),
    handle: v.string(),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    tokenExpiresAt: v.optional(v.number()),
    scopes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    // Verify workspace belongs to user
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.userId !== user._id) {
      throw new Error("Unauthorized workspace access");
    }

    // Check if account is already connected
    const existing = await ctx.db
      .query("accounts")
      .withIndex("by_platform_account", (q) =>
        q
          .eq("platform", args.platform)
          .eq("platformAccountId", args.platformAccountId),
      )
      .unique();

    if (existing) {
      if (existing.workspaceId !== args.workspaceId) {
        throw new Error("Account is already connected to another workspace");
      }
      // Update tokens and profile
      await ctx.db.patch(existing._id, {
        handle: args.handle,
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        tokenExpiresAt: args.tokenExpiresAt,
        scopes: args.scopes,
        status: "active",
      });
      return existing._id;
    }

    // Insert new account
    return await ctx.db.insert("accounts", {
      platform: args.platform,
      platformAccountId: args.platformAccountId,
      handle: args.handle,
      displayName: args.displayName,
      avatarUrl: args.avatarUrl,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      tokenExpiresAt: args.tokenExpiresAt,
      scopes: args.scopes,
      status: "active",
      workspaceId: args.workspaceId,
      userId: user._id,
      connectedAt: Date.now(),
    });
  },
});

export const disconnectAccount = mutation({
  args: { id: v.id("accounts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const account = await ctx.db.get(args.id);
    if (!account || account.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
