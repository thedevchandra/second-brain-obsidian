	# Templates Index

This directory contains 52 templates organized by category to help you create consistent, well-structured notes in your Obsidian vault. Templates define metadata fields and structure for different types of content you want to track.

## Quick Start Guide

### Using Templates

1. **Install the Templater Plugin**: Templates use the `{{date}}` syntax which requires the Templater community plugin
2. **Create a New Note**: Create a new note in your vault
3. **Insert Template**: Use Obsidian's "Insert template" command or Templater hotkey
4. **Select Template**: Choose the appropriate template from the list
5. **Fill in Metadata**: Complete the frontmatter fields and add your content

### Template Structure

Every template includes:
- **Frontmatter**: YAML metadata between `---` markers
- **Categories**: Links to category pages (e.g., `[[Movies]]`, `[[Books]]`)
- **Fields**: Structured data specific to the content type
- **Date Placeholders**: `{{date}}` auto-populates with current date
- **Base Embeds**: Some templates reference base files for dynamic content

### Naming Convention

Templates follow a consistent naming pattern:
- **Primary Templates**: `[Type] Template.md` (e.g., Movie Template, Book Template)
- **Specialized Subtypes**: More specific versions of primary templates (e.g., Restaurant Template extends Place Template)
- **Meta Templates**: Define categories or types (e.g., Genre Template, Place Type Template)
- **Time-based Templates**: For periodic notes (Daily, Monthly)

---

## Templates by Category

### 📺 Media & Entertainment

#### Movies & TV
- **Movie Template** - Track films you watch
  - Fields: genre, director, cast, runtime, rating, year, imdbId
  - Use for: Movie reviews, watchlist items
  - Categories: `[[Movies]]`

- **Movie Genre Template** - Organize movie genres
  - Use for: Creating genre category pages
  - Base: `![[Genre.base]]`

- **Show Template** - Track TV series
  - Fields: genre, creator, cast, seasons, rating, year
  - Use for: TV show notes, episode tracking
  - Categories: `[[Shows]]`

- **Show Episode Template** - Individual episodes
  - Fields: show, season, episode, air_date, rating
  - Use for: Detailed episode notes and reviews
  - Categories: `[[Shows]]`

#### Music
- **Album Template** - Music album tracking
  - Fields: artist, genre, year, rating, label
  - Use for: Album reviews, music collection
  - Categories: `[[Albums]]`

- **Musician Template** - Artist profiles
  - Fields: genre, instruments, active_years
  - Use for: Artist biographies, discographies
  - Categories: `[[People]]`

- **Music Genre Template** - Organize music genres
  - Use for: Creating music genre category pages
  - Base: `![[Genre.base]]`

#### Books & Written Content
- **Book Template** - Book tracking and reviews
  - Fields: author, genre, pages, isbn, year, rating, topics
  - Use for: Reading list, book reviews
  - Categories: `[[Books]]`
  - Default tags: `to-read`

- **Author Template** - Writer profiles
  - Fields: genre, nationality, birth_year
  - Use for: Author biographies, works tracking
  - Categories: `[[People]]`

#### Podcasts
- **Podcast Template** - Podcast series
  - Fields: host, rating
  - Use for: Podcast discovery, favorites tracking
  - Categories: `[[Podcasts]]`
  - Embeds: Episode list

- **Podcast Episode Template** - Individual episodes
  - Fields: podcast, episode_number, air_date, guests, topics
  - Use for: Episode notes, key takeaways
  - Categories: `[[Podcast episodes]]`

#### Games
- **Video Game Template** - Video game tracking
  - Fields: maker, genre, year, system, rating
  - Use for: Gaming library, reviews
  - Categories: `[[Games]]`

- **Board Game Template** - Board game collection
  - Fields: designer, players, playtime, complexity, rating
  - Use for: Board game library, session planning
  - Categories: `[[Board games]]`

- **Video Game Genre Template** - Game genre classification
  - Use for: Creating game genre category pages
  - Base: `![[Genre.base]]`

- **Game Studio Template** - Game developer profiles
  - Fields: founded, headquarters, notable_games
  - Use for: Studio research, game development tracking
  - Categories: `[[Companies]]`

#### General Genre Classification
- **Genre Template** - Universal genre organizer
  - Use for: Creating any genre category page
  - Base: `![[Genre.base]]`

---

### 👥 People & Organizations

- **People Template** - General contact information
  - Fields: phone, twitter, org
  - Use for: Personal contacts, networking
  - Categories: `[[People]]`

- **Contact Template** - Formal business contacts
  - Fields: email, phone, company, role, location
  - Use for: Professional networking, CRM
  - Categories: `[[People]]`

- **Actor Template** - Actor and performer profiles
  - Fields: filmography, awards, birth_date
  - Use for: Actor research, casting notes
  - Categories: `[[People]]`

- **Director Template** - Film/TV director profiles
  - Fields: notable_works, awards, style
  - Use for: Director research, film analysis
  - Categories: `[[People]]`

- **Company Template** - Organization profiles
  - Fields: industry, founded, headquarters, size
  - Use for: Business research, vendor tracking
  - Categories: `[[Companies]]`

---

### 📍 Places & Locations

- **Place Template** - General location tracking
  - Fields: type, loc (location), rating
  - Use for: Any place you want to remember
  - Categories: `[[Places]]`

- **Place Type Template** - Location categories
  - Use for: Defining place types (parks, museums, etc.)
  - Categories: `[[Places]]`

- **Restaurant Template** - Restaurant reviews
  - Fields: type (set to Restaurants), loc, rating
  - Use for: Restaurant reviews, food recommendations
  - Categories: `[[Places]]`
  - Subtype: `[[Restaurants]]`

- **City Template** - City profiles
  - Fields: country, population, visited_date
  - Use for: Travel planning, city guides
  - Categories: `[[Places]]`

- **Real Estate Template** - Property tracking
  - Fields: address, price, size, type, status
  - Use for: House hunting, real estate investment
  - Categories: `[[Places]]`

---

### 🎯 Activities & Events

- **Meeting Template** - Meeting notes
  - Fields: type, date, org, loc, people, topics
  - Use for: Meeting minutes, action items
  - Categories: `[[Meetings]]`

- **Meeting Type Template** - Meeting categories
  - Use for: Defining meeting types (1-on-1, standup, etc.)
  - Categories: `[[Meetings]]`

- **Meetings List Template** - Meeting overview
  - Use for: Aggregating all meetings
  - Base: `![[Meetings.base]]`

- **Event Template** - General events
  - Fields: date, location, attendees, type
  - Use for: Conferences, workshops, social events
  - Categories: `[[Events]]`

- **Conference Template** - Conference attendance
  - Fields: type (Conferences), series, start, end, loc
  - Use for: Conference notes, session planning
  - Categories: `[[Events]]`
  - Tags: `events`, `conferences`

- **Conference Session Template** - Individual sessions
  - Fields: conference, speaker, time, track, topics
  - Use for: Session notes, speaker insights
  - Categories: `[[Events]]`

- **Trip Template** - Travel planning and logs
  - Fields: start_date, end_date, destination, travelers, budget
  - Use for: Trip planning, travel journals
  - Categories: `[[Trips]]`

- **Job Interview Template** - Interview tracking
  - Fields: company, position, date, interviewer, stage
  - Use for: Job search organization, interview prep
  - Tags: `interview`, `career`

- **Meditation Template** - Meditation sessions
  - Fields: created, loc, topics
  - Use for: Meditation journaling, mindfulness tracking
  - Categories: `[[Meditations]]`
  - Tags: `note`, `journal`, `meditation`

---

### 📝 Content & Knowledge

#### Notes & Writing
- **Journal Template** - Personal journal entries
  - Fields: created
  - Use for: Daily journaling, personal reflections
  - Tags: `note`, `journal`

- **Evergreen Template** - Permanent notes
  - Fields: created
  - Use for: Knowledge building, Zettelkasten method
  - Tags: `0🌲` (evergreen indicator)

- **Post Template** - Blog posts and articles
  - Fields: published, url, topics, status
  - Use for: Blog post drafts, article archive
  - Categories: `[[Posts]]`

- **Clipping Template** - Web clippings and highlights
  - Fields: url, source, author, clipped_date
  - Use for: Saving web content, research notes
  - Categories: `[[Clippings]]`

- **Quote Template** - Memorable quotes
  - Fields: author, source, context, topics
  - Use for: Quote collection, inspiration
  - Tags: `quote`

- **Email Template** - Important email tracking
  - Fields: from, to, date, subject, thread_id
  - Use for: Email archiving, correspondence tracking
  - Tags: `email`

#### Time-based Notes
- **Daily Note Template** - Daily notes
  - Use for: Daily planning, logs
  - Base: `![[Daily.base]]`
  - Tags: `daily`

- **Monthly Note Template** - Monthly summaries
  - Fields: month, year
  - Use for: Monthly reviews, goal tracking
  - Tags: `monthly`

---

### 🛠️ Projects & Products

- **Project Template** - Project tracking
  - Fields: type, org, start, year, url, status
  - Use for: Personal/work projects, initiatives
  - Categories: `[[Projects]]`

- **Product Template** - Product information
  - Fields: type, manufacturer, price, purchased_date, rating
  - Use for: Purchase tracking, product reviews
  - Categories: `[[Products]]`

- **Product Type Template** - Product categories
  - Use for: Defining product types (electronics, tools, etc.)
  - Categories: `[[Products]]`

- **App Template** - Software application tracking
  - Fields: developer, platform, price, version, rating
  - Use for: App reviews, software recommendations
  - Categories: `[[Products]]`

- **Hosting Template** - Web hosting services
  - Fields: provider, plan, cost, renewal_date, domains
  - Use for: Infrastructure tracking, hosting management
  - Tags: `hosting`, `infrastructure`

---

### 🍽️ Food & Lifestyle

- **Recipe Template** - Cooking recipes
  - Fields: cuisine, servings, prep_time, cook_time, ingredients, instructions
  - Use for: Recipe collection, meal planning
  - Categories: `[[Recipes]]`

- **Food Template** - General food notes
  - Fields: type, cuisine, ingredients, rating
  - Use for: Food discoveries, taste notes
  - Tags: `food`

- **Coffee Template** - Coffee tasting notes
  - Fields: maker, producer, country, variety, process, rating
  - Use for: Coffee reviews, brewing notes
  - Categories: `[[Coffee]]`

---

### 💼 Finance

- **Stock Trade Template** - Stock transactions
  - Fields: date, trade, price, shares
  - Use for: Investment tracking, portfolio management
  - Tags: `investment`, `trade`

---

## Relationship to Categories and Bases

### Categories
Templates link to **category pages** in the `/Categories` directory through the `categories` frontmatter field. Category pages aggregate all notes of that type.

**Example**: Movie Template links to `[[Movies]]` category, which displays all movie notes.

**Available Categories**:
- Albums, Board games, Books, Clippings, Companies, Events, Evergreen, Games, Journal, Meetings, Movies, People, Places, Podcast episodes, Podcasts, Posts, Products, Projects, Recipes, Shows, Trips

### Bases
Some templates embed **base files** from `/Templates/Bases` directory using the `![[Base.name]]` syntax. Bases provide dynamic content like filtered lists, maps, and related items.

**Example**: Daily Note Template embeds `![[Daily.base]]` to show daily task lists and backlinks.

**Available Bases** (30 total):
- Albums.base, Attachments.base, Backlinks.base, Board games.base, Books.base, Clippings.base, Companies.base, Daily.base, Events.base, Evergreen.base, Everything.base, Games.base, Genre.base, Journal.base, Map.base, Meetings.base, Movies.base, People.base, Places.base, Podcast episodes.base, Podcasts.base, Posts.base, Products.base, Projects.base, Ratings.base, Recipes.base, Related.base, Shows.base, Templates.base, Trips.base

---

## Customization Tips

### Modifying Templates
1. Edit the template file directly to add/remove fields
2. Update corresponding category pages if needed
3. Consider creating new base files for complex queries

### Creating New Templates
1. Start with a similar existing template
2. Define relevant frontmatter fields
3. Link to appropriate category pages
4. Add tags for filtering and discovery

### Field Types
- **Text**: Single line values (e.g., `title: "Movie Name"`)
- **Arrays**: Multiple values (e.g., `cast: [Actor1, Actor2]`)
- **Links**: Obsidian links (e.g., `[[Person Name]]`)
- **Dates**: Use `{{date}}` placeholder for auto-population
- **Numbers**: Ratings, counts, prices (e.g., `rating: 8`)

---

## Related Resources

- **Categories Directory**: `/Categories` - View aggregated notes by type
- **Bases Directory**: `/Templates/Bases` - Dynamic content queries
- **Main README**: `/README.md` - Overall vault structure

For detailed explanation of the vault philosophy, see [How I use Obsidian](https://stephango.com/vault).
