// convex/userQueries.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Users")
      .withIndex("by_email", (q) => q.eq("Email", args.email))
      .first();
  },
});
