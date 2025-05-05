// convex/logAccess.js
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const logAccess = mutation({
  args: {
    userId: v.id("Users"),
    name: v.string(),
    email: v.string(),
    location: v.string(),
    timestamp: v.string(),
    status: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("AccessLogs", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      location: args.location,
      timestamp: args.timestamp,
      status: args.status,
    });
  }
});
 