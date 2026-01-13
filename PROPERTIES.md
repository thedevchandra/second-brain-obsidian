# Property System Reference

This vault uses Obsidian's property system to add structured metadata to notes. Properties enable powerful queries, filtering, and organization while maintaining the "file over app" philosophy - all metadata remains in standard YAML frontmatter that any text editor can read.

## Table of Contents

- [Property Types Overview](#property-types-overview)
- [Universal Properties](#universal-properties)
- [Template-Specific Properties](#template-specific-properties)
- [Property Type Selection Guide](#property-type-selection-guide)
- [Extending the Property System](#extending-the-property-system)
- [Querying with Properties](#querying-with-properties)
- [Complete Property Reference](#complete-property-reference)

## Property Types Overview

The vault defines 53 property types in `.obsidian/types.json`. Obsidian supports several data types:

- **text**: Single-line text values
- **multitext**: Multiple text values (list/array)
- **number**: Numeric values (integers or decimals)
- **date**: Date values (YYYY-MM-DD format)
- **datetime**: Date and time values
- **checkbox**: Boolean true/false values
- **aliases**: Special type for note aliases
- **tags**: Special type for tags

### When to Use Each Type

**Use `text` for:**
- Single values that won't have multiple entries
- IDs and identifiers (imdbId, isbn, phone)
- Unique attributes (model, system, process, role, variety, conference)
- Short descriptions or single selections

**Use `multitext` for:**
- Categories and classifications (genre, cuisine, categories)
- Multiple related items (author, director, producer, speaker)
- Collections (ingredients, topics, guests, coordinates)
- Status tracking (status can have multiple states)
- Locations (where, loc - a thing can be in multiple places)

**Use `number` for:**
- Counts and quantities (pages, runtime, shares, monthly-uses)
- Measurements (sqft, lotsqft, price)
- Ratings (rating scale values)
- Years (year, season)
- ISBNs stored as numbers (isbn, isbn13)

**Use `date` for:**
- Timestamps (created, last, published, acquired, purchased)
- Event dates (date, start, end, birthday)
- Any temporal reference point

## Universal Properties

These properties apply across multiple note types and templates:

### Core Organizational Properties

**categories** (multitext)
- Primary classification for notes
- Typically links to category pages (e.g., `[[Books]]`, `[[Movies]]`)
- Used in most templates for top-level organization

**tags** (tags)
- Flexible labeling system
- Examples: `to-read`, `daily`, `categories`
- Use for workflow states, special classifications

**topics** (multitext)
- Subject matter and themes
- Cross-references related concepts
- More specific than categories

**created** (date)
- Note creation date
- Automatically set via `{{date}}` template variable
- Used for chronological sorting and tracking

**last** (date)
- Last modified or accessed date
- Manually updated when revisiting notes
- Tracks engagement over time

**rating** (number)
- Subjective quality assessment
- Typically 1-10 scale
- Used in: books, movies, shows, recipes, products

### Metadata Properties

**cssclasses** (multitext)
- Apply custom CSS styling to notes
- Used with custom themes
- Controls visual presentation

**aliases** (aliases)
- Alternative names for the note
- Improves linking and search
- Obsidian's built-in alias system

## Template-Specific Properties

Properties organized by content type and template usage.

### Media & Entertainment

**Books** (Book Template)
- author (multitext) - Book authors
- genre (multitext) - Literary genres
- pages (number) - Page count
- isbn (number) - 10-digit ISBN
- isbn13 (number) - 13-digit ISBN
- year (number) - Publication year
- published (date) - Publication date

**Movies** (Movie Template)
- director (multitext) - Film directors
- genre (multitext) - Film genres
- runtime (number) - Duration in minutes
- year (number) - Release year
- imdbId (text) - IMDb identifier

**Shows** (Show Template, Show Episode Template)
- series (multitext) - Related series
- season (number) - Season number
- genre (multitext) - Show genres

**Music** (Album Template)
- genre (multitext) - Music genres
- year (number) - Release year

**Podcast Episodes** (Podcast Episode Template)
- speaker (multitext) - Episode speakers/guests
- guests (multitext) - Guest appearances

### People & Organizations

**People** (People Template, Contact Template)
- birthday (date) - Birth date
- role (text) - Job title or function
- phone (text) - Contact number
- twitter (text) - Twitter handle

**Companies** (Company Template)
- address (text) - Physical address
- phone (text) - Contact number

**Meetings** (Meeting Template)
- date (date) - Meeting date
- start (date) - Start time
- end (date) - End time
- guests (multitext) - Attendees

### Places & Travel

**Places** (Place Template, City Template)
- address (text) - Street address
- coordinates (multitext) - GPS coordinates
- loc (multitext) - Location references
- where (multitext) - Location descriptions

**Trips** (Trip Planning)
- start (date) - Trip start date
- end (date) - Trip end date
- where (multitext) - Destinations

**Events** (Event Template, Conference Template)
- date (date) - Event date
- start (date) - Start time
- end (date) - End time
- conference (text) - Conference name
- where (multitext) - Event location

### Products & Services

**Products** (Product Template, App Template)
- model (text) - Product model
- price (number) - Cost
- acquired (date) - Purchase date
- purchased (date) - Purchase date
- monthly-uses (number) - Usage frequency

**Real Estate** (Real Estate Template)
- sqft (number) - Square footage
- lotsqft (number) - Lot square footage
- address (text) - Property address

**Coffee** (Coffee Template)
- variety (text) - Coffee variety
- process (text) - Processing method

### Recipes & Food

**Recipes** (Recipe Template)
- cuisine (multitext) - Cuisine types
- ingredients (multitext) - Recipe ingredients
- author (multitext) - Recipe author/source

**Restaurants** (Restaurant Template)
- cuisine (multitext) - Restaurant cuisines
- address (text) - Restaurant address

### Other Domains

**Games** (Board Game Template)
- year (number) - Release year

**Posts & Content** (Post Template)
- published (date) - Publication date
- author (multitext) - Content author
- source (text) - Original source

**Projects** (Project Template)
- status (multitext) - Project status

**Stocks** (Stock Trade Template)
- shares (number) - Number of shares
- price (number) - Share price
- trade (text) - Trade details

## Property Type Selection Guide

### Single vs. Multiple Values

The key decision when defining properties is whether a note can have multiple values for that attribute.

**Choose `text` when:**
- The attribute is inherently singular (one model, one conference, one phone)
- You need to store an identifier or code
- Multiple values would be confusing or meaningless

**Choose `multitext` when:**
- Notes commonly have multiple values (books have multiple authors)
- You want to enable linking to multiple related notes
- The attribute represents a collection or set
- Future flexibility is valuable (even if current notes have one value)

### Text vs. Number for Identifiers

Some identifiers can be stored as either text or number:

**Store as `text` when:**
- Values may contain non-numeric characters
- Leading zeros are significant
- The value is an opaque identifier (imdbId)

**Store as `number` when:**
- You need to perform calculations
- Sorting numerically is important
- The value is always numeric (isbn, isbn13, year)

### Date Best Practices

**Use consistent `date` format:**
- Always YYYY-MM-DD (ISO 8601)
- Use `{{date}}` template variable for automatic insertion
- Prefer `date` over `datetime` unless time precision matters

**Semantic date properties:**
- `created`: When note was created
- `last`: When note was last modified/reviewed
- `date`: Generic date for single-date events
- `start`/`end`: For date ranges
- `published`, `acquired`, `purchased`, `birthday`: Specific semantic dates

## Extending the Property System

### Adding New Properties

When adding new property types to `.obsidian/types.json`:

1. **Analyze existing properties**: Check if a property already serves your need
2. **Choose the right type**: Follow the selection guide above
3. **Use clear naming**: Descriptive, lowercase, consistent with existing names
4. **Update this documentation**: Add the property to the reference below

**Example addition:**
```json
{
  "types": {
    // ... existing properties ...
    "license": "text",
    "contributors": "multitext",
    "downloads": "number",
    "released": "date"
  }
}
```

### Property Naming Conventions

Follow these patterns to maintain consistency:

- **Lowercase**: All property names use lowercase
- **No spaces**: Use hyphens for multi-word properties (monthly-uses, not monthlyUses)
- **Descriptive**: Clear purpose (isbn13, not isbn2)
- **Singular for single values**: model, system, process
- **Singular or plural for multi-values**: Both work (author vs. authors), but be consistent within domain

### Creating Template-Specific Properties

When designing a new template:

1. **Start with universal properties**: Include categories, created, last, tags
2. **Add domain-specific properties**: What makes this content type unique?
3. **Consider queryability**: What will you want to filter or sort by?
4. **Balance completeness and simplicity**: Not every field needs a property

**Example: Concert Template**
```yaml
---
categories:
  - "[[Concerts]]"
artist: []          # multitext - can have multiple performers
venue: ""           # text - single location
date: {{date}}      # date - when it happened
genre: []           # multitext - reuse existing property
rating: null        # number - reuse existing property
setlist: []         # multitext - new property for songs played
created: {{date}}
last: {{date}}
---
```

Then add to types.json:
```json
{
  "types": {
    // ... existing properties ...
    "artist": "multitext",
    "venue": "text",
    "setlist": "multitext"
  }
}
```

## Querying with Properties

Properties power Obsidian's built-in search and Dataview plugin queries.

### Native Search

Use property filters in Obsidian search:
```
[rating:>7]              # Notes with rating above 7
[categories:Books]       # All book notes
[created:2024-01-01]    # Notes created on specific date
[author:Kevin Kelly]     # Notes by specific author
```

### Dataview Queries

Properties enable sophisticated data views:

**List all unread books:**
```dataview
TABLE author, pages, year
FROM #to-read
WHERE contains(categories, [[Books]])
SORT year DESC
```

**Movies watched recently:**
```dataview
TABLE director, rating, year
WHERE contains(categories, [[Movies]]) AND last > date(today) - dur(30 days)
SORT last DESC
```

**Meetings by person:**
```dataview
TABLE date, topics
WHERE contains(categories, [[Meetings]]) AND contains(people, [[Steph Ango]])
SORT date DESC
```

**High-rated recipes by cuisine:**
```dataview
TABLE rating, cuisine, ingredients
WHERE contains(categories, [[Recipes]]) AND rating >= 8
SORT rating DESC, cuisine ASC
```

### Property-Based Organization

**Category pages** use properties to aggregate content:
```dataview
TABLE author, rating, pages
FROM "References"
WHERE contains(categories, [[Books]])
SORT rating DESC, last DESC
```

**Dashboard views** combine multiple properties:
```dataview
TABLE
  choice(contains(categories, [[Books]]), "📚",
  choice(contains(categories, [[Movies]]), "🎬",
  "📝")) as Type,
  rating,
  last as "Last Viewed"
WHERE rating >= 8
SORT last DESC
LIMIT 20
```

### Advanced Query Patterns

**Cross-reference by topic:**
```dataview
LIST
WHERE contains(topics, [[Emergence]])
GROUP BY categories
```

**Timeline views:**
```dataview
CALENDAR date
WHERE contains(categories, [[Events]])
```

**Aggregate statistics:**
```dataview
TABLE
  length(rows) as "Count",
  round(sum(rows.rating) / length(rows), 1) as "Avg Rating"
FROM "References"
WHERE rating != null
GROUP BY categories
```

## Complete Property Reference

All 53 properties defined in `.obsidian/types.json`, alphabetically:

| Property | Type | Used In | Description |
|----------|------|---------|-------------|
| **acquired** | date | Products | Date item was obtained |
| **address** | text | Places, Companies | Physical street address |
| **aliases** | aliases | All | Alternative names for note |
| **author** | multitext | Books, Recipes, Posts | Content creator(s) |
| **birthday** | date | People | Birth date |
| **categories** | multitext | Most templates | Primary classification |
| **conference** | text | Conference Sessions | Conference name |
| **coordinates** | multitext | Places | GPS coordinates |
| **created** | date | Most templates | Note creation date |
| **cssclasses** | multitext | All | Custom CSS classes |
| **cuisine** | multitext | Recipes, Restaurants | Culinary style |
| **date** | date | Meetings, Events | Generic date field |
| **director** | multitext | Movies | Film director(s) |
| **end** | date | Events, Meetings, Trips | End date/time |
| **genre** | multitext | Books, Movies, Shows, Music | Genre classification |
| **guests** | multitext | Meetings, Podcasts | Attendees or participants |
| **imdbId** | text | Movies | IMDb identifier |
| **ingredients** | multitext | Recipes | Recipe ingredients |
| **isbn** | number | Books | 10-digit ISBN |
| **isbn13** | number | Books | 13-digit ISBN |
| **last** | date | Most templates | Last modified/accessed date |
| **loc** | multitext | Places, Meetings | Location references |
| **lotsqft** | number | Real Estate | Lot square footage |
| **model** | text | Products | Product model |
| **monthly-uses** | number | Products, Apps | Usage frequency |
| **pages** | number | Books | Page count |
| **phone** | text | People, Companies | Phone number |
| **price** | number | Products, Stocks | Monetary value |
| **process** | text | Coffee | Processing method |
| **producer** | multitext | Media | Producer(s) |
| **published** | date | Books, Posts | Publication date |
| **purchased** | date | Products | Purchase date |
| **rating** | number | Books, Movies, Recipes | Quality rating (typically 1-10) |
| **role** | text | People | Job title or function |
| **runtime** | number | Movies, Shows | Duration in minutes |
| **season** | number | Shows | Season number |
| **series** | multitext | Shows | Related series |
| **shares** | number | Stocks | Number of shares |
| **source** | text | Posts, Clippings | Original source |
| **speaker** | multitext | Podcasts | Episode speaker(s) |
| **sqft** | number | Real Estate | Square footage |
| **start** | date | Events, Meetings, Trips | Start date/time |
| **status** | multitext | Projects | Status indicators |
| **system** | text | Products, Games | Platform or system |
| **tags** | tags | All | Flexible labels |
| **topics** | multitext | Books, Meetings | Subject matter |
| **trade** | text | Stocks | Trade details |
| **twitter** | text | People | Twitter handle |
| **variety** | text | Coffee | Coffee variety |
| **where** | multitext | Events, Trips | Location descriptions |
| **year** | number | Books, Movies, Games | Release/publication year |

## Best Practices Summary

1. **Start with universal properties**: Use categories, created, last, and tags consistently
2. **Choose types deliberately**: Consider whether multiple values make sense
3. **Think about queries**: How will you want to find and filter this content?
4. **Maintain consistency**: Follow existing naming patterns and conventions
5. **Document extensions**: Update this guide when adding new properties
6. **Keep it simple**: Only add properties that add real value
7. **Use templates**: Properties are most valuable when consistently applied
8. **Link liberally**: Use wikilinks in multitext fields to enable bidirectional discovery
9. **Review periodically**: Retire unused properties, consolidate duplicates
10. **File over app**: Remember that properties are just YAML frontmatter - stay portable

## Resources

- [Obsidian Properties Documentation](https://help.obsidian.md/Editing+and+formatting/Properties)
- [Dataview Plugin](https://blacksmithgu.github.io/obsidian-dataview/)
- [How I use Obsidian](https://stephango.com/vault) - Vault structure explanation
- Types definition: `.obsidian/types.json`
- Templates: `Templates/` folder

---

*Last updated: 2026-01-13*
