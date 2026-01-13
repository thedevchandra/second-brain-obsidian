import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Create a new note
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    filePath: v.optional(v.string()),
    type: v.union(
      v.literal("daily"),
      v.literal("permanent"),
      v.literal("fleeting"),
      v.literal("literature"),
      v.literal("project"),
      v.literal("meeting")
    ),
    tags: v.array(v.string()),
    sourceUrl: v.optional(v.string()),
    sourceType: v.optional(
      v.union(
        v.literal("obsidian"),
        v.literal("notion"),
        v.literal("email"),
        v.literal("web")
      )
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const noteId = await ctx.db.insert("notes", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    // Update tag usage counts
    for (const tagName of args.tags) {
      const existingTag = await ctx.db
        .query("tags")
        .withIndex("by_name", (q) => q.eq("name", tagName))
        .first();

      if (existingTag) {
        await ctx.db.patch(existingTag._id, {
          usageCount: existingTag.usageCount + 1,
        });
      } else {
        await ctx.db.insert("tags", {
          name: tagName,
          usageCount: 1,
          createdAt: now,
        });
      }
    }

    return noteId;
  },
});

// Update an existing note
export const update = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    filePath: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("daily"),
        v.literal("permanent"),
        v.literal("fleeting"),
        v.literal("literature"),
        v.literal("project"),
        v.literal("meeting")
      )
    ),
    tags: v.optional(v.array(v.string())),
    sourceUrl: v.optional(v.string()),
    sourceType: v.optional(
      v.union(
        v.literal("obsidian"),
        v.literal("notion"),
        v.literal("email"),
        v.literal("web")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Note not found");
    }

    // Handle tag updates
    if (updates.tags) {
      const oldTags = existing.tags;
      const newTags = updates.tags;

      // Decrement old tags
      for (const tagName of oldTags) {
        if (!newTags.includes(tagName)) {
          const tag = await ctx.db
            .query("tags")
            .withIndex("by_name", (q) => q.eq("name", tagName))
            .first();
          if (tag && tag.usageCount > 0) {
            await ctx.db.patch(tag._id, {
              usageCount: tag.usageCount - 1,
            });
          }
        }
      }

      // Increment new tags
      for (const tagName of newTags) {
        if (!oldTags.includes(tagName)) {
          const existingTag = await ctx.db
            .query("tags")
            .withIndex("by_name", (q) => q.eq("name", tagName))
            .first();

          if (existingTag) {
            await ctx.db.patch(existingTag._id, {
              usageCount: existingTag.usageCount + 1,
            });
          } else {
            await ctx.db.insert("tags", {
              name: tagName,
              usageCount: 1,
              createdAt: Date.now(),
            });
          }
        }
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete a note
export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);

    if (!note) {
      throw new Error("Note not found");
    }

    // Decrement tag usage counts
    for (const tagName of note.tags) {
      const tag = await ctx.db
        .query("tags")
        .withIndex("by_name", (q) => q.eq("name", tagName))
        .first();
      if (tag && tag.usageCount > 0) {
        await ctx.db.patch(tag._id, {
          usageCount: tag.usageCount - 1,
        });
      }
    }

    // Delete associated links
    const sourceLinks = await ctx.db
      .query("links")
      .withIndex("by_source", (q) => q.eq("sourceNoteId", args.id))
      .collect();

    const targetLinks = await ctx.db
      .query("links")
      .withIndex("by_target", (q) => q.eq("targetNoteId", args.id))
      .collect();

    for (const link of [...sourceLinks, ...targetLinks]) {
      await ctx.db.delete(link._id);
    }

    await ctx.db.delete(args.id);
    return true;
  },
});

// Get a single note by ID
export const get = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get note by file path
export const getByFilePath = query({
  args: { filePath: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_file_path", (q) => q.eq("filePath", args.filePath))
      .first();
  },
});

// List notes with filtering and pagination
export const list = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("daily"),
        v.literal("permanent"),
        v.literal("fleeting"),
        v.literal("literature"),
        v.literal("project"),
        v.literal("meeting")
      )
    ),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("notes");

    if (args.type) {
      query = query.withIndex("by_type", (q) => q.eq("type", args.type));
    }

    let results = await query.order("desc").collect();

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

// Get recent notes
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("notes")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

// Search notes by title
export const searchByTitle = query({
  args: {
    searchTerm: v.string(),
    type: v.optional(
      v.union(
        v.literal("daily"),
        v.literal("permanent"),
        v.literal("fleeting"),
        v.literal("literature"),
        v.literal("project"),
        v.literal("meeting")
      )
    ),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("notes")
      .withSearchIndex("search_title", (q) =>
        args.type
          ? q.search("title", args.searchTerm).eq("type", args.type)
          : q.search("title", args.searchTerm)
      )
      .take(20);

    return results;
  },
});

// Search notes by content
export const searchByContent = query({
  args: {
    searchTerm: v.string(),
    type: v.optional(
      v.union(
        v.literal("daily"),
        v.literal("permanent"),
        v.literal("fleeting"),
        v.literal("literature"),
        v.literal("project"),
        v.literal("meeting")
      )
    ),
  },
  handler: async (ctx, args) => {
    let searchQuery = ctx.db
      .query("notes")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.searchTerm)
      );

    if (args.type) {
      searchQuery = searchQuery.filter((q) => q.eq(q.field("type"), args.type));
    }

    return await searchQuery.take(20);
  },
});

// Get notes by tag
export const getByTag = query({
  args: {
    tag: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allNotes = await ctx.db.query("notes").collect();

    return allNotes
      .filter((note) => note.tags.includes(args.tag))
      .slice(0, limit);
  },
});

// Get notes with their linked notes
export const getWithLinks = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);

    if (!note) {
      return null;
    }

    // Get outgoing links
    const outgoingLinks = await ctx.db
      .query("links")
      .withIndex("by_source", (q) => q.eq("sourceNoteId", args.id))
      .collect();

    // Get incoming links (backlinks)
    const incomingLinks = await ctx.db
      .query("links")
      .withIndex("by_target", (q) => q.eq("targetNoteId", args.id))
      .collect();

    // Fetch the actual linked notes
    const linkedNotes = await Promise.all(
      outgoingLinks.map(async (link) => ({
        link,
        note: await ctx.db.get(link.targetNoteId),
      }))
    );

    const backlinks = await Promise.all(
      incomingLinks.map(async (link) => ({
        link,
        note: await ctx.db.get(link.sourceNoteId),
      }))
    );

    return {
      note,
      linkedNotes: linkedNotes.filter((ln) => ln.note !== null),
      backlinks: backlinks.filter((bl) => bl.note !== null),
    };
  },
});

// Create a link between notes
export const createLink = mutation({
  args: {
    sourceNoteId: v.id("notes"),
    targetNoteId: v.id("notes"),
    linkType: v.union(
      v.literal("reference"),
      v.literal("related"),
      v.literal("parent"),
      v.literal("child")
    ),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if link already exists
    const existing = await ctx.db
      .query("links")
      .withIndex("by_source", (q) => q.eq("sourceNoteId", args.sourceNoteId))
      .filter((q) => q.eq(q.field("targetNoteId"), args.targetNoteId))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("links", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Delete a link between notes
export const deleteLink = mutation({
  args: { id: v.id("links") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
