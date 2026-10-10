---
title: "Projects"
standfirst: "What I have built, and what I have reported to the projects I use."
description: "Projects by Taiki Ito — a booking-to-calendar tool, a Singlish phrase collection, and bug reports filed upstream."
lang: "en"
altUrl: "/ja/projects/"
altLabel: "日本語"
---

## booking-to-caldav

Booking confirmation emails become events on my own calendar server. It holds an IMAP connection open rather than polling, so a confirmation that arrives at 3am is on the calendar seconds later. Flights go to the shared calendar, haircuts and dental appointments to the personal one.

Two things made it harder than it sounds. Airline confirmations print `24 Dec (Wed)` with no year, so the year has to be recovered from the weekday. And they print local clock times with no offset, so the airport code is the only clue to the time zone — read naively, a Singapore–Tokyo flight comes out an hour too long.

Running on my server since October 2026.

[github.com/taikiito-dev/booking-to-caldav](https://github.com/taikiito-dev/booking-to-caldav)

## singlish-lah

A collection of Singlish phrases and local slang picked up from everyday conversation in Singapore. Written in Japanese, for Japanese speakers living here.

[singlish.taikiito.com](https://singlish.taikiito.com) · [source](https://github.com/taikiito-dev/singlish-lah)

## Reported upstream

I run the tool I work in every day on a VPS, inside Docker, not on a Mac, left up for weeks at a time, in Japanese. That is not the setup it was built and tested for, which is why six issues came out of it. Four led to fixes:

- [#3415](https://github.com/receptron/mulmoclaude/issues/3415) — journal session links pointed at the wrong path, dead in editors
- [#3357](https://github.com/receptron/mulmoclaude/issues/3357) — the stdio→HTTP shim leaked one port per turn; the MCP server silently disappeared after about twenty turns
- [#3018](https://github.com/receptron/mulmoclaude/issues/3018) — a manually registered stdio MCP server never surfaced
- [#2937](https://github.com/receptron/mulmoclaude/issues/2937) — intervals longer than 24h all collapsed into "every day at 00:00 UTC"

None of these needed skill I have. They needed a machine nobody else was running.

[All issues](https://github.com/receptron/mulmoclaude/issues?q=is%3Aissue+author%3Ataikiito-dev)

## Repositories

Source for the above, the source of this site, and smaller side projects.

[github.com/taikiito-dev](https://github.com/taikiito-dev)
