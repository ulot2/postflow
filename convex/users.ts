import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    return user;
  },
});

export const completeOnboarding = mutation({
  args: {
    type: v.union(v.literal("personal"), v.literal("company")),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    brandLogoId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      // If we don't have a user record for this identity, create it.
      const userId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email!,
        firstName: identity.givenName,
        lastName: identity.familyName,
        hasCompletedOnboarding: true,
      });
      user = await ctx.db.get(userId);
    } else {
      // Update existing user record
      await ctx.db.patch(user._id, {
        hasCompletedOnboarding: true,
      });
    }

    // Create the workspace
    if (!user) throw new Error("User not found after insert or update");

    let logoUrl: string | undefined;
    if (args.brandLogoId) {
      const url = await ctx.storage.getUrl(args.brandLogoId);
      if (url) logoUrl = url;
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      name:
        args.type === "personal"
          ? identity.givenName && identity.familyName
            ? `${identity.givenName} ${identity.familyName}`
            : (identity.givenName ?? identity.email!.split("@")[0])
          : args.name!,
      description: args.description,
      type: args.type,
      userId: user._id,
      brandLogoId: args.brandLogoId,
      brandLogoUrl: logoUrl,
    });

    return workspaceId;
  },
});

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (
        user.firstName !== identity.givenName ||
        user.lastName !== identity.familyName
      ) {
        await ctx.db.patch(user._id, {
          firstName: identity.givenName,
          lastName: identity.familyName,
        });
      }
      return user._id;
    }

    // If it's a new identity, create a new User.
    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email!,
      firstName: identity.givenName,
      lastName: identity.familyName,
      hasCompletedOnboarding: false,
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
