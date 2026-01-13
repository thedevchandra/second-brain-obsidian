---
created: 2026-01-13
last: 2026-01-13
tags:
  - meta
  - documentation
---

# Second Brain Organization

A comprehensive guide to your Obsidian vault structure using the PARA method.

## Overview

Your vault is organized using the **PARA method**:
- **Projects** - Active initiatives with deadlines
- **Areas** - Ongoing responsibilities requiring maintenance
- **Resources** - Reference material and knowledge bases
- **Archive** - Inactive items

## Structure

### Areas (Root Level)

Your 6 main Areas at the root level for easy access:

1. **[[Experiences]]** - Travel, events, and memorable experiences
2. **[[Website]]** - Personal website management
3. **[[Military]]** - Navy Reserve service
4. **[[Health]]** - Physical and mental wellness
5. **[[Money]]** - Financial management
6. **[[Growth]]** - Personal development and community

### Resources (References Folder)

All 19 Resources in `/References/` organized by area:

#### Growth Resources
- [[Personal Development]] - Self-improvement and learning
- [[Community]] - Relationships and social capital
- [[Routine]] - Daily habits and systems
- [[Metrics]] - Performance tracking

#### Health Resources
- [[Physical Health]] - Exercise and fitness
- [[Mental Health]] - Emotional well-being
- [[Nutrition]] - Diet and recipes

#### Military Resources
- [[Military Admin]] - Navy administrative tasks
- [[Unit Leadership]] - Command responsibilities
- [[Veteran]] - VA benefits and resources
- [[Navy Engineering]] - Technical knowledge

#### Money Resources
- [[Real Estate]] - Property investment
- [[Personal Finance]] - Wealth management
- [[Inventory]] - Possessions and gear

#### Experience Resources
- [[Travel]] - Travel planning and tips
- [[Locations]] - City and destination guides

#### Website Resources
- [[Website Notes]] - Development notes and tools

#### Independent Resources
- [[Spanish]] - Language learning
- [[Move to Biz]] - Business content creation

### Content (References Folder)

Media, books, and other reference content:

**Movies**: [[Rush Hour]], [[Rush Hour 2]]

**TV Shows**: [[Friends]], [[Burn Notice]], [[Suits]], [[Chuck]], [[White Collar]], [[Below Deck]], [[Numbers]], [[Futurama]]

**Books**: [[The 4-Hour Work Week]], [[Atomic Habits]], [[Minimalism]], [[Essentialism]], [[The Subtle Art of Not Giving a Fuck]]

**Places**: [[Kyoto]], [[Parks]]

**Other**: [[Obsidian]], [[Sci-fi]]

### Categories (Categories Folder)

Overview pages with dynamic queries:
- Movies, Shows, Books, People, Places
- Projects, Areas, Resources
- Events, Meetings, Trips, Recipes
- And more...

### Daily Notes (Daily Folder)

- **Format**: YYYY-MM-DD.md
- **Timestamped fragments**: YYYY-MM-DD HHmm.md
- **Monthly reviews**: YYYY-MM Monthly Note.md
- **Yearly reviews**: YYYY Yearly Note.md

### Working Notes (Notes Folder)

- Evergreen notes
- Meeting notes
- Project notes
- Trip summaries
- General working documents

### Templates (Templates Folder)

- 52 note templates for different content types
- 30 base query files for dynamic views
- Template documentation

### Archive (Archive Folder)

Inactive categories and completed items:
- Albums (archived)
- Board games (archived)
- Completed projects
- Old notes

## Folder Structure Visualization

```
second-brain-obsidian/
├── 📄 Experiences.md (Area)
├── 📄 Website.md (Area)
├── 📄 Military.md (Area)
├── 📄 Health.md (Area)
├── 📄 Money.md (Area)
├── 📄 Growth.md (Area)
│
├── 📁 References/
│   ├── 🎯 Resources (19 files)
│   │   ├── Travel.md
│   │   ├── Personal Development.md
│   │   ├── Community.md
│   │   └── ...
│   │
│   └── 📚 Content
│       ├── Movies (9 files)
│       ├── Shows (9 files)
│       ├── Books (5 files)
│       ├── Places (2 files)
│       └── Other (2 files)
│
├── 📁 Categories/
│   ├── Movies.md
│   ├── Shows.md
│   ├── Books.md
│   ├── Projects.md
│   └── ... (17 more)
│
├── 📁 Daily/
│   └── Daily notes & fragments
│
├── 📁 Notes/
│   └── Working notes & documents
│
├── 📁 Templates/
│   ├── 52 note templates
│   └── Bases/ (30 query files)
│
├── 📁 Clippings/
│   └── Web clippings
│
└── 📁 Archive/
    └── Inactive items
```

## Navigation Patterns

### From Area to Resources
Each Area links to its relevant Resources:
- **Health** → Physical Health, Nutrition, Mental Health
- **Growth** → Personal Development, Community, Routine, Metrics
- **Military** → Military Admin, Unit Leadership, Veteran, Navy Engineering
- **Money** → Real Estate, Personal Finance, Inventory
- **Experiences** → Travel, Locations
- **Website** → Website Notes

### From Resources to Content
Resources link to specific content:
- **Personal Development** → Atomic Habits, Minimalism
- **Locations** → Kyoto, Austin, Pittsburgh
- **Travel** → References travel-related shows and books

### From Content to Categories
Content appears in category pages:
- Movies → Movies.md category
- Shows → Shows.md category
- Books → Books.md category

## Workflow Patterns

### Weekly Review
1. Open each Area note
2. Review standards and current status
3. Answer review questions
4. Update linked projects and resources

### Daily Capture
1. Create daily note in `/Daily/`
2. Capture thoughts and tasks
3. Link to relevant Areas
4. Create timestamped fragments for detailed notes

### Content Addition
1. Use appropriate template from `/Templates/`
2. Save to `/References/` folder
3. Add description for context
4. Content automatically appears in category pages

### Project Workflow
1. Create project note with `para: project` property
2. Link from relevant Area
3. Track progress in Projects category
4. Move to `/Archive/` when complete

## Properties System

Your vault uses 61+ metadata properties for organization:

**Key Properties**:
- `para` - Project, Area, Resource, or Archive
- `status` - Active, paused, completed, archived
- `categories` - Links to category pages
- `topics` - Subject tags
- `created` - Creation date
- `last` - Last modified date
- `rating` - Quality/importance rating

## Benefits of This Structure

1. **PARA Organization**: Clear separation of Projects/Areas/Resources/Archive
2. **Property-Based**: Flexible organization without strict folder hierarchy
3. **Easy Navigation**: Bidirectional links throughout vault
4. **Scalable**: Add content without restructuring
5. **Future-Proof**: Plain markdown files
6. **Fast Access**: Areas at root level, content in References

## Tips for Use

1. **Start with Areas**: Review your 6 Areas regularly
2. **Use Resources**: Add to Resources as you learn
3. **Capture Daily**: Use Daily notes for thoughts and tasks
4. **Link Liberally**: Create connections between notes
5. **Trust Search**: Use Obsidian's search for quick access
6. **Review Weekly**: Check Area notes every week
7. **Archive Actively**: Move inactive items to Archive

## Next Steps

- Add active projects and link from Areas
- Build connections between related notes
- Expand Resources as you gather knowledge
- Use Templates for consistent capture
- Review and refine Area standards monthly

