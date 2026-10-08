---
title: "I Built Myself an RSS Reader, and Tore It Down the Same Day"
date: 2026-08-21T10:00:00+08:00
description: "Self-hosted a Miniflux RSS reader on the same server as MulmoClaude to aggregate news by category, then decided the same day it would just become an overflowing unread inbox, and removed the entire stack."
lang: "en"
altUrl: "/ja/archive/2026-08-21-rss-reader-teardown/"
altLabel: "日本語"
tags: ["side projects"]
---

Last post ended with the email sender-reputation issue - I'd run out of technical levers to pull there and was just waiting it out. While waiting, I tried something else: a self-hosted RSS reader to keep up with news and blogs in one place.

## Why Miniflux

A few options were on the table, but I picked Miniflux for being lightweight and easy to self-host. The setup was one Docker Compose file - a Miniflux container plus a PostgreSQL container. Access followed the same pattern as MulmoClaude: a Cloudflare Access authentication gate in front.

The plan was to pull in the Straits Times, the NYT, and a handful of blogs, sorted by category. Twitter/X was out from the start - it dropped free RSS access back in 2023.

## What subscribing to feeds actually revealed

Once I actually wired up the feeds, a few things weren't what I expected.

- The NHK feed had been silently blocked as of August 8th. No explanation given, and it's likely targeting cloud-provider IP ranges as a class, not anything specific to my setup.
- The Straits Times and NYT feeds were both alive, but both stop at headline and summary before the paywall.

Technically, I got it fully working.

## And decided to stop anyway

Once it was working, I paused and thought about it. The idea of aggregating news by category wasn't bad on its own, but running it for real seemed like it would just become an ever-growing pile of unread items - an information-overload sink. The point had been to control how much I read, not to read more.

Same day, I removed the whole thing - the Docker containers, the nginx config, the DNS record, the Cloudflare Access application. Less than 24 hours between building it and tearing it down.

## Getting something working and actually keeping it are different things

This one taught me that getting something technically working is a different question from whether it actually earns a permanent place in my routine. Deciding to build something and then walk away from it isn't necessarily a bad outcome.

To be continued.
