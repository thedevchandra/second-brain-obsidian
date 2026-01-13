import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Core note system
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    filePath: v.optional(v.string()), // Path in Obsidian vault
    type: v.union(
      v.literal("daily"),
      v.literal("permanent"),
      v.literal("fleeting"),
      v.literal("literature"),
      v.literal("project"),
      v.literal("meeting")
    ),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    sourceUrl: v.optional(v.string()), // Original source if imported
    sourceType: v.optional(
      v.union(
        v.literal("obsidian"),
        v.literal("notion"),
        v.literal("email"),
        v.literal("web")
      )
    ),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_type", ["type"])
    .index("by_file_path", ["filePath"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["type"],
    })
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["type", "tags"],
    }),

  // Links between notes (for building knowledge graph)
  links: defineTable({
    sourceNoteId: v.id("notes"),
    targetNoteId: v.id("notes"),
    linkType: v.union(
      v.literal("reference"),
      v.literal("related"),
      v.literal("parent"),
      v.literal("child")
    ),
    context: v.optional(v.string()), // Surrounding text where link appears
    createdAt: v.number(),
  })
    .index("by_source", ["sourceNoteId"])
    .index("by_target", ["targetNoteId"]),

  // Tasks and todos
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    projectId: v.optional(v.id("projects")),
    noteId: v.optional(v.id("notes")),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"])
    .index("by_project", ["projectId"])
    .index("by_note", ["noteId"]),

  // Projects
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("planning"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("archived")
    ),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    tags: v.array(v.string()),
    githubRepo: v.optional(v.string()),
    notionPageId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .searchIndex("search_projects", {
      searchField: "name",
      filterFields: ["status"],
    }),

  // People/Contacts
  people: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.array(v.string()),
    lastContactDate: v.optional(v.number()),
    contactFrequency: v.optional(v.string()), // e.g., "weekly", "monthly"
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_last_contact", ["lastContactDate"])
    .searchIndex("search_people", {
      searchField: "name",
    }),

  // Interactions with people (emails, meetings, etc.)
  interactions: defineTable({
    personId: v.id("people"),
    type: v.union(
      v.literal("email"),
      v.literal("meeting"),
      v.literal("call"),
      v.literal("message")
    ),
    subject: v.optional(v.string()),
    summary: v.optional(v.string()),
    date: v.number(),
    noteId: v.optional(v.id("notes")),
    eventId: v.optional(v.string()), // Calendar event ID
    emailId: v.optional(v.string()), // Gmail message ID
    createdAt: v.number(),
  })
    .index("by_person", ["personId"])
    .index("by_date", ["date"])
    .index("by_type", ["type"]),

  // Calendar events
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    attendees: v.array(v.string()), // Email addresses
    calendarEventId: v.optional(v.string()), // Google Calendar ID
    meetingNoteId: v.optional(v.id("notes")),
    projectId: v.optional(v.id("projects")),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_start_time", ["startTime"])
    .index("by_project", ["projectId"]),

  // Bookmarks and resources
  bookmarks: defineTable({
    title: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    category: v.optional(v.string()),
    noteId: v.optional(v.id("notes")), // Associated note if created
    favicon: v.optional(v.string()),
    savedAt: v.number(),
    lastAccessedAt: v.optional(v.number()),
  })
    .index("by_saved_at", ["savedAt"])
    .searchIndex("search_bookmarks", {
      searchField: "title",
      filterFields: ["tags"],
    }),

  // Highlights and quotes
  highlights: defineTable({
    content: v.string(),
    source: v.string(), // Book, article, video, etc.
    sourceUrl: v.optional(v.string()),
    author: v.optional(v.string()),
    noteId: v.optional(v.id("notes")),
    tags: v.array(v.string()),
    color: v.optional(v.string()), // For categorization
    createdAt: v.number(),
  })
    .index("by_source", ["source"])
    .index("by_created_at", ["createdAt"])
    .searchIndex("search_highlights", {
      searchField: "content",
      filterFields: ["tags"],
    }),

  // Daily reflections and metrics
  dailyEntries: defineTable({
    date: v.number(), // Timestamp for the day
    mood: v.optional(v.union(
      v.literal("great"),
      v.literal("good"),
      v.literal("okay"),
      v.literal("bad"),
      v.literal("terrible")
    )),
    energy: v.optional(v.number()), // 1-10 scale
    productivity: v.optional(v.number()), // 1-10 scale
    reflection: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    wins: v.optional(v.array(v.string())),
    challenges: v.optional(v.array(v.string())),
    noteId: v.optional(v.id("notes")), // Link to daily note
    ouraMetrics: v.optional(v.object({
      readiness: v.optional(v.number()),
      sleep: v.optional(v.number()),
      activity: v.optional(v.number()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"]),

  // Tags taxonomy
  tags: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    parentTagId: v.optional(v.id("tags")),
    usageCount: v.number(), // Denormalized count for performance
    createdAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_parent", ["parentTagId"])
    .index("by_usage", ["usageCount"]),

  // Embeddings for semantic search
  embeddings: defineTable({
    entityType: v.union(
      v.literal("note"),
      v.literal("bookmark"),
      v.literal("highlight")
    ),
    entityId: v.string(), // ID of the note/bookmark/highlight
    embedding: v.array(v.number()), // Vector embedding
    text: v.string(), // Original text that was embedded
    createdAt: v.number(),
  })
    .index("by_entity", ["entityType", "entityId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536, // OpenAI embedding dimensions
      filterFields: ["entityType"],
    }),
});
