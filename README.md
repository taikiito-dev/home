# home

Source for [taikiito.com](https://taikiito.com) — a personal site built with
[Hugo](https://gohugo.io/) and hand-written CSS. No framework, no JavaScript,
no build step beyond Hugo itself. The pages are English only.

## Structure

```
content/_index.md                front matter for the landing page
content/about.md
content/projects.md
content/writing/_index.md        the Writing index
content/writing/*.md             one file per published piece
layouts/index.html               landing page markup
layouts/_default/list.html       section indexes
layouts/_default/single.html     article pages
layouts/shortcodes/unsure.html   inline "not verified" marker
static/css/site.css              all styles
static/CNAME                     custom domain for GitHub Pages
static/assets/images/            favicon and touch icon
hugo.toml
.github/workflows/deploy.yml
```

`/writing/` emits an RSS feed; see `[outputs]` in `hugo.toml`. Tag pages are
deliberately not generated — tags stay in front matter as metadata.

## The `unsure` shortcode

A paired shortcode that wraps a claim I have not checked, and labels it as
such. The label is a fixed string rather than free text, so a reader scanning
the page recognises it without reading it, and `rg unsure content/` lists
every open question on the site in one pass.

## Local development

Requires Hugo extended (0.165.0 is what CI uses).

```sh
hugo server
```

Then open http://localhost:1313.

## Build

```sh
hugo --gc --minify
```

Output goes to `public/`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
Hugo and publishes to GitHub Pages. The custom domain `taikiito.com` comes
from `static/CNAME`.

## How this was written

Claude Code wrote the templates and CSS in this repository. I decided the
structure of the site and what each page says, including the parts that turned
out wrong.

## Fonts

[Newsreader](https://fonts.google.com/specimen/Newsreader) for Latin text,
[Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) for
Japanese, loaded from Google Fonts. The fallback chain is in
`static/css/site.css`.
