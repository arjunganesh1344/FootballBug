# Writing Articles

Articles are plain MDX files. No database, no CMS — just drop a file in the right folder and it appears on the site.

## Where to put your file

| Section | Folder | URL |
|---|---|---|
| Film breakdowns | `content/film/` | `/film/your-slug` |
| Data/stats | `content/data/` | `/data/your-slug` |

The filename becomes the URL slug. `my-article.mdx` → `/film/my-article`.

## File format

Every article starts with a frontmatter block, then your content:

```mdx
---
title: "Your Article Title"
date: "2026-05-16"
description: "One sentence shown on the article card."
tags: ["tag1", "tag2"]
---

## First Section

Write in standard Markdown. **Bold**, *italic*, `inline code`, lists, etc. all work.
```

All four frontmatter fields are required — missing ones will show as blank on the site.

## Example

To add a film breakdown, create `content/film/chiefs-run-game.mdx`:

```mdx
---
title: "How the Chiefs Are Hiding Their Run Game"
date: "2026-05-16"
description: "Andy Reid is using pre-snap motion to disguise inside zone and it's working."
tags: ["chiefs", "run-game", "scheme"]
---

## The Problem

Defenses can't key on the back...
```

That's it. Refresh the site and it shows up.
