# home

Source for [taikiito.com](https://taikiito.com) — a single-page personal homepage built with [Hugo](https://gohugo.io/) and hand-written CSS. No framework, no build step beyond Hugo itself.

## Structure

```
content/_index.md          front matter for the single page
layouts/index.html         the whole page markup
static/css/site.css        all styles
static/js/lang-toggle.js   English / Japanese toggle
static/CNAME               custom domain for GitHub Pages
static/assets/images/      favicon and touch icon
.github/workflows/deploy.yml
```

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

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with Hugo and publishes to GitHub Pages. The custom domain `taikiito.com` comes from `static/CNAME`.

## Fonts

[Newsreader](https://fonts.google.com/specimen/Newsreader) for Latin text, [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) for Japanese, loaded from Google Fonts. The fallback chain is in `static/css/site.css`.
