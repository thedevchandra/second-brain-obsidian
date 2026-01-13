# Base Query System Documentation

This guide explains how to use and customize `.base` files in your Obsidian vault with the Bases plugin.

## Table of Contents

1. [What are Base Files?](#what-are-base-files)
2. [Base File Structure](#base-file-structure)
3. [Creating Your First Base Query](#creating-your-first-base-query)
4. [Base Query Syntax Reference](#base-query-syntax-reference)
5. [Common Customization Examples](#common-customization-examples)
6. [Using Base Files in Category Pages](#using-base-files-in-category-pages)
7. [Advanced Techniques](#advanced-techniques)

## What are Base Files?

Base files (`.base` extension) are configuration files that work with the Obsidian Bases plugin to create dynamic, queryable views of your notes. Think of them as saved database queries that automatically filter, organize, and display your notes based on specific criteria.

### Key Benefits

- Create multiple filtered views of the same data without duplication
- Build custom dashboards for different content types (movies, books, projects)
- Automatically organize and display note properties in tables
- Filter and sort notes dynamically based on metadata
- Embed views in any note using simple transclusion syntax

### How They Work

1. A `.base` file defines filters, properties, and views
2. The Bases plugin reads these configurations
3. Views can be embedded in regular notes using the syntax: `![[filename.base#ViewName]]`
4. The plugin renders interactive tables that update automatically as your vault changes

## Base File Structure

Every `.base` file contains up to four main sections written in YAML format:

```yaml
filters:
  # Global filters that apply to all views

formulas:
  # Custom calculated properties (optional)

properties:
  # Define which note properties to display

views:
  # Define one or more table views with specific configurations
```

## Creating Your First Base Query

Let's create a simple base file to track reading progress. Create a new file called `Reading.base`:

```yaml
filters:
  and:
    - categories.contains(link("Books"))
    - '!file.name.contains("Template")'

properties:
  file.name:
    displayName: Title
  note.author:
    displayName: Author
  note.status:
    displayName: Status

views:
  - type: table
    name: Currently Reading
    filters:
      and:
        - note.status == "reading"
    order:
      - file.name
      - author
    sort:
      - property: file.name
        direction: ASC
```

### What This Does

- **Global filters**: Shows only notes categorized as "Books" and excludes templates
- **Properties**: Displays the note name, author, and reading status
- **View**: Creates a table called "Currently Reading" that shows only books with status "reading"

### Using It

In any note, embed the view with:

```markdown
![[Reading.base#Currently Reading]]
```

## Base Query Syntax Reference

### Filters Section

Filters determine which notes appear in your query results. Filters can be combined using logical operators.

#### Basic Filter Syntax

```yaml
filters:
  and:
    - condition1
    - condition2
  or:
    - condition3
    - condition4
```

#### Common Filter Conditions

| Filter | Description | Example |
|--------|-------------|---------|
| `categories.contains(link("Name"))` | Notes with specific category | `categories.contains(link("Movies"))` |
| `file.name.contains("text")` | File name contains text | `file.name.contains("2024")` |
| `!condition` | Negate a condition | `!file.name.contains("Template")` |
| `note.property == value` | Property equals value | `note.status == "active"` |
| `note.property.isEmpty()` | Property has no value | `note.rating.isEmpty()` |
| `note.property > value` | Numeric comparison | `note.rating > 7` |
| `list(property).contains(this)` | Check if list contains current note | `list(cast).contains(this)` |
| `file.links.contains(this.file)` | Note links to current file | `file.links.contains(this.file)` |
| `file.hasLink(this)` | File has link to current note | `file.hasLink(this)` |

#### Filter Operators

- `==` - Equal to
- `!=` - Not equal to
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal to
- `<=` - Less than or equal to

### Properties Section

Properties define which note attributes to display and how to label them.

```yaml
properties:
  file.name:
    displayName: Title
  note.customProperty:
    displayName: Custom Label
```

#### Built-in Properties

- `file.name` - The note's file name
- `file.path` - Full file path
- `file.links` - Links in the note
- `file.backlinks` - Notes linking to this one
- `file.tags` - File tags
- `note.propertyName` - Any frontmatter property

### Views Section

Views define how data is displayed. Each view creates a separate table with its own filters, sorting, and layout.

```yaml
views:
  - type: table
    name: ViewName
    filters:
      and:
        - viewSpecificFilter
    order:
      - property1
      - property2
    sort:
      - property: property1
        direction: ASC
      - property: property2
        direction: DESC
    limit: 20
    columnSize:
      note.property1: 200
      note.property2: 150
```

#### View Properties Explained

| Property | Description | Required |
|----------|-------------|----------|
| `type` | Always "table" | Yes |
| `name` | View name for embedding | Yes |
| `filters` | Additional filters for this view only | No |
| `order` | Which properties to show and in what order | Yes |
| `sort` | How to sort results | No |
| `limit` | Maximum number of results | No |
| `columnSize` | Column widths in pixels | No |

#### Sort Directions

- `ASC` - Ascending (A to Z, 0 to 9, oldest to newest)
- `DESC` - Descending (Z to A, 9 to 0, newest to oldest)

### Formulas Section (Advanced)

Formulas allow you to create calculated properties that don't exist in your notes.

```yaml
formulas:
  FormulaName: expression
  AnotherFormula: complex.expression.here
```

Use formulas in properties and filters by referencing them as `formula.FormulaName`.

## Common Customization Examples

### Example 1: Movie Collection with Multiple Views

See the complete example in `/Users/devchandra/Documents/GitHub/second-brain-obsidian/Templates/Bases/Movies.base`.

Key features demonstrated:
- Multiple views for different purposes (All, To-watch, Favorites, Last seen)
- View-specific filters to segment data
- Custom column widths for optimal display
- Multi-level sorting
- Dynamic filtering based on actors, directors, and genres

```yaml
# Excerpt showing key patterns
views:
  - type: table
    name: To-watch
    filters:
      and:
        - last.isEmpty()           # Haven't watched yet
        - rating.isEmpty()         # Not rated
    sort:
      - property: scoreImdb
        direction: DESC            # Highest rated first
      - property: watchlist
        direction: DESC            # Most recently added first
```

### Example 2: Project Tracker

Track project status and organize by type:

```yaml
filters:
  and:
    - note.categories.contains(link("Projects"))
    - '!file.name.contains("Template")'

properties:
  file.name:
    displayName: Project
  note.status:
    displayName: Status
  note.type:
    displayName: Type
  note.year:
    displayName: Year

views:
  - type: table
    name: Active Projects
    filters:
      and:
        - note.status == "active"
    order:
      - file.name
      - type
      - year
    sort:
      - property: note.year
        direction: DESC

  - type: table
    name: By Type
    filters:
      and:
        - note.type == this.note.type
    order:
      - file.name
      - status
      - year
    sort:
      - property: note.status
        direction: ASC
```

### Example 3: Meeting Notes by Person

Create personalized views of meetings:

```yaml
filters:
  and:
    - categories.contains(link("Meetings"))
    - '!file.name.contains("Template")'

properties:
  file.name:
    displayName: Meeting
  note.date:
    displayName: Date
  note.people:
    displayName: Attendees
  note.type:
    displayName: Type

views:
  - type: table
    name: Recent Meetings
    order:
      - file.name
      - date
      - people
      - type
    sort:
      - property: date
        direction: DESC
    limit: 20

  - type: table
    name: Person
    filters:
      and:
        - list(people).contains(this)  # Meetings with current person
    order:
      - file.name
      - date
      - type
    sort:
      - property: date
        direction: DESC
```

### Example 4: Related Notes Finder

Find related notes based on shared links and tags:

```yaml
filters:
  and:
    - file.path != this.file.path

formulas:
  LinksOverlap: formula.Related.length
  Related: list(this.file.links).filter(list(file.links).containsAny(value)).unique()
  BacklinksCount: file.backlinks.length
  TagsOverlap: list(this.file.tags).filter(list(file.tags).containsAny(value)).unique().length

properties:
  file.name:
    displayName: Note
  formula.LinksOverlap:
    displayName: Shared Links
  formula.TagsOverlap:
    displayName: Shared Tags
  formula.BacklinksCount:
    displayName: Backlinks

views:
  - type: table
    name: Related
    filters:
      or:
        - formula.LinksOverlap > 2
        - file.hasLink(this)
        - this.file.hasLink(file)
    order:
      - file.name
      - formula.LinksOverlap
      - formula.TagsOverlap
    sort:
      - property: formula.LinksOverlap
        direction: DESC
    limit: 20
```

### Example 5: Book Reading by Author

```yaml
filters:
  and:
    - categories.contains(link("Books"))
    - '!file.name.contains("Template")'

properties:
  file.name:
    displayName: Title
  note.author:
    displayName: Author
  note.year:
    displayName: Published
  note.rating:
    displayName: My Rating
  note.genre:
    displayName: Genre

views:
  - type: table
    name: All Books
    order:
      - file.name
      - author
      - year
      - rating
    sort:
      - property: file.name
        direction: ASC

  - type: table
    name: Top Rated
    filters:
      and:
        - note.rating >= 8
    order:
      - file.name
      - rating
      - author
    sort:
      - property: rating
        direction: DESC

  - type: table
    name: Author
    filters:
      and:
        - list(author).contains(this)
    order:
      - file.name
      - year
      - rating
    sort:
      - property: year
        direction: DESC
```

## Using Base Files in Category Pages

Base files work seamlessly with category pages to create organized collection views.

### The Pattern

1. Create a category note in the `Categories` folder (e.g., `Categories/Movies.md`)
2. Create a corresponding base file in `Templates/Bases` (e.g., `Templates/Bases/Movies.base`)
3. Embed specific views from the base file into the category page

### Example: Movies Category Page

File: `Categories/Movies.md`

```markdown
---
tags:
  - categories
---

## Favorites

![[Movies.base#Favorites]]

## Last seen

![[Movies.base#Last seen]]
```

### How It Works

1. The category page acts as a dashboard
2. Each embed (`![[Movies.base#ViewName]]`) pulls in a specific view
3. Views automatically update when notes are added or modified
4. Users see organized tables without writing queries

### Best Practices

- Use descriptive view names that clearly indicate what they show
- Start with 1-3 most important views on category pages
- Keep global filters in the base file, view-specific filters in views
- Use consistent property names across related base files
- Test views in the base file before embedding them

## Advanced Techniques

### Multi-level Sorting

Sort by multiple properties to create sophisticated orderings:

```yaml
sort:
  - property: note.status
    direction: ASC          # Active projects first
  - property: note.priority
    direction: DESC         # Then by priority
  - property: note.year
    direction: DESC         # Then by newest year
  - property: file.name
    direction: ASC          # Finally alphabetically
```

### Contextual Views with "this"

Create views that adapt to the current note context:

```yaml
# Show movies by the same director as the current note
views:
  - type: table
    name: Director
    filters:
      and:
        - list(director).contains(this)
```

When embedded in a director's note, this view shows all movies by that director.

### Empty and Non-Empty Checks

Filter based on whether properties have values:

```yaml
filters:
  and:
    - note.rating.isEmpty()        # No rating assigned
    - '!note.watchlist.isEmpty()'  # But is on watchlist
```

### Combining AND and OR Logic

Create complex filter conditions:

```yaml
filters:
  and:
    - categories.contains(link("Movies"))
    - or:
        - note.rating > 8
        - note.watchlist.contains("Must Watch")
```

This shows movies that are either highly rated OR marked as must-watch.

### Custom Column Widths

Optimize table layout by setting specific column widths:

```yaml
columnSize:
  file.name: 283          # Wide column for titles
  note.year: 68           # Narrow for years
  note.rating: 94         # Medium for ratings
  note.director: 238      # Wide for names
```

### Limited Results

Show only top N results:

```yaml
views:
  - type: table
    name: Top 10
    sort:
      - property: note.rating
        direction: DESC
    limit: 10
```

## Troubleshooting

### View Not Showing Results

1. Check that global filters match your notes
2. Verify property names match your frontmatter exactly (case-sensitive)
3. Ensure view-specific filters aren't too restrictive
4. Test filter conditions individually

### Properties Not Displaying

1. Confirm property names use `note.` prefix for frontmatter properties
2. Check for typos in property names
3. Verify notes have the properties you're querying
4. Use `file.name` not `note.name` for file names

### Sort Not Working

1. Ensure property name in sort matches property name in properties section
2. Check direction is either `ASC` or `DESC` (case-sensitive)
3. For custom formulas, use `formula.FormulaName` in sort

### Embed Not Rendering

1. Verify view name exactly matches (case-sensitive)
2. Check base file is in correct location
3. Ensure embed syntax is correct: `![[filename.base#ViewName]]`
4. Confirm Bases plugin is installed and enabled

## Tips for Success

1. Start simple - Create basic views first, add complexity gradually
2. Use consistent naming - Follow patterns like "Template" for templates
3. Test incrementally - Test each filter and sort as you build
4. Document your views - Use descriptive view names that explain what they show
5. Leverage examples - Study existing base files like Movies.base for patterns
6. Keep backups - Base files are code; version control them if possible
7. Organize properties - List properties in the order you want columns to appear by default

## Next Steps

1. Explore existing base files in `Templates/Bases/` for more examples
2. Create a simple base file for a content type you track
3. Experiment with different view configurations
4. Build category pages that showcase your base file views
5. Share useful patterns with your team or community

## Additional Resources

- Bases Plugin Documentation: Check Obsidian community plugins page
- YAML Syntax: Learn YAML formatting if queries look unfamiliar
- Dataview Plugin: Some filter syntax parallels Dataview queries
- Example Files: Browse all `.base` files in this directory for patterns
