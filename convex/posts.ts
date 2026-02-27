import { query, mutation } from "./_generated/server";
import { api } from "./_generated/api";
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
        let imageUrls = post.imageUrls;
        if (post.imageIds && post.imageIds.length > 0) {
          const resolvedUrls = await Promise.all(
            post.imageIds.map((id) => ctx.storage.getUrl(id)),
          );
          imageUrls = resolvedUrls.filter((url): url is string => url !== null);
        }
        return { ...post, imageUrls };
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

    let imageUrls = post.imageUrls;
    if (post.imageIds && post.imageIds.length > 0) {
      const resolvedUrls = await Promise.all(
        post.imageIds.map((id) => ctx.storage.getUrl(id)),
      );
      imageUrls = resolvedUrls.filter((url): url is string => url !== null);
    }

    return { ...post, imageUrls };
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
        let imageUrls = post.imageUrls;
        if (post.imageIds && post.imageIds.length > 0) {
          const resolvedUrls = await Promise.all(
            post.imageIds.map((id) => ctx.storage.getUrl(id)),
          );
          imageUrls = resolvedUrls.filter((url): url is string => url !== null);
        }
        return { ...post, imageUrls };
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
      v.literal("publishing"),
      v.literal("published"),
      v.literal("failed"),
    ),
    workspaceId: v.id("workspaces"),
    imageUrls: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id("_storage"))),
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
      imageUrls: args.imageUrls,
      imageIds: args.imageIds,
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
      v.literal("publishing"),
      v.literal("published"),
      v.literal("failed"),
    ),
    imageUrls: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id("_storage"))),
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
      imageUrls: args.imageUrls,
      imageIds: args.imageIds,
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

export const updatePostStatus = mutation({
  args: {
    id: v.id("posts"),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("publishing"),
      v.literal("published"),
      v.literal("failed"),
    ),
  },
  handler: async (ctx, args) => {
    // This is called by our internal actions, so we don't strictly require an identity
    // But we still verify the post exists
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Post not found");
    }

    return await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});

export const publishScheduledPosts = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get all scheduled posts
    const scheduledPosts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .collect();

    // Filter posts that are due to be published
    const duePosts = scheduledPosts.filter(
      (post) => post.scheduledDate && post.scheduledDate <= now,
    );

    for (const post of duePosts) {
      // Mark as publishing to avoid double execution
      await ctx.db.patch(post._id, { status: "publishing" });

      let finalImageUrls = post.imageUrls;
      if (post.imageIds && post.imageIds.length > 0) {
        const resolvedUrls = await Promise.all(
          post.imageIds.map((id) => ctx.storage.getUrl(id)),
        );
        finalImageUrls = resolvedUrls.filter(
          (url): url is string => url !== null,
        );
      }

      // Trigger the appropriate action based on the platform
      if (post.platform === "linkedin") {
        await ctx.scheduler.runAfter(0, api.actions.linkedin.publish, {
          postId: post._id,
          workspaceId: post.workspaceId,
          content: post.content,
          platform: post.platform,
          imageUrls: finalImageUrls,
        });
      } else {
        // Platform not supported yet
        await ctx.db.patch(post._id, { status: "failed" });
      }
    }
  },
});
