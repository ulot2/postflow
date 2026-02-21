import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPosts = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();
  },
});

/** Posts with scheduledDate in [startTs, endTs] for the calendar week view. */
export const getPostsInRange = query({
  args: {
    authorId: v.string(),
    startTs: v.number(),
    endTs: v.number(),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();
    return all.filter((p) => {
      const sd = p.scheduledDate;
      return sd != null && sd >= args.startTs && sd <= args.endTs;
    });
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
    authorId: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published"),
    ),
    imageUrl: v.optional(v.string()),
    scheduledDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      content: args.content,
      platform: args.platform,
      status: args.status,
      authorId: args.authorId,
      imageUrl: args.imageUrl,
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
    return await ctx.db.patch(args.id, {
      scheduledDate: args.scheduledDate,
      status: "scheduled",
    });
  },
});

export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
