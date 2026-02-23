import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
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
    imageId: v.optional(v.id("_storage")), // Convex Storage ID
    scheduledDate: v.optional(v.number()), // Unix timestamp
    authorId: v.string(),
    workspaceId: v.id("workspaces"),
  })
    .index("by_status", ["status"])
    .index("by_workspace", ["workspaceId"]),

  accounts: defineTable({
    name: v.string(),
    platform: v.string(),
    handle: v.string(),
  }),

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
});
