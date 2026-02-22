import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Trigger hot reload

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const authorId = identity.subject;

    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), authorId))
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
    if (!identity) throw new Error("Unauthorized");

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
    startTs: v.number(),
    endTs: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const authorId = identity.subject;

    const all = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), authorId))
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
    ),
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

    return await ctx.db.insert("posts", {
      content: args.content,
      platform: args.platform,
      status: args.status,
      authorId: identity.subject,
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
