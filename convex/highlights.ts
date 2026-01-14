import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new highlight
export const create = mutation({
  args: {
    content: v.string(),
    source: v.string(),
    sourceUrl: v.optional(v.string()),
    author: v.optional(v.string()),
    noteId: v.optional(v.id("notes")),
    tags: v.optional(v.array(v.string())),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("highlights", {
      content: args.content,
      source: args.source,
      sourceUrl: args.sourceUrl,
      author: args.author,
      noteId: args.noteId,
      tags: args.tags ?? [],
      color: args.color,
      createdAt: now,
    });
  },
});

// Update an existing highlight
export const update = mutation({
  args: {
    id: v.id("highlights"),
    content: v.optional(v.string()),
    source: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    author: v.optional(v.string()),
    noteId: v.optional(v.id("notes")),
    tags: v.optional(v.array(v.string())),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Highlight not found");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a highlight
export const deleteHighlight = mutation({
  args: { id: v.id("highlights") },
  handler: async (ctx, args) => {
    const highlight = await ctx.db.get(args.id);

    if (!highlight) {
      throw new Error("Highlight not found");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});

// Get a single highlight by ID
export const get = query({
  args: { id: v.id("highlights") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// List all highlights with optional filtering and pagination
export const list = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("highlights")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

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

// Get recent highlights
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("highlights")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

// Get highlights by source
export const getBySource = query({
  args: {
    source: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("highlights")
      .withIndex("by_source", (q) => q.eq("source", args.source))
      .order("desc")
      .collect();
  },
});

// Get highlights by author
export const getByAuthor = query({
  args: {
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const allHighlights = await ctx.db.query("highlights").collect();

    return allHighlights
      .filter((h) => h.author === args.author)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get highlights by tag
export const getByTag = query({
  args: {
    tag: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allHighlights = await ctx.db.query("highlights").collect();

    return allHighlights
      .filter((highlight) => highlight.tags.includes(args.tag))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },
});

// Get highlights by color
export const getByColor = query({
  args: {
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const allHighlights = await ctx.db.query("highlights").collect();

    return allHighlights
      .filter((h) => h.color === args.color)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Search highlights by content
export const search = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("highlights")
      .withSearchIndex("search_highlights", (q) =>
        q.search("content", args.searchTerm)
      )
      .take(20);
  },
});

// Get highlights with associated notes
export const getWithNotes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allHighlights = await ctx.db
      .query("highlights")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    const highlightsWithNotes = allHighlights.filter((h) => h.noteId);

    const results = await Promise.all(
      highlightsWithNotes.slice(0, limit).map(async (highlight) => ({
        highlight,
        note: highlight.noteId ? await ctx.db.get(highlight.noteId) : null,
      }))
    );

    return results.filter((r) => r.note !== null);
  },
});

// Get all unique sources
export const getSources = query({
  args: {},
  handler: async (ctx) => {
    const allHighlights = await ctx.db.query("highlights").collect();
    const sourceCounts = new Map<string, number>();

    allHighlights.forEach((highlight) => {
      sourceCounts.set(
        highlight.source,
        (sourceCounts.get(highlight.source) ?? 0) + 1
      );
    });

    return Array.from(sourceCounts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  },
});

// Get all unique authors
export const getAuthors = query({
  args: {},
  handler: async (ctx) => {
    const allHighlights = await ctx.db.query("highlights").collect();
    const authorCounts = new Map<string, number>();

    allHighlights.forEach((highlight) => {
      if (highlight.author) {
        authorCounts.set(
          highlight.author,
          (authorCounts.get(highlight.author) ?? 0) + 1
        );
      }
    });

    return Array.from(authorCounts.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count);
  },
});

// Get all tags used in highlights
export const getTags = query({
  args: {},
  handler: async (ctx) => {
    const allHighlights = await ctx.db.query("highlights").collect();
    const tagCounts = new Map<string, number>();

    allHighlights.forEach((highlight) => {
      highlight.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  },
});

// Get highlight statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allHighlights = await ctx.db.query("highlights").collect();

    const sources = new Set<string>();
    const authors = new Set<string>();
    const tags = new Set<string>();
    const colors = new Set<string>();
    let withNotes = 0;

    allHighlights.forEach((highlight) => {
      sources.add(highlight.source);
      if (highlight.author) authors.add(highlight.author);
      highlight.tags.forEach((tag) => tags.add(tag));
      if (highlight.color) colors.add(highlight.color);
      if (highlight.noteId) withNotes++;
    });

    return {
      total: allHighlights.length,
      sources: sources.size,
      authors: authors.size,
      tags: tags.size,
      colors: colors.size,
      withNotes,
      withoutNotes: allHighlights.length - withNotes,
    };
  },
});

// Get random highlight (for inspiration/review)
export const getRandom = query({
  args: {
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count ?? 1;
    const allHighlights = await ctx.db.query("highlights").collect();

    if (allHighlights.length === 0) {
      return [];
    }

    // Simple random selection (not cryptographically secure, but fine for this use case)
    const shuffled = [...allHighlights].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, allHighlights.length));
  },
});

// Bulk import highlights
export const bulkImport = mutation({
  args: {
    highlights: v.array(
      v.object({
        content: v.string(),
        source: v.string(),
        sourceUrl: v.optional(v.string()),
        author: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        color: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = {
      imported: 0,
      errors: [] as string[],
    };

    for (const highlight of args.highlights) {
      try {
        await ctx.db.insert("highlights", {
          ...highlight,
          tags: highlight.tags ?? [],
          createdAt: now,
        });

        results.imported++;
      } catch (error) {
        results.errors.push(
          `Failed to import highlight from ${highlight.source}: ${error}`
        );
      }
    }

    return results;
  },
});
