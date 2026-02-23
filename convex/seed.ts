import { mutation } from "./_generated/server";

// The seed function is deprecated — posts now require a workspaceId.
// Use the app's Create Post flow to add posts instead.
export const populate = mutation({
  handler: async (ctx) => {
    // Clear any old posts that don't have a workspaceId
    const oldPosts = await ctx.db.query("posts").collect();
    let deleted = 0;
    for (const post of oldPosts) {
      if (!post.workspaceId) {
        await ctx.db.delete(post._id);
        deleted++;
      }
    }
    return `Cleaned up ${deleted} legacy posts without workspaceId.`;
  },
});
