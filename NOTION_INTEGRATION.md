# Notion + Obsidian Integration Guide

## Overview

This vault uses a hybrid approach: Obsidian for thinking and knowledge work, Notion for structured databases and task tracking.

## Integration Patterns

### 1. Linking to Notion Databases

Create area or resource notes in Obsidian that reference your Notion databases:

```markdown
---
para: area
status: active
created: 2026-01-13
notion-database: https://notion.so/your-database-id
topics:
  - "[[Productivity]]"
---

# Project Management

**Notion Database**: [Active Projects](https://notion.so/your-database-id)

## Purpose
Track all active projects with detailed task breakdowns in Notion.

## Review Process
- **Weekly**: Review in Notion, capture insights in Obsidian daily notes
- **Monthly**: Create summary note in Obsidian linking to major projects
```

### 2. Project Notes with Notion Links

For projects tracked in Notion, create corresponding Obsidian notes for thinking:

```markdown
---
para: project
status: active
created: 2026-01-13
end: 2026-03-31
notion-page: https://notion.so/project-page-id
topics:
  - "[[Work]]"
---

# Website Redesign Project

**Notion Project Page**: [View in Notion](https://notion.so/project-page-id)

## Strategy Notes
[Use this space for strategic thinking, not task tracking]

## Key Decisions
- 2026-01-13: Decided to use Next.js based on [[Framework Evaluation]]

## Learnings
- [[Design Systems]] - Discovered importance of component documentation
```

### 3. Meeting Notes with Notion References

```markdown
---
created: 2026-01-13
topics:
  - "[[Meetings]]"
  - "[[Product Development]]"
notion-action-items: https://notion.so/action-items-page
---

# 2026-01-13 Product Strategy Meeting

## Notes
[Capture thoughts and insights here]

## Action Items
Tracked in Notion: [View Action Items](https://notion.so/action-items-page)

## Follow-up Thoughts
[Space for post-meeting reflection]
```

### 4. Habit Tracking Reference

```markdown
---
para: area
status: active
notion-database: https://notion.so/habit-tracker-id
topics:
  - "[[Health]]"
  - "[[Self-Improvement]]"
---

# Personal Health & Habits

**Habit Tracker**: [View in Notion](https://notion.so/habit-tracker-id)

## Reflections
Use daily notes to reflect on habit patterns. Notion tracks the data, Obsidian captures the insights.

## Monthly Reviews
- [[2026-01 Health Review]]
- [[2025-12 Health Review]]
```

## Your Notion Structure Documentation

### Current Databases

Document your Notion databases here to maintain a map:

#### Projects Database
- **URL**: [Add your Notion database URL]
- **Purpose**: Track active projects with tasks, deadlines, status
- **Fields**: Name, Status, Priority, Due Date, Owner
- **Obsidian Strategy**: Create project notes in Obsidian for strategy/thinking, link to Notion for task tracking

#### Reading List
- **URL**: [Add your Notion database URL]
- **Purpose**: Track books, articles to read
- **Fields**: Title, Author, Status, Rating, Notes
- **Obsidian Strategy**: Create book notes in Obsidian after reading, keep reading queue in Notion

#### Habit Tracker
- **URL**: [Add your Notion database URL]
- **Purpose**: Daily habit tracking and streaks
- **Fields**: Date, Habits (checkboxes), Notes
- **Obsidian Strategy**: Use Notion for daily tracking, Obsidian for monthly reviews and pattern analysis

#### Personal Areas Database
- **URL**: [Add your Notion database URL]
- **Purpose**: Track areas of responsibility
- **Fields**: Area Name, Status, Review Date, Goals
- **Obsidian Strategy**: Create corresponding area notes in Obsidian for deep thinking, use Notion for tracking metrics

### Migration Decision Framework

For each piece of content, ask:

| Keep in Notion | Move to Obsidian |
|----------------|-------------------|
| Task tracking and checklists | Conceptual thinking and strategy |
| Structured databases with views | Interconnected knowledge notes |
| Habit tracking with streaks | Daily journaling and reflection |
| Collaboration with others | Personal research and learning |
| Time-sensitive project management | Timeless evergreen notes |
| Calendar and scheduling | Meeting insights and learnings |

## Workflows

### Daily Review
1. Check Notion for today's tasks and habits
2. Write Obsidian daily note with reflections
3. Link daily note to relevant project/area notes

### Weekly Review
1. Review completed tasks in Notion
2. Create Obsidian note: `YYYY-MM-DD Weekly Review`
3. Capture insights, update area notes
4. Link to specific Notion pages for context

### Monthly Review
1. Export Notion data for the month
2. Create comprehensive monthly review note in Obsidian
3. Update area notes with progress
4. Archive completed projects in both systems

### Project Workflow
1. **Start**: Create project in Notion database
2. **Strategy**: Create Obsidian project note for thinking
3. **Execution**: Track tasks in Notion
4. **Learning**: Capture insights in Obsidian
5. **Complete**: Archive in both systems, create learnings note

## Custom Properties for Notion Integration

Add these properties to `.obsidian/types.json`:

```json
{
  "notion-database": "text",
  "notion-page": "text",
  "notion-action-items": "text"
}
```

These properties create clickable links to your Notion content from Obsidian.

## Tips

### Link Formatting
Use full URLs for maximum compatibility:
- ✅ `https://www.notion.so/workspace/page-id`
- ❌ `notion://page-id` (app-specific, may not work everywhere)

### Bidirectional Links
In Notion, create a text field with Obsidian file links:
- `obsidian://vault/SecondBrain/path/to/note.md`

### Search Both Systems
Create a "Search Checklist" note:
```markdown
When looking for information:
- [ ] Search Obsidian vault
- [ ] Search Notion workspace
- [ ] Check daily notes for references
- [ ] Check project notes for Notion links
```

### Avoid Duplication
- **Single Source of Truth**: Each piece of information lives in ONE place
- **Links Not Copies**: Link between systems rather than duplicating content
- **Clear Boundaries**: Obsidian = knowledge, Notion = tracking

## Getting Started

1. **Audit**: List all your Notion databases and pages
2. **Map**: Decide what stays in Notion vs. moves to Obsidian
3. **Connect**: Create Obsidian notes with links to Notion content
4. **Workflow**: Establish daily/weekly review routines
5. **Refine**: Adjust boundaries as you discover what works

## Next Steps

1. Document your Notion databases in the "Current Databases" section above
2. Choose 1-2 active projects to create Obsidian notes for
3. Try the daily review workflow for one week
4. Adjust based on what feels natural
