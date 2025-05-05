import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  Users: defineTable({
    Email: v.string(),
    Password: v.string(),
    CMS: v.number(),         // Required field
    Department: v.string(),  // Required field
    Access: v.array(v.string()),      // Required field
    Name: v.string(),        // Required field
  }).index("by_email", ["Email"]), // Create an index on the Email field

  AccessLogs: defineTable({
    userId: v.id("Users"),
    name: v.string(),
    email: v.string(),
    location: v.string(),
    timestamp: v.string(), // ISO format from new Date().toISOString()
    status: v.string(),    // e.g. "Entry Granted" or "Access Denied"
  }).index("by_user", ["userId"]),
});
