---
title: "After Making MulmoClaude Run 24/7, Its Background Automation Started Looping Forever"
date: 2026-08-17T09:00:00+08:00
description: "The day after moving to an always-on server, a background automation task (the journal feature) started endlessly retrying the same sessions. The root cause: a millisecond-precision mismatch between Python and Node.js timestamps."
lang: "en"
altUrl: "/ja/archive/2026-08-17-journal-loop-bug/"
altLabel: "日本語"
tags: ["MulmoClaude", "debugging"]
---

Last time I wrote about moving MulmoClaude to an always-on AWS Lightsail server. The migration itself went fine - but the next day, I noticed something was off with the automation running behind the scenes.

## What was happening

MulmoClaude has a background feature called `journal` that auto-generates daily summaries from chat logs. It started taking an abnormally long time every time it ran hourly - some runs took 25 to 90 seconds. It felt like something was retrying over and over, and token usage was climbing noticeably.

## Tracking it down

Digging in, I found that a large batch of sessions (625 of them) generated during the migration work (see last post) had been left unprocessed. The hourly job kept trying to process the entire backlog every single run, and kept failing to finish - so the next hour it would try the exact same backlog again. Close to an infinite loop.

Digging further, there was a deeper root cause underneath. The logic that checks whether a session has "already been processed" compares timestamps, and the Python side and the Node.js side handled milliseconds slightly differently - one truncating, the other rounding. That mismatch meant sessions that should have counted as "already processed" kept looking "unprocessed" every single time. A few attempted fixes didn't stick, because none of them addressed the mismatch itself.

## Stopgap, then the real fix

First I turned the `journal` feature off entirely to stop the bleeding. Then I fixed the timestamp handling so both languages treat precision the same way. After that, I confirmed `daysSkipped: 0` and the hourly check dropped to 2-3 milliseconds.

I also revisited the schedule: `journal` is now pinned to run once a day (`dailyIntervalHours: 24`), and the hourly scheduler check itself stays lightweight.

## What I took from this

"Always-on" turned out to mean more than just the app staying up - the quiet automation running behind it has to not break either. The most expensive thing was happening somewhere completely invisible from the front end.

To be continued.
