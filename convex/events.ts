import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new event
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    attendees: v.optional(v.array(v.string())),
    calendarEventId: v.optional(v.string()),
    meetingNoteId: v.optional(v.id("notes")),
    projectId: v.optional(v.id("projects")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    if (args.endTime <= args.startTime) {
      throw new Error("End time must be after start time");
    }

    return await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      startTime: args.startTime,
      endTime: args.endTime,
      location: args.location,
      attendees: args.attendees ?? [],
      calendarEventId: args.calendarEventId,
      meetingNoteId: args.meetingNoteId,
      projectId: args.projectId,
      tags: args.tags ?? [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update an existing event
export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    location: v.optional(v.string()),
    attendees: v.optional(v.array(v.string())),
    calendarEventId: v.optional(v.string()),
    meetingNoteId: v.optional(v.id("notes")),
    projectId: v.optional(v.id("projects")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Event not found");
    }

    // Validate time if both are being updated or one is being updated
    const newStartTime = updates.startTime ?? existing.startTime;
    const newEndTime = updates.endTime ?? existing.endTime;

    if (newEndTime <= newStartTime) {
      throw new Error("End time must be after start time");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete an event
export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);

    if (!event) {
      throw new Error("Event not found");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});

// Get a single event by ID
export const get = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get event by calendar event ID
export const getByCalendarEventId = query({
  args: { calendarEventId: v.string() },
  handler: async (ctx, args) => {
    const allEvents = await ctx.db.query("events").collect();
    return allEvents.find((e) => e.calendarEventId === args.calendarEventId);
  },
});

// List all events with optional filtering
export const list = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("events")
      .withIndex("by_start_time")
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

// Get events by date range
export const getByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const allEvents = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .order("asc")
      .collect();

    return allEvents.filter(
      (event) =>
        event.startTime >= args.startDate && event.startTime <= args.endDate
    );
  },
});

// Get upcoming events
export const getUpcoming = query({
  args: {
    limit: v.optional(v.number()),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const days = args.days ?? 7;
    const now = Date.now();
    const endDate = now + days * 24 * 60 * 60 * 1000;

    const allEvents = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .order("asc")
      .collect();

    return allEvents
      .filter((event) => event.startTime >= now && event.startTime <= endDate)
      .slice(0, limit);
  },
});

// Get today's events
export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

    const allEvents = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .order("asc")
      .collect();

    return allEvents.filter(
      (event) => event.startTime >= startOfDay && event.startTime < endOfDay
    );
  },
});

// Get past events
export const getPast = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const now = Date.now();

    const allEvents = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .order("desc")
      .collect();

    return allEvents.filter((event) => event.endTime < now).slice(0, limit);
  },
});

// Get events by project
export const getByProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();
  },
});

// Get events with a specific attendee
export const getByAttendee = query({
  args: {
    email: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allEvents = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .order("desc")
      .collect();

    return allEvents
      .filter((event) => event.attendees.includes(args.email))
      .slice(0, limit);
  },
});

// Get events by tag
export const getByTag = query({
  args: {
    tag: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allEvents = await ctx.db.query("events").collect();

    return allEvents
      .filter((event) => event.tags.includes(args.tag))
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit);
  },
});

// Get events with meeting notes
export const getWithMeetingNotes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allEvents = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .order("desc")
      .collect();

    const eventsWithNotes = allEvents.filter((e) => e.meetingNoteId);

    const results = await Promise.all(
      eventsWithNotes.slice(0, limit).map(async (event) => ({
        event,
        note: event.meetingNoteId ? await ctx.db.get(event.meetingNoteId) : null,
      }))
    );

    return results.filter((r) => r.note !== null);
  },
});

// Get event with full details (including related note and project)
export const getWithDetails = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);

    if (!event) {
      return null;
    }

    const note = event.meetingNoteId
      ? await ctx.db.get(event.meetingNoteId)
      : null;
    const project = event.projectId ? await ctx.db.get(event.projectId) : null;

    return {
      event,
      note,
      project,
    };
  },
});

// Get current/ongoing events (happening right now)
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const allEvents = await ctx.db.query("events").collect();

    return allEvents.filter(
      (event) => event.startTime <= now && event.endTime >= now
    );
  },
});

// Get events this week
export const getThisWeek = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const allEvents = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .order("asc")
      .collect();

    return allEvents.filter(
      (event) =>
        event.startTime >= startOfWeek.getTime() &&
        event.startTime < endOfWeek.getTime()
    );
  },
});

// Get event statistics
export const getStats = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const now = Date.now();
    const startDate = now - days * 24 * 60 * 60 * 1000;

    const allEvents = await ctx.db.query("events").collect();
    const recentEvents = allEvents.filter((e) => e.startTime >= startDate);

    const withNotes = recentEvents.filter((e) => e.meetingNoteId).length;
    const withProjects = recentEvents.filter((e) => e.projectId).length;
    const upcoming = recentEvents.filter((e) => e.startTime > now).length;
    const past = recentEvents.filter((e) => e.endTime < now).length;

    return {
      total: allEvents.length,
      recentCount: recentEvents.length,
      withNotes,
      withProjects,
      upcoming,
      past,
      period: `Last ${days} days`,
    };
  },
});

// Link event to a meeting note
export const linkMeetingNote = mutation({
  args: {
    eventId: v.id("events"),
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new Error("Note not found");
    }

    await ctx.db.patch(args.eventId, {
      meetingNoteId: args.noteId,
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Link event to a project
export const linkProject = mutation({
  args: {
    eventId: v.id("events"),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(args.eventId, {
      projectId: args.projectId,
      updatedAt: Date.now(),
    });

    return true;
  },
});
