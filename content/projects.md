---
title: "Projects"
standfirst: "What I have built."
description: "Projects by Taiki Ito — a booking-to-calendar tool and a Singlish phrase collection."
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

## Repositories

Source for the above, the source of this site, and smaller side projects.

[github.com/taikiito-dev](https://github.com/taikiito-dev)
