---
title: "With the Domain Working, I Built Myself a Digital Business Card the Same Day"
date: 2026-08-19T10:00:00+08:00
description: "A same-day side quest after getting the domain working: a static digital business card at a new subdomain, served entirely separately from the main app, with a vCard-download button, a WhatsApp click-to-chat link, and a small run-in with Cloudflare's email obfuscation."
lang: "en"
altUrl: "/ja/archive/2026-08-19-digital-business-card/"
altLabel: "日本語"
tags: ["self-hosting", "side projects"]
---

Last time, I got `taikiito.com` working and could reach my own MulmoClaude from a browser. Now that I could carve out subdomains under it, I built one more thing the same day: a digital business card.

## One subdomain, one static page

I created a new subdomain under `taikiito.com` and added a second nginx server block on the same Lightsail box (the actual card page has my personal contact details on it, so I'm not publishing the URL here). The important part: it's completely separate from the main Node.js app. No `proxy_pass` - just a single static HTML file being served - so traffic to the card page has zero effect on the main app's load.

The content is lifted straight from the business card I actually use day to day. I kept it down to two buttons:

- "Save Contact" - generates a `.vcf` file on the spot via a JS Blob and opens the phone's add-to-contacts sheet
- "WhatsApp" - a `wa.me` click-to-chat deep link

I originally had a third button for sending an email too, but later cut it down to just an info row with a `mailto:` link. Fewer buttons turned out to be more usable.

## A small color detour

I'd built it in navy from the start, but made a black-and-white version too, just to compare side by side. Navy won, and the black-and-white draft got deleted.

## A small gotcha

Right after launch, previewing the card inside this app's own embedded iframe, the email address showed up as a garbled placeholder string instead of the real thing. My first thought was I'd broken something. Turned out to be Cloudflare's "Email Address Obfuscation" (Scrape Shield) - it automatically encodes email addresses on the page to deter spam scrapers, and a small decoding script is supposed to restore the real address in a normal browser. That decoder just doesn't run inside this app's preview iframe. It's a zone-wide setting, so I left it on and confirmed the real address renders fine in an actual browser tab.

## What a name-domain unlocks

The moment my own name became a domain, spinning up small subdomains like this got trivial. A few more of the same pattern would follow.

To be continued.
