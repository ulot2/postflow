import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Return an upload URL to the client
    return await ctx.storage.generateUploadUrl();
  },
});
