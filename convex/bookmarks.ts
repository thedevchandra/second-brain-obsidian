import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new bookmark
export const create = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    noteId: v.optional(v.id("notes")),
    favicon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if URL already exists
    const existing = await ctx.db
      .query("bookmarks")
      .collect()
      .then((bookmarks) => bookmarks.find((b) => b.url === args.url));

    if (existing) {
      throw new Error("Bookmark with this URL already exists");
    }

    return await ctx.db.insert("bookmarks", {
      title: args.title,
      url: args.url,
      description: args.description,
      tags: args.tags ?? [],
      category: args.category,
      noteId: args.noteId,
      favicon: args.favicon,
      savedAt: now,
    });
  },
});

// Update an existing bookmark
export const update = mutation({
  args: {
    id: v.id("bookmarks"),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    noteId: v.optional(v.id("notes")),
    favicon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Bookmark not found");
    }

    // Check if URL is being changed and if it conflicts
    if (updates.url && updates.url !== existing.url) {
      const urlExists = await ctx.db
        .query("bookmarks")
        .collect()
        .then((bookmarks) => bookmarks.find((b) => b.url === updates.url));

      if (urlExists) {
        throw new Error("Another bookmark with this URL already exists");
      }
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a bookmark
export const deleteBookmark = mutation({
  args: { id: v.id("bookmarks") },
  handler: async (ctx, args) => {
    const bookmark = await ctx.db.get(args.id);

    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});

// Mark bookmark as accessed (updates lastAccessedAt)
export const markAccessed = mutation({
  args: { id: v.id("bookmarks") },
  handler: async (ctx, args) => {
    const bookmark = await ctx.db.get(args.id);

    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    await ctx.db.patch(args.id, {
      lastAccessedAt: Date.now(),
    });

    return true;
  },
});

// Get a single bookmark by ID
export const get = query({
  args: { id: v.id("bookmarks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get bookmark by URL
export const getByUrl = query({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const bookmarks = await ctx.db.query("bookmarks").collect();
    return bookmarks.find((b) => b.url === args.url);
  },
});

// List all bookmarks with optional filtering and pagination
export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("bookmarks")
      .withIndex("by_saved_at")
      .order("desc")
      .collect();

    // Filter by category if provided
    if (args.category) {
      results = results.filter((b) => b.category === args.category);
    }

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

// Get bookmarks by tag
export const getByTag = query({
  args: {
    tag: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allBookmarks = await ctx.db.query("bookmarks").collect();

    return allBookmarks
      .filter((bookmark) => bookmark.tags.includes(args.tag))
      .slice(0, limit);
  },
});

// Get bookmarks by category
export const getByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const allBookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_saved_at")
      .order("desc")
      .collect();

    return allBookmarks.filter((b) => b.category === args.category);
  },
});

// Search bookmarks by title
export const search = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookmarks")
      .withSearchIndex("search_bookmarks", (q) =>
        q.search("title", args.searchTerm)
      )
      .take(20);
  },
});

// Get recent bookmarks
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("bookmarks")
      .withIndex("by_saved_at")
      .order("desc")
      .take(limit);
  },
});

// Get most recently accessed bookmarks
export const getRecentlyAccessed = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const allBookmarks = await ctx.db.query("bookmarks").collect();

    return allBookmarks
      .filter((b) => b.lastAccessedAt !== undefined)
      .sort((a, b) => (b.lastAccessedAt ?? 0) - (a.lastAccessedAt ?? 0))
      .slice(0, limit);
  },
});

// Get all categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const allBookmarks = await ctx.db.query("bookmarks").collect();
    const categories = new Set<string>();

    allBookmarks.forEach((bookmark) => {
      if (bookmark.category) {
        categories.add(bookmark.category);
      }
    });

    return Array.from(categories).sort();
  },
});

// Get all tags used in bookmarks
export const getTags = query({
  args: {},
  handler: async (ctx) => {
    const allBookmarks = await ctx.db.query("bookmarks").collect();
    const tagCounts = new Map<string, number>();

    allBookmarks.forEach((bookmark) => {
      bookmark.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  },
});

// Get bookmark statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allBookmarks = await ctx.db.query("bookmarks").collect();

    const categories = new Set<string>();
    const tags = new Set<string>();
    let withNotes = 0;
    let accessed = 0;

    allBookmarks.forEach((bookmark) => {
      if (bookmark.category) categories.add(bookmark.category);
      bookmark.tags.forEach((tag) => tags.add(tag));
      if (bookmark.noteId) withNotes++;
      if (bookmark.lastAccessedAt) accessed++;
    });

    return {
      total: allBookmarks.length,
      categories: categories.size,
      tags: tags.size,
      withNotes,
      accessed,
      unaccessed: allBookmarks.length - accessed,
    };
  },
});

// Get bookmarks with associated notes
export const getWithNotes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allBookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_saved_at")
      .order("desc")
      .collect();

    const bookmarksWithNotes = allBookmarks.filter((b) => b.noteId);

    const results = await Promise.all(
      bookmarksWithNotes.slice(0, limit).map(async (bookmark) => ({
        bookmark,
        note: bookmark.noteId ? await ctx.db.get(bookmark.noteId) : null,
      }))
    );

    return results.filter((r) => r.note !== null);
  },
});

// Import bookmarks from array (bulk import)
export const bulkImport = mutation({
  args: {
    bookmarks: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
        description: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        category: v.optional(v.string()),
        favicon: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const bookmark of args.bookmarks) {
      try {
        // Check if URL already exists
        const existing = await ctx.db
          .query("bookmarks")
          .collect()
          .then((bookmarks) => bookmarks.find((b) => b.url === bookmark.url));

        if (existing) {
          results.skipped++;
          continue;
        }

        await ctx.db.insert("bookmarks", {
          ...bookmark,
          tags: bookmark.tags ?? [],
          savedAt: now,
        });

        results.imported++;
      } catch (error) {
        results.errors.push(`Failed to import ${bookmark.url}: ${error}`);
      }
    }

    return results;
  },
});
