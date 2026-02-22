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
    authorId: v.string(), // We will mock this for now
  }).index("by_status", ["status"]),

  accounts: defineTable({
    name: v.string(),
    platform: v.string(),
    handle: v.string(),
  }),
});
