# Convex Functions Documentation

## Notes Functions (`convex/notes.ts`)

### Mutations

#### `create`
Create a new note with automatic tag tracking.
```typescript
args: {
  title: string;
  content: string;
  filePath?: string;
  type: "daily" | "permanent" | "fleeting" | "literature" | "project" | "meeting";
  tags: string[];
  sourceUrl?: string;
  sourceType?: "obsidian" | "notion" | "email" | "web";
}
```

#### `update`
Update an existing note with tag management.
```typescript
args: {
  id: Id<"notes">;
  title?: string;
  content?: string;
  filePath?: string;
  type?: "daily" | "permanent" | "fleeting" | "literature" | "project" | "meeting";
  tags?: string[];
  sourceUrl?: string;
  sourceType?: "obsidian" | "notion" | "email" | "web";
}
```

#### `deleteNote`
Delete a note and clean up associated links and tags.
```typescript
args: { id: Id<"notes"> }
```

#### `createLink`
Create a link between two notes (with duplicate prevention).
```typescript
args: {
  sourceNoteId: Id<"notes">;
  targetNoteId: Id<"notes">;
  linkType: "reference" | "related" | "parent" | "child";
  context?: string;
}
```

#### `deleteLink`
Remove a link between notes.
```typescript
args: { id: Id<"links"> }
```

### Queries

#### `get`
Get a single note by ID.
```typescript
args: { id: Id<"notes"> }
```

#### `getByFilePath`
Find a note by its file path in Obsidian.
```typescript
args: { filePath: string }
```

#### `list`
List notes with optional filtering and pagination.
```typescript
args: {
  type?: "daily" | "permanent" | "fleeting" | "literature" | "project" | "meeting";
  limit?: number;
  offset?: number;
}
```

#### `getRecent`
Get recently created notes.
```typescript
args: { limit?: number } // default: 10
```

#### `searchByTitle`
Full-text search notes by title.
```typescript
args: {
  searchTerm: string;
  type?: "daily" | "permanent" | "fleeting" | "literature" | "project" | "meeting";
}
```

#### `searchByContent`
Full-text search notes by content.
```typescript
args: {
  searchTerm: string;
  type?: "daily" | "permanent" | "fleeting" | "literature" | "project" | "meeting";
}
```

#### `getByTag`
Get all notes with a specific tag.
```typescript
args: {
  tag: string;
  limit?: number; // default: 20
}
```

#### `getWithLinks`
Get a note with all its linked notes and backlinks.
```typescript
args: { id: Id<"notes"> }
returns: {
  note: Note;
  linkedNotes: Array<{ link: Link; note: Note }>;
  backlinks: Array<{ link: Link; note: Note }>;
}
```

---

## Tasks Functions (`convex/tasks.ts`)

### Mutations

#### `create`
Create a new task.
```typescript
args: {
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "done" | "cancelled"; // default: "todo"
  priority?: "low" | "medium" | "high" | "urgent"; // default: "medium"
  dueDate?: number;
  projectId?: Id<"projects">;
  noteId?: Id<"notes">;
  tags?: string[];
}
```

#### `update`
Update an existing task (automatically manages completedAt).
```typescript
args: {
  id: Id<"tasks">;
  title?: string;
  description?: string;
  status?: "todo" | "in_progress" | "done" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: number;
  projectId?: Id<"projects">;
  noteId?: Id<"notes">;
  tags?: string[];
}
```

#### `deleteTask`
Delete a task.
```typescript
args: { id: Id<"tasks"> }
```

#### `complete`
Mark a task as done with timestamp.
```typescript
args: { id: Id<"tasks"> }
```

#### `reopen`
Reopen a completed task.
```typescript
args: { id: Id<"tasks"> }
```

### Queries

#### `get`
Get a single task by ID.
```typescript
args: { id: Id<"tasks"> }
```

#### `list`
List all tasks with optional filtering.
```typescript
args: {
  status?: "todo" | "in_progress" | "done" | "cancelled";
  limit?: number;
}
```

#### `getByStatus`
Get all tasks with a specific status.
```typescript
args: {
  status: "todo" | "in_progress" | "done" | "cancelled";
}
```

#### `getByProject`
Get all tasks for a specific project.
```typescript
args: {
  projectId: Id<"projects">;
  status?: "todo" | "in_progress" | "done" | "cancelled";
}
```

#### `getByNote`
Get all tasks associated with a note.
```typescript
args: { noteId: Id<"notes"> }
```

#### `getDueSoon`
Get tasks due within the specified number of days.
```typescript
args: { days?: number } // default: 7
```

#### `getOverdue`
Get all overdue tasks (status: todo, past due date).
```typescript
args: {}
```

#### `getByPriority`
Get tasks by priority level.
```typescript
args: {
  priority: "low" | "medium" | "high" | "urgent";
  status?: "todo" | "in_progress" | "done" | "cancelled";
}
```

#### `getToday`
Get today's tasks, sorted by priority then due time.
```typescript
args: {}
```

#### `getStats`
Get task statistics.
```typescript
args: { projectId?: Id<"projects"> }
returns: {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  cancelled: number;
  overdue: number;
}
```

---

## Usage Examples

### Creating a note
```typescript
const noteId = await ctx.runMutation(api.notes.create, {
  title: "My First Note",
  content: "This is the content of my note.",
  type: "permanent",
  tags: ["learning", "productivity"],
  sourceType: "obsidian",
});
```

### Searching notes
```typescript
const results = await ctx.runQuery(api.notes.searchByContent, {
  searchTerm: "productivity",
  type: "permanent",
});
```

### Creating a task
```typescript
const taskId = await ctx.runMutation(api.tasks.create, {
  title: "Review notes on productivity",
  priority: "high",
  dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
  tags: ["review"],
});
```

### Getting today's tasks
```typescript
const todaysTasks = await ctx.runQuery(api.tasks.getToday, {});
```

### Linking notes
```typescript
await ctx.runMutation(api.notes.createLink, {
  sourceNoteId: noteId1,
  targetNoteId: noteId2,
  linkType: "reference",
  context: "Related concept mentioned in paragraph 3",
});
```

---

---

## Projects Functions (`convex/projects.ts`)

### Mutations

#### `create`
Create a new project.
```typescript
args: {
  name: string;
  description?: string;
  status?: "planning" | "active" | "paused" | "completed" | "archived";
  startDate?: number;
  endDate?: number;
  tags?: string[];
  githubRepo?: string;
  notionPageId?: string;
}
```

#### `update`
Update an existing project.
```typescript
args: {
  id: Id<"projects">;
  name?: string;
  description?: string;
  status?: "planning" | "active" | "paused" | "completed" | "archived";
  startDate?: number;
  endDate?: number;
  tags?: string[];
  githubRepo?: string;
  notionPageId?: string;
}
```

#### `deleteProject`
Delete a project (tasks are orphaned, not deleted).
```typescript
args: { id: Id<"projects"> }
```

#### `archive`
Archive a project.
```typescript
args: { id: Id<"projects"> }
```

#### `complete`
Mark a project as completed with end date.
```typescript
args: { id: Id<"projects"> }
```

#### `start`
Start a project (planning → active).
```typescript
args: { id: Id<"projects"> }
```

#### `pause`
Pause a project.
```typescript
args: { id: Id<"projects"> }
```

#### `resume`
Resume a paused project.
```typescript
args: { id: Id<"projects"> }
```

### Queries

#### `get`
Get a single project by ID.
```typescript
args: { id: Id<"projects"> }
```

#### `list`
List all projects with optional filtering.
```typescript
args: {
  status?: "planning" | "active" | "paused" | "completed" | "archived";
  limit?: number;
}
```

#### `getByStatus`
Get all projects with a specific status.
```typescript
args: {
  status: "planning" | "active" | "paused" | "completed" | "archived";
}
```

#### `getActive`
Get all active projects.
```typescript
args: {}
```

#### `search`
Full-text search projects by name.
```typescript
args: {
  searchTerm: string;
  status?: "planning" | "active" | "paused" | "completed" | "archived";
}
```

#### `getWithDetails`
Get project with all related data (tasks, events, notes, stats).
```typescript
args: { id: Id<"projects"> }
returns: {
  project: Project;
  tasks: Task[];
  events: Event[];
  notes: Note[];
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    overdue: number;
  };
}
```

#### `getStats`
Get project statistics across all projects.
```typescript
args: {}
returns: {
  total: number;
  planning: number;
  active: number;
  paused: number;
  completed: number;
  archived: number;
}
```

#### `getByTag`
Get projects by tag.
```typescript
args: {
  tag: string;
  limit?: number;
}
```

---

## People Functions (`convex/people.ts`)

### Mutations

#### `create`
Create a new person/contact (prevents duplicate emails).
```typescript
args: {
  name: string;
  email?: string;
  company?: string;
  role?: string;
  notes?: string;
  tags?: string[];
  lastContactDate?: number;
  contactFrequency?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  source?: "gmail" | "contacts" | "linkedin" | "manual";
}
```

#### `update`
Update an existing person (checks for email conflicts).
```typescript
args: {
  id: Id<"people">;
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  notes?: string;
  tags?: string[];
  lastContactDate?: number;
  contactFrequency?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  source?: "gmail" | "contacts" | "linkedin" | "manual";
}
```

#### `deletePerson`
Delete a person (interactions are kept as history).
```typescript
args: { id: Id<"people"> }
```

#### `recordInteraction`
Record an interaction with a person (auto-updates lastContactDate).
```typescript
args: {
  personId: Id<"people">;
  type: "email" | "meeting" | "call" | "message";
  subject?: string;
  summary?: string;
  date?: number;
  noteId?: Id<"notes">;
  eventId?: string;
  emailId?: string;
}
```

#### `updateLastContact`
Update last contact date for a person.
```typescript
args: {
  id: Id<"people">;
  date?: number; // defaults to now
}
```

### Queries

#### `get`
Get a single person by ID.
```typescript
args: { id: Id<"people"> }
```

#### `getByEmail`
Find a person by email address.
```typescript
args: { email: string }
```

#### `list`
List all people with pagination.
```typescript
args: {
  limit?: number;
  offset?: number;
}
```

#### `search`
Full-text search people by name.
```typescript
args: { searchTerm: string }
```

#### `getWithInteractions`
Get person with all interactions and stats.
```typescript
args: { id: Id<"people"> }
returns: {
  person: Person;
  interactions: Interaction[];
  stats: {
    total: number;
    emails: number;
    meetings: number;
    calls: number;
    messages: number;
  };
}
```

#### `getNeedingFollowUp`
Get people who haven't been contacted recently.
```typescript
args: { days?: number } // default: 30
```

#### `getByCompany`
Get all people from a specific company.
```typescript
args: { company: string }
```

#### `getByTag`
Get people by tag.
```typescript
args: {
  tag: string;
  limit?: number;
}
```

#### `getRecentInteractions`
Get recent interactions across all people.
```typescript
args: {
  limit?: number; // default: 20
  type?: "email" | "meeting" | "call" | "message";
}
returns: Array<{
  interaction: Interaction;
  person: Person;
}>
```

#### `getInteractionStats`
Get interaction statistics.
```typescript
args: {
  personId?: Id<"people">; // optional: for specific person
  days?: number; // default: 30
}
returns: {
  total: number;
  emails: number;
  meetings: number;
  calls: number;
  messages: number;
  period: string;
}
```

#### `getStats`
Get people statistics.
```typescript
args: {}
returns: {
  total: number;
  withEmail: number;
  withCompany: number;
  fromGmail: number;
  fromContacts: number;
  fromLinkedIn: number;
  manual: number;
}
```

---

## Bookmarks Functions (`convex/bookmarks.ts`)

### Mutations

#### `create`
Create a new bookmark (prevents duplicate URLs).
```typescript
args: {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  category?: string;
  noteId?: Id<"notes">;
  favicon?: string;
}
```

#### `update`
Update an existing bookmark (checks for URL conflicts).
```typescript
args: {
  id: Id<"bookmarks">;
  title?: string;
  url?: string;
  description?: string;
  tags?: string[];
  category?: string;
  noteId?: Id<"notes">;
  favicon?: string;
}
```

#### `deleteBookmark`
Delete a bookmark.
```typescript
args: { id: Id<"bookmarks"> }
```

#### `markAccessed`
Mark bookmark as accessed (updates lastAccessedAt).
```typescript
args: { id: Id<"bookmarks"> }
```

#### `bulkImport`
Import multiple bookmarks at once.
```typescript
args: {
  bookmarks: Array<{
    title: string;
    url: string;
    description?: string;
    tags?: string[];
    category?: string;
    favicon?: string;
  }>;
}
returns: {
  imported: number;
  skipped: number;
  errors: string[];
}
```

### Queries

#### `get`
Get a single bookmark by ID.
```typescript
args: { id: Id<"bookmarks"> }
```

#### `getByUrl`
Find a bookmark by URL.
```typescript
args: { url: string }
```

#### `list`
List all bookmarks with optional filtering and pagination.
```typescript
args: {
  category?: string;
  limit?: number;
  offset?: number;
}
```

#### `getByTag`
Get bookmarks by tag.
```typescript
args: {
  tag: string;
  limit?: number; // default: 20
}
```

#### `getByCategory`
Get all bookmarks in a category.
```typescript
args: { category: string }
```

#### `search`
Full-text search bookmarks by title.
```typescript
args: { searchTerm: string }
```

#### `getRecent`
Get recently saved bookmarks.
```typescript
args: { limit?: number } // default: 10
```

#### `getRecentlyAccessed`
Get recently accessed bookmarks.
```typescript
args: { limit?: number } // default: 10
```

#### `getCategories`
Get all categories used in bookmarks.
```typescript
args: {}
returns: string[]
```

#### `getTags`
Get all tags used in bookmarks with counts.
```typescript
args: {}
returns: Array<{ tag: string; count: number }>
```

#### `getStats`
Get bookmark statistics.
```typescript
args: {}
returns: {
  total: number;
  categories: number;
  tags: number;
  withNotes: number;
  accessed: number;
  unaccessed: number;
}
```

#### `getWithNotes`
Get bookmarks that have associated notes.
```typescript
args: { limit?: number } // default: 20
returns: Array<{
  bookmark: Bookmark;
  note: Note | null;
}>
```

---

## Events Functions (`convex/events.ts`)

### Mutations

#### `create`
Create a new event.
```typescript
args: {
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  location?: string;
  attendees?: string[];
  calendarEventId?: string;
  meetingNoteId?: Id<"notes">;
  projectId?: Id<"projects">;
  tags?: string[];
}
```

#### `update`
Update an existing event (validates time ranges).
```typescript
args: {
  id: Id<"events">;
  title?: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  location?: string;
  attendees?: string[];
  calendarEventId?: string;
  meetingNoteId?: Id<"notes">;
  projectId?: Id<"projects">;
  tags?: string[];
}
```

#### `deleteEvent`
Delete an event.
```typescript
args: { id: Id<"events"> }
```

#### `linkMeetingNote`
Link an event to a meeting note.
```typescript
args: {
  eventId: Id<"events">;
  noteId: Id<"notes">;
}
```

#### `linkProject`
Link an event to a project.
```typescript
args: {
  eventId: Id<"events">;
  projectId: Id<"projects">;
}
```

### Queries

#### `get`
Get a single event by ID.
```typescript
args: { id: Id<"events"> }
```

#### `getByCalendarEventId`
Find event by calendar event ID.
```typescript
args: { calendarEventId: string }
```

#### `list`
List all events with pagination.
```typescript
args: {
  limit?: number;
  offset?: number;
}
```

#### `getByDateRange`
Get events within a date range.
```typescript
args: {
  startDate: number;
  endDate: number;
}
```

#### `getUpcoming`
Get upcoming events.
```typescript
args: {
  limit?: number; // default: 10
  days?: number; // default: 7
}
```

#### `getToday`
Get today's events.
```typescript
args: {}
```

#### `getPast`
Get past events.
```typescript
args: { limit?: number } // default: 20
```

#### `getByProject`
Get all events for a project.
```typescript
args: { projectId: Id<"projects"> }
```

#### `getByAttendee`
Get events with a specific attendee.
```typescript
args: {
  email: string;
  limit?: number; // default: 20
}
```

#### `getByTag`
Get events by tag.
```typescript
args: {
  tag: string;
  limit?: number; // default: 20
}
```

#### `getWithMeetingNotes`
Get events that have meeting notes.
```typescript
args: { limit?: number } // default: 20
returns: Array<{
  event: Event;
  note: Note | null;
}>
```

#### `getWithDetails`
Get event with full details (note and project).
```typescript
args: { id: Id<"events"> }
returns: {
  event: Event;
  note: Note | null;
  project: Project | null;
}
```

#### `getCurrent`
Get currently ongoing events.
```typescript
args: {}
```

#### `getThisWeek`
Get events for this week.
```typescript
args: {}
```

#### `getStats`
Get event statistics.
```typescript
args: { days?: number } // default: 30
returns: {
  total: number;
  recentCount: number;
  withNotes: number;
  withProjects: number;
  upcoming: number;
  past: number;
  period: string;
}
```

---

## Deployed to
- **URL**: https://outgoing-hornet-777.convex.cloud
- **Environment**: Preview deployment (oceanic-monitor-30)
