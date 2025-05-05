import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserById = query({
  args: { id: v.id("Users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    return user;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Use the by_email index to efficiently query
    const user = await ctx.db
      .query("Users")        // Table name is case-sensitive (make sure it's "User")
      .withIndex("by_email", (q) => q.eq("Email", args.email))
      .unique();            // Since email should be unique

    return user;
  },

  
});