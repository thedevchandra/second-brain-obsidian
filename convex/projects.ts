import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new project
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("planning"),
        v.literal("active"),
        v.literal("paused"),
        v.literal("completed"),
        v.literal("archived")
      )
    ),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    githubRepo: v.optional(v.string()),
    notionPageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      status: args.status ?? "planning",
      startDate: args.startDate,
      endDate: args.endDate,
      tags: args.tags ?? [],
      githubRepo: args.githubRepo,
      notionPageId: args.notionPageId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update an existing project
export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("planning"),
        v.literal("active"),
        v.literal("paused"),
        v.literal("completed"),
        v.literal("archived")
      )
    ),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    githubRepo: v.optional(v.string()),
    notionPageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    // Note: We don't delete associated tasks, just orphan them
    // You might want to handle this differently based on your needs
    await ctx.db.delete(args.id);
    return true;
  },
});

// Get a single project by ID
export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// List all projects with optional filtering
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("planning"),
        v.literal("active"),
        v.literal("paused"),
        v.literal("completed"),
        v.literal("archived")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("projects");

    if (args.status) {
      query = query.withIndex("by_status", (q) => q.eq("status", args.status));
    }

    let results = await query.order("desc").collect();

    if (args.limit !== undefined) {
      results = results.slice(0, args.limit);
    }

    return results;
  },
});

// Get projects by status
export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("planning"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// Get active projects
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .collect();
  },
});

// Search projects by name
export const search = query({
  args: {
    searchTerm: v.string(),
    status: v.optional(
      v.union(
        v.literal("planning"),
        v.literal("active"),
        v.literal("paused"),
        v.literal("completed"),
        v.literal("archived")
      )
    ),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("projects")
      .withSearchIndex("search_projects", (q) =>
        args.status
          ? q.search("name", args.searchTerm).eq("status", args.status)
          : q.search("name", args.searchTerm)
      )
      .take(20);

    return results;
  },
});

// Get project with all associated data (tasks, events, notes)
export const getWithDetails = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      return null;
    }

    // Get all tasks for this project
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .collect();

    // Get all events for this project
    const events = await ctx.db
      .query("events")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .collect();

    // Get notes tagged with this project (assuming project name is used as tag)
    // This is a simple approach - you might want a more sophisticated linking mechanism
    const allNotes = await ctx.db.query("notes").collect();
    const relatedNotes = allNotes.filter((note) =>
      note.tags.some((tag) => tag.toLowerCase().includes(project.name.toLowerCase()))
    );

    // Calculate task stats
    const taskStats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter(
        (t) => t.dueDate && t.dueDate < Date.now() && t.status !== "done"
      ).length,
    };

    return {
      project,
      tasks,
      events,
      notes: relatedNotes.slice(0, 10), // Limit to 10 most recent
      stats: taskStats,
    };
  },
});

// Get project statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allProjects = await ctx.db.query("projects").collect();

    return {
      total: allProjects.length,
      planning: allProjects.filter((p) => p.status === "planning").length,
      active: allProjects.filter((p) => p.status === "active").length,
      paused: allProjects.filter((p) => p.status === "paused").length,
      completed: allProjects.filter((p) => p.status === "completed").length,
      archived: allProjects.filter((p) => p.status === "archived").length,
    };
  },
});

// Archive a project
export const archive = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(args.id, {
      status: "archived",
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Complete a project
export const complete = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(args.id, {
      status: "completed",
      endDate: Date.now(),
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Start a project (move from planning to active)
export const start = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    const updates: any = {
      status: "active" as const,
      updatedAt: Date.now(),
    };

    // Set start date if not already set
    if (!project.startDate) {
      updates.startDate = Date.now();
    }

    await ctx.db.patch(args.id, updates);

    return true;
  },
});

// Pause a project
export const pause = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(args.id, {
      status: "paused",
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Resume a paused project
export const resume = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.status !== "paused") {
      throw new Error("Can only resume paused projects");
    }

    await ctx.db.patch(args.id, {
      status: "active",
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Get projects by tag
export const getByTag = query({
  args: {
    tag: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allProjects = await ctx.db.query("projects").collect();

    return allProjects
      .filter((project) => project.tags.includes(args.tag))
      .slice(0, limit);
  },
});
