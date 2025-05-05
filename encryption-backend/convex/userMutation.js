// convex/userMutations.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateUserPassword = mutation({
  args: {
    userId: v.id("Users"),
    hashedPassword: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { Password: args.hashedPassword });
  },
});
