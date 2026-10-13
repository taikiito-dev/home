---
title: "Taste Is Not a Reason"
date: 2026-10-07
lastmod: 2026-10-13
weight: 17
description: "A non-engineer's record of adjusting a two-person chat-and-calendar PWA well over a hundred times, with Claude doing the implementation: three dated decisions settled by measurement rather than preference — retiring every read receipt, cutting a costly visual effect for speed, and getting the navigation badly wrong once."
lang: "en"
tags: ["decision record", "UI design", "PWA", "Claude"]
---

Since September 2026 I have been adjusting a chat-and-calendar progressive web app that two people use — myself and one other. Well over a hundred changes, almost all of them about how it looks.

The division of labour first. **I did not write the CSS or the JavaScript.** Claude — Anthropic's AI assistant — wrote it. What I did was use the thing on a real phone, say where it felt wrong, and choose from the options that came back.

That split fits visual work unusually well. **This app has two users, so the only person who can say "this is hard to read while using it" is someone using it.** Getting the discomfort into words was my half; turning the words into numbers was Claude's. Every one of the three records below starts with me pointing at something.

What follows is the decisions. The CSS and JavaScript that carried them out are not reproduced here; what I publish is what was decided and why.

**What this covers** — Settling the look of a two-person chat-and-calendar PWA by measurement rather than taste, across three dated records — from retiring every read receipt to adding and then removing the navigation.

---

## Decision 1 — I retired every read receipt

**Date.** 7 October 2026

**What I was torn between.** Each message carried a small tick inside its bubble — dark once the other person had read it, faint until then. A familiar design. It was hard to read in use, and it took me a while to say why. My first attempt was only "the read tick overlaps the sticker and I can't see it."

After that was fixed I looked again, and finally got it out: **"the dark-text/faint-text inversion is reversed, and it's confusing."**

**What came out.** Measured, the unread faintness matched in both places exactly — and **the direction "read" travels was reversed.** On the blue bubble, being read made the tick stand out more against its ground. Beside a sticker, on white, being read made it sink. The same event went one way in one place and the opposite way in the other.

**What I chose.** **Scrap the per-message tick entirely.** In its place, a small `read` under the last message I sent — nothing else. I picked this from three options. The wording is lowercase `read`, also my call.

**What I turned down.** Two things. One, tune the contrast values until they agree. Two, use a different colour just for stickers.

**Why.** Because **as long as meaning is carried by contrast, having two different grounds makes the reversal unavoidable.** There is no single colour for which "read is darker" holds on both a white and a blue ground. Tuning the numbers is work that never finishes.

Reduce the tick to one instance and there is only one ground. The reversal disappears as a matter of structure. I chose to delete the structure that produces the problem rather than the problem.

**Right or wrong in hindsight.** **Right — and corroborated afterwards.** The only read state this app stores is a single marker of how far the other person has read; there is no per-message state at all. **Showing a tick on every message was displaying information the app does not have.** I suspect that is exactly why the iPhone shows "Read" under only the last message.

**What stuck.** **If meaning is carried by contrast, keep the ground to one kind. If you cannot, stop carrying meaning by contrast.** And match the number of indicators to the granularity of the data behind them. One piece of data and ten indicators means something is lying somewhere.

---

## Decision 2 — Given looks versus speed, I cut the looks

**Date.** October 2026

**What I was torn between.** Putting a background blur behind a translucent surface makes it look expensive for free. Header, input field, menus, the timestamp chip over each photo — it had grown to around twenty places. And scrolling was heavy.

**What I chose.** **Cut the blur to two places: the header buttons and the input field.** Everywhere else keeps the translucent fill, compensated by making the ground slightly more opaque.

**What I turned down.** Keep the blur and find speed elsewhere.

**Why.** The behaviour of blur is unambiguous: **if anything behind it moves by one pixel, the blur is recomputed.** In a chat app, the background is always moving. So this was a cost that no optimisation elsewhere could offset.

**Right or wrong in hindsight.** **Right** — the visual difference is invisible unless compared side by side, and scrolling got measurably lighter. It also showed my own guess to be wrong. **I went in suspecting the header; the real culprit was the timestamp chip sitting on every single photo.** I had not thought about the one thing that multiplies by count.

**What stuck.** **Speed comes from measuring what you added and subtracting it.** Which part is responsible is not available to intuition. And **when you remove an effect, re-examine every value you set while assuming it.** Opacity chosen on the assumption of a blurred background let the text behind show through once the blur was gone.

---

## Decision 3 — I made the navigation permanent. And got it badly wrong once

**Date.** October 2026

**What I was torn between.** Where to put the entry points — chat, calendar, photos, settings. My first instinct was the header.

**What I chose.** **Four tabs along the bottom.** On desktop, above 1000px wide, the tabs hide and a narrow vertical rail appears at the left edge instead.

**What I turned down.** Putting the entry points in the header.

**Why.** The header always has something in it: the room name, a back arrow, search, a menu. Push navigation in there and **the thing it competes with changes from screen to screen.** In the calendar it fights the month stepper, in photos the clear-selection control, in chat the search. Fix one and another overflows. It becomes whack-a-mole.

**Hence the rule: permanent navigation goes on a surface it shares with nothing.** The bottom edge and the left edge are those surfaces.

**Right or wrong in hindsight.** **This one I got wrong.** The placement was right. **The way I introduced it caused an incident.** Immediately after the bottom tabs went in, every tap in the app stopped responding. The other user could not use it. I spent four exchanges hunting the cause.

**All four of those exchanges were the mistake. I should have reverted on the first one.** When a change made for looks breaks the ability to operate the app, you remove it — you do not keep it alive while repairing it. I deferred that because I wanted to know the cause. The whole time, the other person's app did not work.

The second attempt worked. **One revertible step at a time:** tabs only, confirm on a real device; then the settings screen; then the calendar.

**What stuck.** Two things.

**Decide what to make permanent by what it competes with, not by where it goes.**

And: **while something is broken, recovery comes before diagnosis.** I had learned to doubt an all-clear. I was much slower to notice that someone else was stopped, waiting on a decision of mine. That is not a technical point and there is no excuse available for it.

---

## The habits I actually use now

Only the ones that survived the three records above.

**1. Hold a vague discomfort until it can be restated as something measurable.** "Hard to read" became "the direction of the contrast ratio reverses depending on the ground." The moment it was restated, the fix was forced. **The restating is Claude's job. Saying the first sentence is the job of the person using it.**

**2. Delete the structure that produces the problem, not the problem.** The read tick was fixed by reducing it to one, not by correcting its values.

**3. Remove one effect and re-examine every value chosen while assuming it.**

**4. If it cannot be operated, revert before investigating.** And introduce large structural changes one revertible step at a time.

---

## The question I still cannot answer

**Of the discomforts I reported, how many were actually just preference?** All three above held up under measurement. But that can also be read as: only the ones that held up are in the record. I have never counted how many of my notes evaporated once someone measured them.

Next time I say something, I intend to write it down at the moment I say it.

