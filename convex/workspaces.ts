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

    // Get workspace IDs from membership table
    const memberships = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Also still fetch by legacy userId field for backwards compatibility
    // (in case migration hasn't run yet)
    const legacyWorkspaces = await ctx.db
      .query("workspaces")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Build a de-duped set of workspace IDs
    const memberWorkspaceIds = memberships.map((m) => m.workspaceId);
    const legacyIds = legacyWorkspaces.map((ws) => ws._id);
    const allIds = [...new Set([...memberWorkspaceIds, ...legacyIds])];

    // Fetch all workspaces by their proper typed IDs
    const workspaces = await Promise.all(allIds.map((id) => ctx.db.get(id)));

    // Resolve logo URLs & attach role
    return await Promise.all(
      workspaces
        .filter((ws): ws is NonNullable<typeof ws> => ws !== null)
        .map(async (ws) => {
          let brandLogoUrl = ws.brandLogoUrl;
          if (ws.brandLogoId) {
            brandLogoUrl =
              (await ctx.storage.getUrl(ws.brandLogoId)) ?? undefined;
          }
          // Find role from membership (default to admin for legacy owner)
          const membership = memberships.find((m) => m.workspaceId === ws._id);
          const role =
            membership?.role ?? (ws.userId === user._id ? "admin" : "viewer");
          return { ...ws, brandLogoUrl, role };
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

    // Verify access via membership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return null;

    // Check membership or legacy owner
    const membership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.id).eq("userId", user._id),
      )
      .unique();

    if (!membership && workspace.userId !== user._id) return null;

    // Resolve logo URL
    let brandLogoUrl = workspace.brandLogoUrl;
    if (workspace.brandLogoId) {
      brandLogoUrl =
        (await ctx.storage.getUrl(workspace.brandLogoId)) ?? undefined;
    }

    const role = membership?.role ?? "admin";
    return { ...workspace, brandLogoUrl, role };
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

    // Auto-add creator as admin member
    await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId: user._id,
      role: "admin",
      joinedAt: Date.now(),
    });

    return workspaceId;
  },
});

export const updateWorkspace = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    brandLogoId: v.optional(v.id("_storage")),
    removeLogo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Check membership — only admin can update workspace settings
    const membership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.id).eq("userId", user._id),
      )
      .unique();

    const workspace = await ctx.db.get(args.id);
    if (!workspace) throw new Error("Workspace not found");

    // Allow if admin member or legacy owner
    if (
      (!membership || membership.role !== "admin") &&
      workspace.userId !== user._id
    ) {
      throw new Error("Only admins can update workspace settings");
    }

    const patch: Record<string, unknown> = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.description !== undefined) patch.description = args.description;

    if (args.removeLogo) {
      patch.brandLogoId = undefined;
      patch.brandLogoUrl = undefined;
    } else if (args.brandLogoId) {
      patch.brandLogoId = args.brandLogoId;
      const url = await ctx.storage.getUrl(args.brandLogoId);
      patch.brandLogoUrl = url ?? undefined;
    }

    await ctx.db.patch(args.id, patch);
    return args.id;
  },
});
