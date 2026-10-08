---
title: "I Built This Blog a Hatena-Style Calendar, and Locked My Own JSON In a Box"
date: 2026-08-22T09:00:00+08:00
description: "A record of building a Hatena-Blog-style calendar, tag cloud, and monthly jump buttons into this blog's own sidebar - including tracking down why the calendar silently failed to render, caused by Hugo's html/template auto-escaping mangling an inline JSON blob."
lang: "en"
altUrl: "/ja/archive/2026-08-22-sidebar-calendar/"
altLabel: "日本語"
tags: ["side projects", "debugging"]
---

Last time, I wrote about shipping a Singlish glossary site alongside this blog. Back to the blog itself this time - a record of building its sidebar.

## The post list and archive page weren't quite enough

This blog runs on Hugo + PaperMod. At first the header just had two menu items: "Posts" and "Archive." As the post count grows, being able to browse by date or tag helps. PaperMod is a single-column theme though - there's no concept of a sidebar built in. The content column is fixed at a max width (`--nav-width: 1024px`) and centered, so on a wide screen there's blank space on either side. I figured something could go there.

## First pass: just two buttons

PaperMod ships an empty hook partial called `extend_footer.html` - override it and you can inject arbitrary HTML at the end of every page. There's also a convention where any CSS file dropped in `assets/css/extended/*.css` gets auto-concatenated into the theme's stylesheet. Using both, I added two fixed pill buttons in the right margin: "📅 By date" linking to `/archives/`, and "🏷️ By tag" linking to `/tags/`. Just shortcuts, nothing more.

## Looking at Hatena Blog, I decided to rebuild it

Plain buttons felt thin. Hatena Blog's sidebar has an actual month-grid calendar with post days highlighted, and a tag cloud with names and counts sitting right there. I wanted that instead.

The tag cloud was easy - PaperMod's own `/tags/` page (`taxonomy.html`) already does exactly this, so I borrowed its logic directly:

```gotemplate
{{ range $tagsPage.Data.Terms.Alphabetical }}
  {{ with site.GetPage (printf "/tags/%s" .Name) }}
    <a href="{{ .Permalink }}">{{ .LinkTitle }} ({{ $count }})</a>
  {{ end }}
{{ end }}
```

The calendar took more thought since this is a static site generator. At build time, I embed each language's post dates, titles, and URLs as JSON inside the page (`{{ $calItems | jsonify }}`), then render the month grid with plain vanilla JS. No external library.

## The calendar rendered nothing

I shipped it, and the tag cloud showed up fine - but the calendar area was just blank. The prev/next (‹ ›) buttons appeared; no day grid, no month title.

Checking the actual rendered HTML in devtools, I found this:

```html
<script type="application/json" id="quick-cal-data">"[{\"date\":\"2026-08-21\",\"...\"}]"</script>
```

The whole array had been escaped and wrapped in quotes **as a string**. Feed that into `JSON.parse()` and you get back a single string, not an array. The `.forEach()` right after it obviously doesn't exist on a string, so it threw and halted the rest of the script.

The cause was Hugo's template engine (`html/template`). When you interpolate a value inside a `<script>` tag, Hugo automatically treats it as untrusted and escapes it as a JS string literal. `jsonify` returns a plain `string`, so Hugo wrapped the whole thing in quotes rather than trusting it as raw JS.

The fix was one line - pipe it through `safeJS` to tell Hugo explicitly that this JS is safe to pass through as-is:

```gotemplate
{{ $calItems | jsonify | safeJS }}
```

With that, the JSON landed as a real array again, and the calendar started working.

## Adding monthly jump buttons

Once the calendar worked, I wanted a way to jump straight to a given month instead of stepping through prev/next one month at a time - which gets tedious as posts accumulate. I added a list of every year-month with at least one post, newest first; clicking one jumps the calendar there in place, no page reload, reusing the same state the prev/next buttons already manage.

## Where things stand

This post ends up being a record of the blog fixing itself while I was building it. Calendar, monthly buttons, and tag cloud are all in the sidebar now - next up is actually writing more posts.

To be continued.
