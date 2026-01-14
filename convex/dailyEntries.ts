import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new daily entry
export const create = mutation({
  args: {
    date: v.number(),
    mood: v.optional(
      v.union(
        v.literal("great"),
        v.literal("good"),
        v.literal("okay"),
        v.literal("bad"),
        v.literal("terrible")
      )
    ),
    energy: v.optional(v.number()),
    productivity: v.optional(v.number()),
    reflection: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    wins: v.optional(v.array(v.string())),
    challenges: v.optional(v.array(v.string())),
    noteId: v.optional(v.id("notes")),
    ouraMetrics: v.optional(
      v.object({
        readiness: v.optional(v.number()),
        sleep: v.optional(v.number()),
        activity: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Normalize date to start of day
    const date = new Date(args.date);
    date.setHours(0, 0, 0, 0);
    const normalizedDate = date.getTime();

    // Check if entry for this date already exists
    const existing = await ctx.db
      .query("dailyEntries")
      .withIndex("by_date", (q) => q.eq("date", normalizedDate))
      .first();

    if (existing) {
      throw new Error("Entry for this date already exists. Use update instead.");
    }

    return await ctx.db.insert("dailyEntries", {
      date: normalizedDate,
      mood: args.mood,
      energy: args.energy,
      productivity: args.productivity,
      reflection: args.reflection,
      gratitude: args.gratitude,
      wins: args.wins,
      challenges: args.challenges,
      noteId: args.noteId,
      ouraMetrics: args.ouraMetrics,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update an existing daily entry
export const update = mutation({
  args: {
    id: v.id("dailyEntries"),
    mood: v.optional(
      v.union(
        v.literal("great"),
        v.literal("good"),
        v.literal("okay"),
        v.literal("bad"),
        v.literal("terrible")
      )
    ),
    energy: v.optional(v.number()),
    productivity: v.optional(v.number()),
    reflection: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    wins: v.optional(v.array(v.string())),
    challenges: v.optional(v.array(v.string())),
    noteId: v.optional(v.id("notes")),
    ouraMetrics: v.optional(
      v.object({
        readiness: v.optional(v.number()),
        sleep: v.optional(v.number()),
        activity: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Daily entry not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete a daily entry
export const deleteEntry = mutation({
  args: { id: v.id("dailyEntries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);

    if (!entry) {
      throw new Error("Daily entry not found");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});

// Get a single daily entry by ID
export const get = query({
  args: { id: v.id("dailyEntries") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get daily entry by date
export const getByDate = query({
  args: { date: v.number() },
  handler: async (ctx, args) => {
    // Normalize date to start of day
    const date = new Date(args.date);
    date.setHours(0, 0, 0, 0);
    const normalizedDate = date.getTime();

    return await ctx.db
      .query("dailyEntries")
      .withIndex("by_date", (q) => q.eq("date", normalizedDate))
      .first();
  },
});

// Get today's entry
export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    return await ctx.db
      .query("dailyEntries")
      .withIndex("by_date", (q) => q.eq("date", todayTimestamp))
      .first();
  },
});

// Get recent daily entries
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 7;
    return await ctx.db
      .query("dailyEntries")
      .withIndex("by_date")
      .order("desc")
      .take(limit);
  },
});

// Get entries by date range
export const getByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    // Normalize dates
    const start = new Date(args.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(args.endDate);
    end.setHours(23, 59, 59, 999);

    const allEntries = await ctx.db
      .query("dailyEntries")
      .withIndex("by_date")
      .order("asc")
      .collect();

    return allEntries.filter(
      (entry) => entry.date >= start.getTime() && entry.date <= end.getTime()
    );
  },
});

// Get this week's entries
export const getThisWeek = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const allEntries = await ctx.db
      .query("dailyEntries")
      .withIndex("by_date")
      .order("asc")
      .collect();

    return allEntries.filter(
      (entry) =>
        entry.date >= startOfWeek.getTime() && entry.date < endOfWeek.getTime()
    );
  },
});

// Get this month's entries
export const getThisMonth = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const allEntries = await ctx.db
      .query("dailyEntries")
      .withIndex("by_date")
      .order("asc")
      .collect();

    return allEntries.filter(
      (entry) =>
        entry.date >= startOfMonth.getTime() &&
        entry.date <= endOfMonth.getTime()
    );
  },
});

// Get entries by mood
export const getByMood = query({
  args: {
    mood: v.union(
      v.literal("great"),
      v.literal("good"),
      v.literal("okay"),
      v.literal("bad"),
      v.literal("terrible")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const allEntries = await ctx.db
      .query("dailyEntries")
      .withIndex("by_date")
      .order("desc")
      .collect();

    return allEntries.filter((entry) => entry.mood === args.mood).slice(0, limit);
  },
});

// Get entries with low energy
export const getLowEnergyDays = query({
  args: {
    threshold: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const threshold = args.threshold ?? 5;
    const limit = args.limit ?? 20;

    const allEntries = await ctx.db
      .query("dailyEntries")
      .withIndex("by_date")
      .order("desc")
      .collect();

    return allEntries
      .filter((entry) => entry.energy !== undefined && entry.energy <= threshold)
      .slice(0, limit);
  },
});

// Get entries with high productivity
export const getHighProductivityDays = query({
  args: {
    threshold: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const threshold = args.threshold ?? 7;
    const limit = args.limit ?? 20;

    const allEntries = await ctx.db
      .query("dailyEntries")
      .withIndex("by_date")
      .order("desc")
      .collect();

    return allEntries
      .filter(
        (entry) =>
          entry.productivity !== undefined && entry.productivity >= threshold
      )
      .slice(0, limit);
  },
});

// Get average metrics over a time period
export const getAverageMetrics = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const allEntries = await ctx.db
      .query("dailyEntries")
      .withIndex("by_date")
      .order("desc")
      .collect();

    const recentEntries = allEntries.filter((entry) => entry.date >= startDate);

    if (recentEntries.length === 0) {
      return null;
    }

    let totalEnergy = 0;
    let energyCount = 0;
    let totalProductivity = 0;
    let productivityCount = 0;

    const moodCounts = {
      great: 0,
      good: 0,
      okay: 0,
      bad: 0,
      terrible: 0,
    };

    recentEntries.forEach((entry) => {
      if (entry.energy !== undefined) {
        totalEnergy += entry.energy;
        energyCount++;
      }
      if (entry.productivity !== undefined) {
        totalProductivity += entry.productivity;
        productivityCount++;
      }
      if (entry.mood) {
        moodCounts[entry.mood]++;
      }
    });

    return {
      period: `Last ${days} days`,
      entryCount: recentEntries.length,
      averageEnergy: energyCount > 0 ? totalEnergy / energyCount : null,
      averageProductivity:
        productivityCount > 0 ? totalProductivity / productivityCount : null,
      moodDistribution: moodCounts,
    };
  },
});

// Get statistics
export const getStats = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const allEntries = await ctx.db.query("dailyEntries").collect();
    const recentEntries = allEntries.filter((entry) => entry.date >= startDate);

    let withMood = 0;
    let withEnergy = 0;
    let withProductivity = 0;
    let withReflection = 0;
    let withGratitude = 0;
    let withWins = 0;
    let withChallenges = 0;
    let withOuraMetrics = 0;
    let withNote = 0;

    recentEntries.forEach((entry) => {
      if (entry.mood) withMood++;
      if (entry.energy !== undefined) withEnergy++;
      if (entry.productivity !== undefined) withProductivity++;
      if (entry.reflection) withReflection++;
      if (entry.gratitude && entry.gratitude.length > 0) withGratitude++;
      if (entry.wins && entry.wins.length > 0) withWins++;
      if (entry.challenges && entry.challenges.length > 0) withChallenges++;
      if (entry.ouraMetrics) withOuraMetrics++;
      if (entry.noteId) withNote++;
    });

    return {
      total: allEntries.length,
      recentCount: recentEntries.length,
      period: `Last ${days} days`,
      withMood,
      withEnergy,
      withProductivity,
      withReflection,
      withGratitude,
      withWins,
      withChallenges,
      withOuraMetrics,
      withNote,
    };
  },
});

// Get current streak (consecutive days with entries)
export const getCurrentStreak = query({
  args: {},
  handler: async (ctx) => {
    const allEntries = await ctx.db
      .query("dailyEntries")
      .withIndex("by_date")
      .order("desc")
      .collect();

    if (allEntries.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentDate = today.getTime();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check current streak
    for (const entry of allEntries) {
      if (entry.date === currentDate) {
        currentStreak++;
        tempStreak++;
        currentDate -= 24 * 60 * 60 * 1000; // Go back one day
      } else {
        break;
      }
    }

    // Find longest streak
    const sortedEntries = allEntries.sort((a, b) => a.date - b.date);
    let lastDate: number | null = null;

    for (const entry of sortedEntries) {
      if (lastDate === null) {
        tempStreak = 1;
      } else if (entry.date === lastDate + 24 * 60 * 60 * 1000) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
      lastDate = entry.date;
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  },
});

// Get entry with note
export const getWithNote = query({
  args: { id: v.id("dailyEntries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);

    if (!entry) {
      return null;
    }

    const note = entry.noteId ? await ctx.db.get(entry.noteId) : null;

    return {
      entry,
      note,
    };
  },
});

// Link entry to a daily note
export const linkNote = mutation({
  args: {
    entryId: v.id("dailyEntries"),
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);

    if (!entry) {
      throw new Error("Daily entry not found");
    }

    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new Error("Note not found");
    }

    await ctx.db.patch(args.entryId, {
      noteId: args.noteId,
      updatedAt: Date.now(),
    });

    return true;
  },
});
