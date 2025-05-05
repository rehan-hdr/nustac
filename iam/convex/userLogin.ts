// convex/userLogin.ts (Convex Server)
import { mutation } from "./_generated/server";
import { v } from "convex/values";
// import bcrypt from "bcryptjs"; // Ensure you have bcrypt for password comparison

export const userLogin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    // Find user by email
    const user = await ctx.db
      .query("Users")
      .withIndex("by_email", (q) => q.eq("Email", email))
      .first();

    // If no user found, return an error
    if (!user) {
      throw new Error("User not found in database.");
    }

    // Compare the provided password with the stored password (hashed)
    // const passwordMatches = await bcrypt.compare(password, user.Password);
    const passwordMatches = password === user.Password; // For simplicity, using plain text comparison
    
    // If the password doesn't match, throw an error
    if (!passwordMatches) {
        console.log("Password Incorrect");
      return { success: false };
    }

    // Return success if login is successful
    return { success: true };
  },
});
