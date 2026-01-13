import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new person/contact
export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    lastContactDate: v.optional(v.number()),
    contactFrequency: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        linkedin: v.optional(v.string()),
        twitter: v.optional(v.string()),
        github: v.optional(v.string()),
      })
    ),
    source: v.optional(
      v.union(
        v.literal("gmail"),
        v.literal("contacts"),
        v.literal("linkedin"),
        v.literal("manual")
      )
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if person with same email already exists
    if (args.email) {
      const existing = await ctx.db
        .query("people")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existing) {
        throw new Error("Person with this email already exists");
      }
    }

    return await ctx.db.insert("people", {
      name: args.name,
      email: args.email,
      company: args.company,
      role: args.role,
      notes: args.notes,
      tags: args.tags ?? [],
      lastContactDate: args.lastContactDate ?? now,
      contactFrequency: args.contactFrequency,
      socialLinks: args.socialLinks,
      source: args.source ?? "manual",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update an existing person
export const update = mutation({
  args: {
    id: v.id("people"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    lastContactDate: v.optional(v.number()),
    contactFrequency: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        linkedin: v.optional(v.string()),
        twitter: v.optional(v.string()),
        github: v.optional(v.string()),
      })
    ),
    source: v.optional(
      v.union(
        v.literal("gmail"),
        v.literal("contacts"),
        v.literal("linkedin"),
        v.literal("manual")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Person not found");
    }

    // Check if email is being changed and if it conflicts with another person
    if (updates.email && updates.email !== existing.email) {
      const emailExists = await ctx.db
        .query("people")
        .withIndex("by_email", (q) => q.eq("email", updates.email))
        .first();

      if (emailExists) {
        throw new Error("Another person with this email already exists");
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete a person
export const deletePerson = mutation({
  args: { id: v.id("people") },
  handler: async (ctx, args) => {
    const person = await ctx.db.get(args.id);

    if (!person) {
      throw new Error("Person not found");
    }

    // Note: We don't delete interactions, they remain as historical record
    await ctx.db.delete(args.id);
    return true;
  },
});

// Get a single person by ID
export const get = query({
  args: { id: v.id("people") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get person by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("people")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// List all people with optional filtering
export const list = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db.query("people").order("desc").collect();

    // Apply pagination
    if (args.offset !== undefined) {
      results = results.slice(args.offset);
    }
    if (args.limit !== undefined) {
      results = results.slice(0, args.limit);
    }

    return results;
  },
});

// Search people by name
export const search = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("people")
      .withSearchIndex("search_people", (q) => q.search("name", args.searchTerm))
      .take(20);
  },
});

// Get person with all interactions
export const getWithInteractions = query({
  args: { id: v.id("people") },
  handler: async (ctx, args) => {
    const person = await ctx.db.get(args.id);

    if (!person) {
      return null;
    }

    // Get all interactions with this person
    const interactions = await ctx.db
      .query("interactions")
      .withIndex("by_person", (q) => q.eq("personId", args.id))
      .order("desc")
      .collect();

    // Get interaction stats
    const interactionStats = {
      total: interactions.length,
      emails: interactions.filter((i) => i.type === "email").length,
      meetings: interactions.filter((i) => i.type === "meeting").length,
      calls: interactions.filter((i) => i.type === "call").length,
      messages: interactions.filter((i) => i.type === "message").length,
    };

    return {
      person,
      interactions,
      stats: interactionStats,
    };
  },
});

// Get people who need follow-up (haven't contacted recently)
export const getNeedingFollowUp = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;

    const allPeople = await ctx.db.query("people").collect();

    return allPeople
      .filter(
        (person) =>
          person.lastContactDate !== undefined && person.lastContactDate < threshold
      )
      .sort((a, b) => (a.lastContactDate ?? 0) - (b.lastContactDate ?? 0));
  },
});

// Get people by company
export const getByCompany = query({
  args: {
    company: v.string(),
  },
  handler: async (ctx, args) => {
    const allPeople = await ctx.db.query("people").collect();

    return allPeople.filter(
      (person) =>
        person.company &&
        person.company.toLowerCase().includes(args.company.toLowerCase())
    );
  },
});

// Get people by tag
export const getByTag = query({
  args: {
    tag: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allPeople = await ctx.db.query("people").collect();

    return allPeople
      .filter((person) => person.tags.includes(args.tag))
      .slice(0, limit);
  },
});

// Record an interaction with a person
export const recordInteraction = mutation({
  args: {
    personId: v.id("people"),
    type: v.union(
      v.literal("email"),
      v.literal("meeting"),
      v.literal("call"),
      v.literal("message")
    ),
    subject: v.optional(v.string()),
    summary: v.optional(v.string()),
    date: v.optional(v.number()),
    noteId: v.optional(v.id("notes")),
    eventId: v.optional(v.string()),
    emailId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const person = await ctx.db.get(args.personId);

    if (!person) {
      throw new Error("Person not found");
    }

    const now = Date.now();
    const interactionDate = args.date ?? now;

    // Create the interaction
    const interactionId = await ctx.db.insert("interactions", {
      personId: args.personId,
      type: args.type,
      subject: args.subject,
      summary: args.summary,
      date: interactionDate,
      noteId: args.noteId,
      eventId: args.eventId,
      emailId: args.emailId,
      createdAt: now,
    });

    // Update person's last contact date
    await ctx.db.patch(args.personId, {
      lastContactDate: interactionDate,
      updatedAt: now,
    });

    return interactionId;
  },
});

// Get recent interactions across all people
export const getRecentInteractions = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(
      v.union(
        v.literal("email"),
        v.literal("meeting"),
        v.literal("call"),
        v.literal("message")
      )
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    let query = ctx.db.query("interactions");

    if (args.type) {
      query = query.withIndex("by_type", (q) => q.eq("type", args.type));
    }

    const interactions = await query.order("desc").take(limit);

    // Enrich with person data
    return await Promise.all(
      interactions.map(async (interaction) => ({
        interaction,
        person: await ctx.db.get(interaction.personId),
      }))
    );
  },
});

// Get interaction statistics
export const getInteractionStats = query({
  args: {
    personId: v.optional(v.id("people")),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    let interactions;

    if (args.personId) {
      interactions = await ctx.db
        .query("interactions")
        .withIndex("by_person", (q) => q.eq("personId", args.personId))
        .collect();
    } else {
      interactions = await ctx.db.query("interactions").collect();
    }

    // Filter by date range
    const recentInteractions = interactions.filter((i) => i.date >= startDate);

    return {
      total: recentInteractions.length,
      emails: recentInteractions.filter((i) => i.type === "email").length,
      meetings: recentInteractions.filter((i) => i.type === "meeting").length,
      calls: recentInteractions.filter((i) => i.type === "call").length,
      messages: recentInteractions.filter((i) => i.type === "message").length,
      period: `Last ${days} days`,
    };
  },
});

// Get people statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allPeople = await ctx.db.query("people").collect();

    return {
      total: allPeople.length,
      withEmail: allPeople.filter((p) => p.email).length,
      withCompany: allPeople.filter((p) => p.company).length,
      fromGmail: allPeople.filter((p) => p.source === "gmail").length,
      fromContacts: allPeople.filter((p) => p.source === "contacts").length,
      fromLinkedIn: allPeople.filter((p) => p.source === "linkedin").length,
      manual: allPeople.filter((p) => p.source === "manual").length,
    };
  },
});

// Update last contact date
export const updateLastContact = mutation({
  args: {
    id: v.id("people"),
    date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const person = await ctx.db.get(args.id);

    if (!person) {
      throw new Error("Person not found");
    }

    await ctx.db.patch(args.id, {
      lastContactDate: args.date ?? Date.now(),
      updatedAt: Date.now(),
    });

    return true;
  },
});
