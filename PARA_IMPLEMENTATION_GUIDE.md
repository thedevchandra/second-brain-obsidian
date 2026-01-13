# PARA Implementation Guide

**How to Implement PARA in This Property-Based Vault**

This guide shows you how to implement Tiago Forte's PARA method (Projects, Areas, Resources, Archive) using the existing property-based, minimal-folder structure of this vault.

## Table of Contents
- [Philosophy: Why Properties Over Folders](#philosophy-why-properties-over-folders)
- [PARA in This Vault](#para-in-this-vault)
- [Implementation Strategy](#implementation-strategy)
- [Quick Start](#quick-start)
- [Working with PARA](#working-with-para)
- [Advanced Usage](#advanced-usage)
- [FAQ](#faq)

---

## Philosophy: Why Properties Over Folders

Traditional PARA implementations use four folders (Projects/, Areas/, Resources/, Archive/). This vault takes a **property-based approach** instead:

### Traditional PARA (Folder-Based)
```
📁 Projects/
📁 Areas/
📁 Resources/
📁 Archive/
```

### This Vault (Property-Based)
```
📝 Note.md
---
para: project
status: active
---
```

### Why This Approach?

1. **Multiple Classifications**: A note can be both a Resource AND related to a Project
2. **Dynamic Views**: Query-based organization adapts as priorities change
3. **No Manual Filing**: Don't waste time deciding which folder to use
4. **Link-First**: Notes connect through relationships, not location
5. **Future-Proof**: Change your system without moving files

---

## PARA in This Vault

### How PARA Maps to Existing Structure

| PARA Category | Implementation | Location | Example |
|---------------|----------------|----------|---------|
| **Projects** | `para: project` property | Root folder | "Launch podcast", "Write thesis" |
| **Areas** | `para: area` property | Root folder | "Health", "Finance", "Relationships" |
| **Resources** | References/, Clippings/, Root | Existing folders + property | Books, articles, research notes |
| **Archive** | Archive/ folder + property | Archive/ folder | Completed or inactive items |

### The PARA Property

Add this property to ANY note to classify it:

```yaml
---
para: project    # Values: project, area, resource, archive
status: active   # Values: active, inactive, completed, someday
---
```

The `para` property has been added to `.obsidian/types.json` and is ready to use.

### Status Values

- **active**: Currently working on this
- **inactive**: On hold, waiting, or not urgent
- **completed**: Finished (consider moving to Archive/)
- **someday**: Future possibility, not active yet

---

## Implementation Strategy

### Option 1: Pure Property-Based (Recommended)

**Best for:** People who want maximum flexibility and don't like manual filing

**How it works:**
- All notes stay in Root/ folder (or existing folders)
- Use `para:` and `status:` properties to classify
- View via PARA category pages (Projects.md, Areas.md, Resources.md)
- Archive folder only for truly inactive items

**Pros:**
- Maximum flexibility
- No manual filing decisions
- Notes can belong to multiple PARA categories
- Easy to recategorize

**Cons:**
- Requires discipline to tag notes
- Need to learn base queries

### Option 2: Hybrid (Folders + Properties)

**Best for:** People who want visual separation and traditional structure

**How it works:**
- Create Projects/, Areas/, Resources/ folders
- Also use properties for enhanced querying
- Keep existing References/, Clippings/ for external content
- Archive/ for inactive items

**Pros:**
- Visual clarity in file explorer
- Clear separation of concerns
- Still get benefits of properties

**Cons:**
- Have to decide where files go
- Some notes naturally fit multiple categories
- More rigid structure

### Option 3: Smart Hybrid (Recommended for Most)

**Best for:** Balance of structure and flexibility

**How it works:**
```
📁 Root/
  ├── 📝 Active project notes (para: project, status: active)
  ├── 📝 Area notes (para: area, status: active)
  └── 📝 Personal journal, evergreen notes
📁 References/ - External resources (books, movies, people)
📁 Clippings/ - Articles and content from others
📁 Archive/ - Inactive items (para: archive)
```

- **Projects & Areas**: Stay in Root/ with properties
- **Resources**: Split between References/ (external) and Root/ (internal knowledge)
- **Archive**: Dedicated folder for inactive items
- Use properties for ALL notes to enable powerful queries

**This is the approach we'll use in the examples below.**

---

## Quick Start

### Step 1: Property Setup (Already Done!)

The `para` property has been added to `.obsidian/types.json`. You're ready to go!

### Step 2: Create Your First Project

1. Create a new note in the Root folder (e.g., "Launch YouTube Channel.md")
2. Add PARA properties to the frontmatter:

```yaml
---
para: project
status: active
created: 2026-01-13
end: 2026-03-31
topics:
  - "[[Content Creation]]"
  - "[[Marketing]]"
tags:
  - project
  - content
---

# Launch YouTube Channel

## Goal
Create and launch a YouTube channel with 5 videos by end of Q1 2026.

## Success Criteria
- [ ] Channel created and branded
- [ ] 5 videos recorded and edited
- [ ] First video published
- [ ] 100 subscribers

## Notes
[[Video ideas]]
[[Equipment needed]]
[[Content calendar]]
```

### Step 3: Create Your First Area

1. Create a new note in Root folder (e.g., "Health & Fitness.md")
2. Add PARA properties:

```yaml
---
para: area
status: active
created: 2026-01-13
topics:
  - "[[Exercise]]"
  - "[[Nutrition]]"
  - "[[Sleep]]"
tags:
  - area
  - health
---

# Health & Fitness

## Standard of Excellence
Maintain consistent exercise routine, balanced nutrition, and 7-8 hours of sleep nightly.

## Current Focus
- Morning workout routine
- Meal prep Sundays
- Sleep hygiene practices

## Related Projects
- [[Marathon training]] (para: project)
- [[Home gym setup]] (para: project)

## Resources
- [[Fitness apps]]
- [[Nutrition guidelines]]
- [[Sleep research]]
```

### Step 4: Tag Existing Resources

Go through your References/ and Clippings/ folders and add:

```yaml
---
para: resource
topics: [relevant topics]
---
```

### Step 5: View Your PARA System

Navigate to the Categories folder to see:
- `Projects.md` - All active projects
- `Areas.md` - All areas of responsibility
- `Resources.md` - All resources

---

## Working with PARA

### Projects: Short-Term Goals with Deadlines

**Definition:** A project is a series of tasks with a specific goal and deadline.

**Examples:**
- "Write blog post on productivity"
- "Plan vacation to Japan"
- "Prepare presentation for conference"
- "Refactor authentication system"

**Template:**
```yaml
---
para: project
status: active
created: {{date}}
end: [deadline]
topics: []
tags:
  - project
---

# [Project Name]

## Goal
[What you're trying to achieve]

## Success Criteria
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Timeline
- Start: [date]
- Deadline: [date]

## Related
- Area: [[Relevant area]]
- Resources: [[Resource 1]], [[Resource 2]]

## Notes
[Working notes go here]
```

**When to archive:** When status changes to "completed" or "cancelled"

### Areas: Long-Term Responsibilities

**Definition:** An area is an ongoing responsibility or standard you want to maintain.

**Examples:**
- "Health & Fitness"
- "Personal Finance"
- "Relationships"
- "Professional Development"
- "Home & Garden"

**Template:**
```yaml
---
para: area
status: active
created: {{date}}
topics: []
tags:
  - area
---

# [Area Name]

## Standard of Excellence
[What "good" looks like in this area]

## Current Focus
- [What you're working on now]
- [Habits and routines]

## Active Projects
- [[Project 1]] (para: project)
- [[Project 2]] (para: project)

## Resources
- [[Resource 1]]
- [[Resource 2]]

## Periodic Review
- Weekly: [Quick check-in]
- Monthly: [Deeper review]
- Quarterly: [Strategic planning]
```

**When to archive:** When you're no longer responsible for this area

### Resources: Reference Materials

**Definition:** Information that may be useful in the future.

**Where they live:**
- **External resources** (books, movies, people, places) → References/ folder
- **Articles and clippings** → Clippings/ folder
- **Internal knowledge** (research notes, how-tos) → Root/ folder with `para: resource`

**Examples:**
- Books you've read
- Articles you've saved
- Research on topics of interest
- How-to guides and tutorials
- People and their expertise

**For internal resources:**
```yaml
---
para: resource
topics: []
created: {{date}}
tags:
  - resource
---

# [Resource Topic]

## Overview
[What this resource is about]

## Key Takeaways
- Point 1
- Point 2
- Point 3

## Related
- Projects that might use this: [[Project]]
- Areas this supports: [[Area]]

## Sources
- [[Book or Article 1]]
- [[Person]]
```

**When to archive:** When information becomes outdated or no longer useful

### Archive: Inactive Items

**Definition:** Completed or inactive items from Projects, Areas, or Resources.

**Location:** Archive/ folder

**When to archive:**
- **Projects:** When completed, cancelled, or on indefinite hold
- **Areas:** When you're no longer responsible
- **Resources:** When information is outdated

**How to archive:**
1. Move note to Archive/ folder
2. Update frontmatter: `para: archive`, `status: completed` (or `inactive`)
3. Add `archived: {{date}}` property

---

## Advanced Usage

### Using Base Queries

The vault includes base queries for dynamic PARA views:

- **Projects.base** - Shows all active projects, sorted by deadline
- **Areas.base** - Shows all areas with their current focus
- **Resources.base** - Shows resources by topic

### Creating Cross-PARA Links

Link between PARA categories to show relationships:

```markdown
# Product Launch (Project)
para: project

This project supports the [[Marketing]] area.

Uses resources:
- [[Market research data]]
- [[Competitor analysis]]
- [[Launch playbook]]
```

### PARA-Aware Search

Use Obsidian's search with properties:

```
para:project status:active
para:area
para:resource topics:"Marketing"
```

### Weekly Review Process

1. **Review Projects** (Projects.md view)
   - What progress was made?
   - What's blocked?
   - Any projects to complete or archive?

2. **Review Areas** (Areas.md view)
   - Is the standard being maintained?
   - Do any areas need new projects?
   - Any areas to pause or archive?

3. **Review Resources** (Resources.md view)
   - Any new resources to add?
   - Any resources to archive?

4. **Clean Archive**
   - Move completed projects to Archive/
   - Update statuses

### Monthly Review

1. Create a monthly review note using the Monthly Note Template
2. Pull data from PARA views:
   - Projects completed this month
   - Areas that need attention
   - Most-used resources
3. Plan next month's priorities

---

## FAQ

### Do I need to add `para:` to every note?

**No.** Only add it to notes that benefit from PARA organization:
- **Always**: Projects and Areas
- **Sometimes**: Resources (especially internal knowledge)
- **Rarely**: Daily notes, journal entries, meeting notes (these use `categories:` instead)
- **Never**: Templates, attachments

### Can a note be in multiple PARA categories?

**Technically no** - the `para` property only allows one value. **But in practice yes** - a note can:
- Have `para: project` but also be a resource for other projects
- Be linked from multiple projects and areas
- Have `categories: [[Books]]` AND `para: resource`

The power is in the links and relationships, not the classification.

### Should I create Projects/, Areas/, Resources/ folders?

**It's up to you.** This guide recommends:
- **Don't create folders** if you like flexibility
- **Do create folders** if you like visual organization
- **Smart Hybrid approach** (recommended): Use properties + existing structure

### What about meeting notes, journal entries, etc.?

These don't need `para:` properties. They use the existing system:
- **Meetings**: Use Meeting Template with `categories: [[Meetings]]`
- **Journal**: Daily notes or journal entries in Root/
- **Evergreen notes**: In Root/ with topic-based linking

PARA is for actionability. Not everything needs to be "actionable."

### How do I handle projects that span multiple areas?

Link them! A project can support multiple areas:

```markdown
# Website Redesign (Project)
para: project

This project supports:
- [[Professional Development]] area (portfolio building)
- [[Business]] area (client attraction)
- [[Learning]] area (new skills)
```

### When should I archive vs delete?

**Archive when:**
- Project is completed (you want the record)
- Area is inactive but might return
- Resource is outdated but historically interesting

**Delete when:**
- Note was created by mistake
- Information is wrong or misleading
- Truly irrelevant and taking up mental space

When in doubt, archive. Disk space is cheap, but lost information is gone forever.

### Can I use PARA with the existing Categories system?

**Yes!** They complement each other:

- **Categories**: Type-based organization (Books, Movies, Meetings)
- **PARA**: Actionability-based organization (Projects, Areas, Resources)

A note can have both:
```yaml
---
categories:
  - "[[Books]]"
para: resource
topics:
  - "[[Productivity]]"
---
```

This lets you view the book in:
- Books category (all books)
- Resources view (all resources)
- Productivity topic (all productivity notes)

### How often should I review my PARA system?

**Recommended cadence:**
- **Daily**: Quick scan of active projects during daily note
- **Weekly**: Review all projects and areas (15-30 min)
- **Monthly**: Deep review, archive completed items, plan ahead (1-2 hours)
- **Quarterly**: Strategic review of all areas and long-term goals (half day)

---

## Next Steps

1. **Read** the rest of this guide
2. **Create** your first project and area using the templates above
3. **Explore** the PARA category pages (Projects.md, Areas.md, Resources.md)
4. **Tag** 10-20 existing notes with `para:` properties
5. **Review** your PARA system weekly for the first month

---

## Additional Resources

### In This Vault
- `Categories/Projects.md` - View all projects
- `Categories/Areas.md` - View all areas
- `Categories/Resources.md` - View all resources
- `Templates/Project Template.md` - Project template
- `Templates/Area Template.md` - Area template
- `Archive/README.md` - Archive guide

### External Resources
- [Building a Second Brain](https://www.buildingasecondbrain.com/) - Tiago Forte's complete methodology
- [The PARA Method](https://fortelabs.com/blog/para/) - Original PARA article
- [Obsidian PARA Guide](https://forum.obsidian.md/) - Community discussions

---

**Remember:** PARA is a tool, not a religion. Adapt it to fit your needs. The goal is to reduce friction and increase actionability, not to create a perfect filing system.

*Last updated: 2026-01-13*
