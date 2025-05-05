import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import bcrypt from "bcryptjs";

const saltRounds = 10;

async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, saltRounds);
}

export const checkEmail = action({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    console.log("Running checkEmail as action...");

    const existingUser = await ctx.runQuery(api.userQueries.getUserByEmail, {
      email: args.email,
    });

    if (existingUser) {
      return { success: true, message: "Email found in db" };
    } else {
      return { success: false, message: "Email not found in db" };
    }
  },
});

export const sendMessage = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Running sendMessage as action...");

    const existingUser = await ctx.runQuery(api.userQueries.getUserByEmail, {
      email: args.email,
    });

    if (!existingUser) {
      throw new Error("User not found. Unable to update password.");
    }

    const hashedPassword = await hashPassword(args.password);

    await ctx.runMutation(api.userMutation.updateUserPassword, {
      userId: existingUser._id,
      hashedPassword,
    });

    console.log("Password updated successfully.");
  },
});
