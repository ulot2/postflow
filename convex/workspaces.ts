import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Find the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return [];

    const workspaces = await ctx.db
      .query("workspaces")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Resolve logo URLs
    return await Promise.all(
      workspaces.map(async (ws) => {
        let brandLogoUrl = ws.brandLogoUrl;
        if (ws.brandLogoId) {
          brandLogoUrl =
            (await ctx.storage.getUrl(ws.brandLogoId)) ?? undefined;
        }
        return { ...ws, brandLogoUrl };
      }),
    );
  },
});

export const getWorkspace = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const workspace = await ctx.db.get(args.id);
    if (!workspace) return null;

    // Verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || workspace.userId !== user._id) return null;

    // Resolve logo URL
    let brandLogoUrl = workspace.brandLogoUrl;
    if (workspace.brandLogoId) {
      brandLogoUrl =
        (await ctx.storage.getUrl(workspace.brandLogoId)) ?? undefined;
    }

    return { ...workspace, brandLogoUrl };
  },
});

export const createWorkspace = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("personal"), v.literal("company")),
    brandLogoId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    let logoUrl: string | undefined;
    if (args.brandLogoId) {
      const url = await ctx.storage.getUrl(args.brandLogoId);
      if (url) logoUrl = url;
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      description: args.description,
      type: args.type,
      userId: user._id,
      brandLogoId: args.brandLogoId,
      brandLogoUrl: logoUrl,
    });

    return workspaceId;
  },
});
