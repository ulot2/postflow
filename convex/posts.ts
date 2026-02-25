import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPosts = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return await Promise.all(
      posts.map(async (post) => {
        let imageUrl = post.imageUrl;
        if (post.imageId) {
          imageUrl = (await ctx.storage.getUrl(post.imageId)) ?? undefined;
        }
        return { ...post, imageUrl };
      }),
    );
  },
});

export const getPost = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const post = await ctx.db.get(args.id);
    if (!post || post.authorId !== identity.subject) return null;

    let imageUrl = post.imageUrl;
    if (post.imageId) {
      imageUrl = (await ctx.storage.getUrl(post.imageId)) ?? undefined;
    }

    return { ...post, imageUrl };
  },
});

export const getPostsInRange = query({
  args: {
    workspaceId: v.id("workspaces"),
    startTs: v.number(),
    endTs: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const all = await ctx.db
      .query("posts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const filtered = all.filter((p) => {
      const sd = p.scheduledDate;
      return sd != null && sd >= args.startTs && sd <= args.endTs;
    });

    return await Promise.all(
      filtered.map(async (post) => {
        let imageUrl = post.imageUrl;
        if (post.imageId) {
          imageUrl = (await ctx.storage.getUrl(post.imageId)) ?? undefined;
        }
        return { ...post, imageUrl };
      }),
    );
  },
});

export const createPost = mutation({
  args: {
    content: v.string(),
    platform: v.union(
      v.literal("twitter"),
      v.literal("linkedin"),
      v.literal("instagram"),
      v.literal("pinterest"),
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published"),
    ),
    workspaceId: v.id("workspaces"),
    imageUrl: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    scheduledDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("posts", {
      content: args.content,
      platform: args.platform,
      status: args.status,
      authorId: identity.subject,
      workspaceId: args.workspaceId,
      imageUrl: args.imageUrl,
      imageId: args.imageId,
      scheduledDate: args.scheduledDate,
    });
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    content: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published"),
    ),
    imageUrl: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    scheduledDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.authorId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.id, {
      content: args.content,
      status: args.status,
      imageUrl: args.imageUrl,
      imageId: args.imageId,
      scheduledDate: args.scheduledDate,
    });
  },
});

export const updateSchedule = mutation({
  args: {
    id: v.id("posts"),
    scheduledDate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.authorId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.id, {
      scheduledDate: args.scheduledDate,
      status: "scheduled",
    });
  },
});

export const deletePost = mutation({
  args: { id: v.id("posts") },
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
