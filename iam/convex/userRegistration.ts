import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("This TypeScript function is running on the server.");

    // Use the withIndex() method to filter by email using the defined index
    const existingUser = await ctx.db
      .query("Users")
      .withIndex("by_email", (q) => q.eq("Email", args.email))
      .first();
    
    if (existingUser) {
       // If the user exists, update only their password
       await ctx.db.patch(existingUser._id, { Password: args.password });
       console.log("Password updated successfully.");
    } else {
      // If the user doesn't exist, return an error or do nothing
      throw new Error("User not found. Unable to update password.");
    }
  },
});
