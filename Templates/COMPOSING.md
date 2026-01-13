# Template Composability Guide

Template composability allows you to combine multiple template structures into a single note, creating flexible and reusable documentation patterns. This guide explains when and how to compose templates effectively.

## What is Template Composition?

Template composition is the practice of combining properties and content from multiple templates into one note. Instead of creating a separate template for every possible role combination, you can merge existing templates to capture the full scope of a person's activities or an entity's characteristics.

### Real-World Examples

- A person who is both an actor and director (Clint Eastwood, Greta Gerwig)
- A musician who is also an author (Patti Smith, Nick Cave)
- A director who also writes books (Werner Herzog)
- An actor who is also a musician (Janelle Monáe)

## How Template Composition Works

### Basic Structure

Templates are composed by combining their frontmatter properties and content sections. Each template contributes specific properties and query sections that work together in the final note.

### Property Inheritance

When composing templates, properties from each template are merged into a single frontmatter block. Here's how different property types combine:

#### Single-Value Properties
If templates have unique properties, they are all included:

```yaml
# Actor Template contributes
categories: "[[People]]"

# Director Template contributes
created: {{date}}

# Combined result
categories: "[[People]]"
created: {{date}}
```

#### Array Properties
Array properties are merged into a single array:

```yaml
# Actor Template
type:
  - "[[Actors]]"

# Director Template
type:
  - "[[Directors]]"

# Combined result
type:
  - "[[Actors]]"
  - "[[Directors]]"
```

#### Overlapping Properties
When the same property appears in multiple templates, use the most specific or comprehensive value. The base People template is often the foundation.

## Practical Composition Examples

### Example 1: Actor + Director

For someone like Clint Eastwood who both acts in and directs films:

```yaml
---
categories:
  - "[[People]]"
type:
  - "[[Actors]]"
  - "[[Directors]]"
birthday:
org: []
created: {{date}}
---

## Movies

### As Actor

![[Movies.base#Actor]]

### As Director

![[Movies.base#Director]]

## Meetings

![[Meetings.base#Person]]
```

**Properties Merged:**
- `categories` from People Template (base)
- `type` array combines Actor and Director types
- `birthday` and `org` from People Template
- `created` date field
- Content sections separated by role

### Example 2: Musician + Author

For someone like Patti Smith who creates both music and literature:

```yaml
---
categories: "[[People]]"
type:
  - "[[Musicians]]"
  - "[[Authors]]"
birthday:
org: []
created: {{date}}
---

## Albums

![[Albums.base#Artist]]

## Books

![[Books.base#Author]]

## Meetings

![[Meetings.base#Person]]
```

**Properties Merged:**
- Base People properties
- `type` array lists both roles
- Separate content sections for each creative output

### Example 3: Actor + Musician

For performers like Janelle Monáe who work across both film and music:

```yaml
---
categories: "[[People]]"
type:
  - "[[Actors]]"
  - "[[Musicians]]"
birthday:
org: []
created: {{date}}
---

## Movies

![[Movies.base#Actor]]

## Albums

![[Albums.base#Artist]]

## Meetings

![[Meetings.base#Person]]
```

### Example 4: Triple Role - Actor + Director + Author

For multi-talented individuals like Werner Herzog:

```yaml
---
categories:
  - "[[People]]"
type:
  - "[[Actors]]"
  - "[[Directors]]"
  - "[[Authors]]"
birthday:
org: []
created: {{date}}
---

## Movies

### As Director

![[Movies.base#Director]]

### As Actor

![[Movies.base#Actor]]

## Books

![[Books.base#Author]]

## Meetings

![[Meetings.base#Person]]
```

## Content Organization Strategies

### Strategy 1: Role-Based Sections

Organize content by the person's different roles, making it easy to see their contributions in each area:

```markdown
## Movies
### As Actor
[Actor query]

### As Director
[Director query]

## Music
[Musician query]
```

### Strategy 2: Chronological Integration

For notes where timeline matters more than role separation, you might integrate sections chronologically or thematically rather than by template.

### Strategy 3: Primary Role Focus

If one role is primary and others are secondary, structure the note to emphasize the main role:

```markdown
## Films (Primary Focus)
[Extensive film content]

## Music (Secondary)
[Brief music content]

## Other Work
[Additional contributions]
```

## When to Use Composition vs. New Template

### Use Template Composition When:

1. **The combination is uncommon or unique**
   - Creating a note for one specific person with multiple roles
   - The role combination varies between individuals

2. **Roles are independent but co-exist**
   - Being an actor doesn't affect being a musician
   - Each role has distinct properties and queries

3. **You want flexibility**
   - Different people have different combinations
   - Roles may be added or removed over time

4. **The base template is sufficient**
   - People Template provides core person properties
   - Role-specific templates add specialized sections

### Create a New Template When:

1. **The combination is common and standardized**
   - Many individuals share this exact role combination
   - The pattern repeats frequently in your vault

2. **Roles are deeply integrated**
   - Properties interact in complex ways
   - Queries need to combine data from both roles

3. **You need custom properties**
   - The combination requires unique properties not in either template
   - Specific fields only make sense for the combination

4. **Consistency is critical**
   - Everyone with this combination should have identical structure
   - Reduces manual composition errors

## Composition Best Practices

### 1. Start with the Base Template

Always begin with the most general template (e.g., People Template) and add specialized roles:

```yaml
Base: People Template
+ Actor Template properties
+ Director Template properties
= Actor-Director composed note
```

### 2. Maintain Property Order

Keep frontmatter organized for readability:

```yaml
---
# Identification
categories:
type:

# Personal Information
birthday:
org:

# Metadata
created:
---
```

### 3. Use Clear Section Headers

Make role-based sections obvious:

```markdown
## Movies

### As Actor
[Content]

### As Director
[Content]
```

### 4. Document the Composition

Add a comment or note indicating which templates were composed:

```yaml
---
# Composed from: People + Actor + Director templates
categories:
  - "[[People]]"
type:
  - "[[Actors]]"
  - "[[Directors]]"
---
```

### 5. Test Queries

Verify that embedded queries work correctly with the composed properties:
- Check that `type` arrays filter correctly
- Ensure dataview queries find the note
- Confirm all embedded blocks display expected content

## Common Composition Patterns

### People-Based Compositions

All creative role templates extend from People Template:

```
People Template (base)
├── + Actor Template
├── + Director Template
├── + Author Template
├── + Musician Template
└── + Any combination of the above
```

### Property Composition Matrix

| Template | Categories | Type | Birthday | Org | Created |
|----------|-----------|------|----------|-----|---------|
| People | [[People]] | - | ✓ | ✓ | ✓ |
| Actor | [[People]] | [[Actors]] | - | - | - |
| Director | [[People]] | [[Directors]] | - | - | ✓ |
| Author | [[People]] | [[Authors]] | - | - | - |
| Musician | [[People]] | [[Musicians]] | - | - | ✓ |

**Composition Rule:** Merge `type` arrays, include all unique properties.

## Troubleshooting Composed Templates

### Query Not Finding the Note

**Problem:** Embedded queries return no results.

**Solution:** Check that the `type` property includes all necessary values:

```yaml
type:
  - "[[Actors]]"  # Required for Movies.base#Actor
  - "[[Directors]]"  # Required for Movies.base#Director
```

### Duplicate Content Sections

**Problem:** The same content appears multiple times.

**Solution:** Ensure you're not including redundant embedded blocks. Use role-specific query blocks only once.

### Property Conflicts

**Problem:** Same property name with different formats.

**Solution:** Standardize on one format. Arrays are more flexible than single values:

```yaml
# Prefer this
categories:
  - "[[People]]"

# Over this (if you might add more categories)
categories: "[[People]]"
```

### Section Organization Confusion

**Problem:** Unclear which sections belong to which role.

**Solution:** Use explicit subsection headers:

```markdown
## Creative Work

### Film Acting
[Actor content]

### Film Directing
[Director content]

### Writing
[Author content]
```

## Advanced Composition Techniques

### Conditional Sections

For notes where certain sections only apply sometimes, use clear conditional markers:

```markdown
## Music Career
<!-- Only for individuals with music background -->

![[Albums.base#Artist]]

## Literary Works
<!-- Only for published authors -->

![[Books.base#Author]]
```

### Dynamic Type Assignment

Let the `type` array drive which sections appear rather than manually adding all sections:

```yaml
---
type:
  - "[[Actors]]"
  - "[[Directors]]"
---

## Filmography

dataview
TABLE role as Role, title as Title
FROM "Movies"
WHERE contains(actors, this.file.link) OR director = this.file.link
```

### Linked Template Composition

Reference related templates for complex entities:

```markdown
## Related People

Primary collaborators: [[linked-person-1]], [[linked-person-2]]
These notes also use composed templates.
```

## Summary

Template composition provides flexibility for capturing complex, multi-faceted entities without creating redundant templates. Use composition when roles are independent and combinations vary between notes. Create new templates when patterns are standardized and frequently repeated.

The key principles:
1. Build on base templates (e.g., People)
2. Merge properties thoughtfully (arrays for multi-values)
3. Organize content by role or chronology
4. Test queries to ensure proper filtering
5. Choose composition vs. new templates based on frequency and standardization needs

With these guidelines, you can create rich, interconnected notes that capture the full complexity of people and entities in your knowledge base.
