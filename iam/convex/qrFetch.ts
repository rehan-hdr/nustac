// convex/userLogin.ts (Convex Server)
// convex/userFetch.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserData = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("Users")
      .withIndex("by_email", (q) => q.eq("Email", email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const payload = {
      Name: user.Name,
      Department: user.Department,
      CMS: user.CMS,
      Password: user.Password,
      Timestamp: Date.now(),  // current timestamp
    }

    return payload;
  },
});


    


    