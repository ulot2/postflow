import { mutation } from "./_generated/server";

export const populate = mutation({
  handler: async (ctx) => {
    const today = new Date();
    today.setHours(12, 0, 0, 0); // Noon today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await ctx.db.insert("posts", {
      content:
        "Excited to launch our new Content Planner! #SaaS #BuildInPublic",
      platform: "twitter",
      status: "scheduled",
      scheduledDate: today.getTime(),
      authorId: "user-1",
    });

    await ctx.db.insert("posts", {
      content:
        "Just published a new article on modern UI design with Shadcn and Tailwind.",
      platform: "linkedin",
      status: "scheduled",
      scheduledDate: tomorrow.getTime(),
      authorId: "user-1",
    });

    return "Seeded 2 mock posts!";
  },
});
