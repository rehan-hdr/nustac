// convex/userLogin.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import bcrypt from "bcryptjs";

export const userLogin = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    console.log("Running userLogin action...");

    // Use runQuery to fetch user
    const user = await ctx.runQuery(api.userQueries.getUserByEmail, {
      email,
    });

    if (!user) {
      throw new Error("User not found in database.");
    }

    // Compare hashed password
    const passwordMatches = await bcrypt.compare(password, user.Password);

    if (!passwordMatches) {
      console.log("Password Incorrect");
      return { success: false };
    }

    return { success: true };
  },
});
