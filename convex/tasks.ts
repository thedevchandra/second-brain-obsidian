import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done"),
        v.literal("cancelled")
      )
    ),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    dueDate: v.optional(v.number()),
    projectId: v.optional(v.id("projects")),
    noteId: v.optional(v.id("notes")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: args.status ?? "todo",
      priority: args.priority ?? "medium",
      dueDate: args.dueDate,
      projectId: args.projectId,
      noteId: args.noteId,
      tags: args.tags ?? [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update an existing task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done"),
        v.literal("cancelled")
      )
    ),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    dueDate: v.optional(v.number()),
    projectId: v.optional(v.id("projects")),
    noteId: v.optional(v.id("notes")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Task not found");
    }

    // If marking as done, set completedAt
    if (updates.status === "done" && existing.status !== "done") {
      await ctx.db.patch(id, {
        ...updates,
        completedAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else if (updates.status && updates.status !== "done" && existing.completedAt) {
      // If changing from done to something else, remove completedAt
      await ctx.db.patch(id, {
        ...updates,
        completedAt: undefined,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(id, {
        ...updates,
        updatedAt: Date.now(),
      });
    }

    return id;
  },
});

// Delete a task
export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);

    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});

// Get a single task by ID
export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// List all tasks with optional filtering
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done"),
        v.literal("cancelled")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("tasks");

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

// Get tasks by status
export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// Get tasks by project
export const getByProject = query({
  args: {
    projectId: v.id("projects"),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    if (args.status) {
      results = results.filter((task) => task.status === args.status);
    }

    return results;
  },
});

// Get tasks by note
export const getByNote = query({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_note", (q) => q.eq("noteId", args.noteId))
      .collect();
  },
});

// Get tasks due soon
export const getDueSoon = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 7;
    const now = Date.now();
    const dueThreshold = now + days * 24 * 60 * 60 * 1000;

    const allTasks = await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", "todo"))
      .collect();

    return allTasks
      .filter(
        (task) =>
          task.dueDate !== undefined &&
          task.dueDate >= now &&
          task.dueDate <= dueThreshold
      )
      .sort((a, b) => (a.dueDate! - b.dueDate!));
  },
});

// Get overdue tasks
export const getOverdue = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const allTasks = await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", "todo"))
      .collect();

    return allTasks
      .filter((task) => task.dueDate !== undefined && task.dueDate < now)
      .sort((a, b) => (a.dueDate! - b.dueDate!));
  },
});

// Get tasks by priority
export const getByPriority = query({
  args: {
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const allTasks = await ctx.db.query("tasks").collect();

    let results = allTasks.filter((task) => task.priority === args.priority);

    if (args.status) {
      results = results.filter((task) => task.status === args.status);
    }

    return results;
  },
});

// Get today's tasks
export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

    const allTasks = await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", "todo"))
      .collect();

    return allTasks
      .filter(
        (task) =>
          task.dueDate !== undefined &&
          task.dueDate >= startOfDay &&
          task.dueDate < endOfDay
      )
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        // Then by due date
        return (a.dueDate ?? 0) - (b.dueDate ?? 0);
      });
  },
});

// Complete a task
export const complete = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);

    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.patch(args.id, {
      status: "done",
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Reopen a completed task
export const reopen = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);

    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.patch(args.id, {
      status: "todo",
      completedAt: undefined,
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Get task statistics
export const getStats = query({
  args: {
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("tasks");

    if (args.projectId) {
      const tasks = await query
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect();

      return {
        total: tasks.length,
        todo: tasks.filter((t) => t.status === "todo").length,
        inProgress: tasks.filter((t) => t.status === "in_progress").length,
        done: tasks.filter((t) => t.status === "done").length,
        cancelled: tasks.filter((t) => t.status === "cancelled").length,
        overdue: tasks.filter(
          (t) => t.dueDate && t.dueDate < Date.now() && t.status !== "done"
        ).length,
      };
    }

    const allTasks = await query.collect();

    return {
      total: allTasks.length,
      todo: allTasks.filter((t) => t.status === "todo").length,
      inProgress: allTasks.filter((t) => t.status === "in_progress").length,
      done: allTasks.filter((t) => t.status === "done").length,
      cancelled: allTasks.filter((t) => t.status === "cancelled").length,
      overdue: allTasks.filter(
        (t) => t.dueDate && t.dueDate < Date.now() && t.status !== "done"
      ).length,
    };
  },
});
