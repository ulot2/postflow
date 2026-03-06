import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
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
    imageUrl: v.optional(v.string()), // Legacy field
    imageId: v.optional(v.id("_storage")), // Legacy field
    imageUrls: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id("_storage"))), // Convex Storage IDs
    scheduledDate: v.optional(v.number()), // Unix timestamp
    authorId: v.string(),
    workspaceId: v.id("workspaces"),
  })
    .index("by_status", ["status"])
    .index("by_workspace", ["workspaceId"]),

  accounts: defineTable({
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
    status: v.union(
      v.literal("active"),
      v.literal("expired"),
      v.literal("revoked"),
    ),
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    connectedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_platform_account", ["platform", "platformAccountId"]),

  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    hasCompletedOnboarding: v.boolean(),
  }).index("by_clerk_id", ["clerkId"]),

  workspaces: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("personal"), v.literal("company")),
    userId: v.id("users"),
    brandLogoUrl: v.optional(v.string()),
    brandLogoId: v.optional(v.id("_storage")),
  }).index("by_user", ["userId"]),

  ideas: defineTable({
    content: v.string(),
    authorId: v.string(),
    workspaceId: v.id("workspaces"),
    tags: v.optional(v.array(v.string())),
    pinned: v.optional(v.boolean()),
    priority: v.optional(
      v.union(v.literal("hot"), v.literal("maybe"), v.literal("someday")),
    ),
  }).index("by_workspace", ["workspaceId"]),

  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    joinedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_workspace_and_user", ["workspaceId", "userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    workspaceId: v.optional(v.id("workspaces")),
    type: v.union(
      v.literal("post_published"),
      v.literal("post_failed"),
      v.literal("workspace_invite"),
      v.literal("role_update"),
    ),
    title: v.string(),
    body: v.string(),
    isRead: v.boolean(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
