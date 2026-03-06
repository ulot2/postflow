import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getIdeas = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const ideas = await ctx.db
      .query("ideas")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();

    // Sort: pinned first, then by creation time (already desc)
    const pinned = ideas.filter((i) => i.pinned);
    const unpinned = ideas.filter((i) => !i.pinned);
    return [...pinned, ...unpinned];
  },
});

export const createIdea = mutation({
  args: {
    content: v.string(),
    workspaceId: v.id("workspaces"),
    tags: v.optional(v.array(v.string())),
    priority: v.optional(
      v.union(v.literal("hot"), v.literal("maybe"), v.literal("someday")),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("ideas", {
      content: args.content,
      authorId: identity.subject,
      workspaceId: args.workspaceId,
      tags: args.tags,
      priority: args.priority,
      pinned: false,
    });
  },
});

export const updateIdea = mutation({
  args: {
    id: v.id("ideas"),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    priority: v.optional(
      v.union(v.literal("hot"), v.literal("maybe"), v.literal("someday")),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.authorId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const patch: Record<string, unknown> = {};
    if (args.content !== undefined) patch.content = args.content;
    if (args.tags !== undefined) patch.tags = args.tags;
    if (args.priority !== undefined) patch.priority = args.priority;

    return await ctx.db.patch(args.id, patch);
  },
});

export const togglePin = mutation({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.authorId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.id, {
      pinned: !existing.pinned,
    });
  },
});

export const deleteIdea = mutation({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.authorId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});
