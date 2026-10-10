---
title: "Taste Is Not a Reason"
date: 2026-10-07
lastmod: 2026-10-10
weight: 18
description: "A non-engineer's record of adjusting a two-person chat-and-calendar PWA well over a hundred times, with Claude doing the implementation: five dated decisions settled by measurement rather than preference — retiring every read receipt, cutting ornament for speed, removing the navigation outright — plus the dimensions and motion rules in the second half."
lang: "en"
altUrl: "/ja/writing/ui-decisions-by-measurement/"
altLabel: "日本語"
tags: ["decision record", "UI design", "PWA", "Claude"]
---

Since September 2026 I have been adjusting a chat-and-calendar progressive web app that two people use — myself and one other. Well over a hundred changes, almost all of them about how it looks.

The division of labour first. **I did not write the CSS or the JavaScript.** Claude — Anthropic's AI assistant — wrote it. What I did was use the thing on a real phone, say where it felt wrong, and choose from the options that came back.

That split fits visual work unusually well. **This app has two users, so the only person who can say "this is hard to read while using it" is someone using it.** Getting the discomfort into words was my half; turning the words into numbers was Claude's. Every one of the five records below starts with me pointing at something.

What follows is the decisions. Measurements and implementation are collected in the lower half of this page.

**What this covers** — Settling the look of a two-person chat-and-calendar PWA by measurement rather than taste, across five dated records — from retiring every read receipt to adding and then removing the navigation. The implementation notes are in the [second half](#implementation).

---

## Decision 1 — I retired every read receipt

**Date.** 7 October 2026

**What I was torn between.** Each message carried a small tick inside its bubble — dark once the other person had read it, faint until then. A familiar design. It was hard to read in use, and it took me a while to say why. My first attempt was only "the read tick overlaps the sticker and I can't see it."

After that was fixed I looked again, and finally got it out: **"the dark-text/faint-text inversion is reversed, and it's confusing."**

**What came out.** Measured, it looked like this.

| Where the tick sits | Unread | Read | Direction read moves |
|---|---|---|---|
| Inside the bubble (blue ground) | 1.56 | 2.62 | **lighter** than its ground |
| Beside a sticker (white ground) | 1.56 | 3.64 | **darker** than its ground |

The unread faintness matches exactly. But **the direction "read" travels is reversed.** On the blue bubble, being read makes the tick rise. On the white background, being read makes it sink. The same event goes lighter in one place and darker in the other.

**What I chose.** **Scrap the per-message tick entirely.** In its place, a small `read` under the last message I sent — nothing else. I picked this from three options. The wording is lowercase `read`, also my call.

**What I turned down.** Two things. One, tune the contrast values until they agree. Two, use a different colour just for stickers.

**Why.** Because **as long as meaning is carried by contrast, having two different grounds makes the reversal unavoidable.** There is no single colour for which "read is darker" holds on both a white and a blue ground. Tuning the numbers is work that never finishes.

Reduce the tick to one instance and there is only one ground. The reversal disappears as a matter of structure. I chose to delete the structure that produces the problem rather than the problem.

**Right or wrong in hindsight.** **Right — and corroborated afterwards.** The only read state this app stores is a single marker of how far the other person has read; there is no per-message state at all. **Showing a tick on every message was displaying information the app does not have.** I suspect that is exactly why the iPhone shows "Read" under only the last message.

**What stuck.** **If meaning is carried by contrast, keep the ground to one kind. If you cannot, stop carrying meaning by contrast.** And match the number of indicators to the granularity of the data behind them. One piece of data and ten indicators means something is lying somewhere.

---

## Decision 2 — Same meaning, same side

**Date.** 7 October 2026, mid-way through Decision 1

**What I was torn between.** The first fix above moved the sticker's tick outside the image — and it came out at the bottom *left*, because that was where the space was.

**What I chose.** **I said: put it bottom right, consistently.**

**Why.** The tick inside a bubble is on the right. Put it on the left elsewhere and the eye has to hunt. Bottom right for photos and bottom left for stickers means the reader searches every time.

**Right or wrong in hindsight.** **Right** — and small, but this is the kind of note that only surfaces from real use. Looking at one screen in isolation, I would probably not have caught it.

**What stuck.** Decide an indicator's position by **where the same meaning already lives**, not by where there happens to be room. Use space as the reason and the meaning moves every time the space does.

---

## Decision 3 — Given looks versus speed, I cut the looks

**Date.** October 2026

**What I was torn between.** Putting a background blur behind a translucent surface makes it look expensive for free. Header, input field, menus, the timestamp chip over each photo — it had grown to around twenty places. And scrolling was heavy.

**What I chose.** **Cut the blur to two places: the header buttons and the input field.** Everywhere else keeps the translucent fill, compensated by making the ground slightly more opaque.

**What I turned down.** Keep the blur and find speed elsewhere.

**Why.** The behaviour of blur is unambiguous: **if anything behind it moves by one pixel, the blur is recomputed.** In a chat app, the background is always moving. So this was a cost that no optimisation elsewhere could offset.

**Right or wrong in hindsight.** **Right** — the visual difference is invisible unless compared side by side, and scrolling got measurably lighter. It also showed my own guess to be wrong. **I went in suspecting the header; the real culprit was the timestamp chip sitting on every single photo.** I had not thought about the one thing that multiplies by count.

**What stuck.** **Speed comes from measuring what you added and subtracting it.** Which part is responsible is not available to intuition. And **when you remove an effect, re-examine every value you set while assuming it.** Opacity chosen on the assumption of a blurred background let the text behind show through once the blur was gone.

---

## Decision 4 — Don't let a static ornament prepare to move

**Date.** October 2026

**What I was torn between.** After the blur was cut, a symptom appeared in the calendar: **"there's a crushed character to the right of November."** One unreadable glyph, left behind.

**What was actually happening.** The culprit was a small `⌄` next to the month heading. That ornament carried properties that tell the browser "this may be about to move." Told that, the browser keeps it as its own layer — and **while an animation ran nearby, the old contents of that layer persisted as a ghost.**

**What I chose.** Strip those properties from the ornament. Express its faintness through colour instead.

**What I turned down.** Adjusting the animation's duration or easing curve.

**Why.** The symptom was not on the thing animating; it was on **the static ornament next to it.** Fixing the moving part cannot remove a ghost left by a part that does not move. Separating where the symptom shows from where the cause lives came first.

**Right or wrong in hindsight.** **Right** — and the same day the same `⌄` caused a second thing. A glyph like that does not wrap when its parent is too narrow the way text does; it simply distorts, and a distorted glyph reads as a broken character. **One small ornament was behind two unrelated symptoms.**

**What stuck.** **Do not make a small static ornament a candidate for its own layer.** And when a report is something the person making it cannot name — "there's a crushed character" — **doubt the name of the thing being seen.** It was not a character.

---

## Decision 5 — I made the navigation permanent. And got it badly wrong once

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

Only the ones that survived the five records above.

**1. Hold a vague discomfort until it can be restated as something measurable.** "Hard to read" became "the direction of the contrast ratio reverses depending on the ground." The moment it was restated, the fix was forced. **The restating is Claude's job. Saying the first sentence is the job of the person using it.**

**2. Delete the structure that produces the problem, not the problem.** The read tick was fixed by reducing it to one, not by correcting its values.

**3. Same meaning, same side. Available space is not a reason.**

**4. Remove one effect and re-examine every value chosen while assuming it.**

**5. If it cannot be operated, revert before investigating.** And introduce large structural changes one revertible step at a time.

---

## The question I still cannot answer

**Of the discomforts I reported, how many were actually just preference?** All five above held up under measurement. But that can also be read as: only the ones that held up are in the record. I have never counted how many of my notes evaporated once someone measured them.

Next time I say something, I intend to write it down at the moment I say it.

---

# Implementation

Everything below was written by Claude and confirmed by running it on my own devices. It is kept here for two reasons. One, it shows the shape and the length of the work before you start. Two, **it is material someone wanting to do the same thing can hand straight to their own AI.**

## How dimensions get chosen

Dimensions come from measuring first-party apps, not from preference. There is no correct number for a bubble's corner radius, but there is a defensible **ratio**. Measured locally: radius ÷ font size = 1.63, radius ÷ the height of two lines = 0.436. Change the font size and the radius follows the ratio. Hold ratios rather than numbers and nothing breaks later.

Do not fight dimensions the OS has already set: 44pt header, 49pt bottom tab bar. Frequently tapped targets at least 40px (Apple's guidance is 44pt square). One caveat: **the amount of space reserved for content must not exceed the real height.** Any excess is taken directly out of the content.

## How colours get sampled

Screenshots from iPhone and Mac are stored in **Display P3** (a wider colour space than sRGB). Write the raw values from one into CSS and the result is slightly duller than the device. Always convert to sRGB and **round-trip a colour you already know as a check** before adopting anything. Eyeballing colour is also out: when a screenshot arrives, sample the pixels mechanically.

## The read marker (Decision 1's implementation)

If the appearance is uniquely determined by state, let CSS decide it. Inserting the marker from JavaScript creates five or more repaint routes — first render, scrolling back through history, new messages, switching rooms, optimistic send — and one of them will always forget to call it.

```css
.row.me.read:not(:has(~ .row.me.read)) { /* place the marker here */ }
```

"My own read row that has no later read row of mine after it" can only ever match a single row, because read state is applied from the oldest row forward. JavaScript's only job is to mark which rows are read; it knows nothing about where the marker goes. On a browser that does not support this selector the whole rule is ignored and **the marker simply does not appear** — nothing breaks.

For dimensions: leave 22px of margin below the row and position the marker absolutely inside it. Letting it overhang without reserving the space makes it collide with the next row (**adjacent vertical margins collapse into one**, so nobody reserves room for the overhang). The 45px from the right is the avatar's 34 plus its 5 of margin plus the row's 6 gap, which lines the marker up with **the right edge of the bubble**.

Beside a sticker, the available space is the 11px gap between the image and the avatar (6px row gap + 5px avatar margin). The marker is 13px, so `right:-13px` fits exactly.

## Rules kept for motion

- Animate only `transform` and opacity. Never width, height, or position itself (a `height` or `padding-bottom` transition relayouts the whole screen every frame, so stretching the duration does not stop the stutter)
- Blur only where the background does not move. It can be dropped entirely while something is animating. Never interpolate its radius
- No shadows on moving elements (a one-pixel line at the edge substitutes)
- No `transition` or `opacity` on a static ornament. Express faintness through colour
- Give side-by-side glyphs a no-shrink declaration (`flex: 0 0 auto`)
- Give the animating side a repaint-containment declaration (`contain: layout paint`)
- Compute drag response once per frame. **Never let width follow the finger** — change it once, at the moment a threshold is crossed
- On release, decide open-or-closed from **velocity** (px/ms), not position
- Change a duration and every timeout tied to that duration changes with it
- Finish the contents of a thing before you animate it (most "stuttering" is not the curve or the duration; it is other rendering happening in the same window)
- Only one surface may move during a screen transition (three at once reads as elevator doors)
- All of the above is disabled when the OS "reduce motion" setting is on

## No meaning in spacing

A convention of widening the gap when the sender changes nearly went in. Measured against an existing app used as reference, the gap does not change when the sender changes — it is fixed at 17pt. Spacing is too convenient as a way of expressing grouping: start using it in one place and you will want it everywhere, and eventually nobody can say which gap means what. Deciding not to use it at all is cheaper.

## Entrances and exits (Decision 5's implementation)

Four bottom tabs, swapped for a 56px left rail on desktop. Stacking order sits above the full-screen panels and below the image viewer. **Funnel every exit through one function** — any transition to a different context must pass through it. Before that existed, the login screen ended up hidden under an opaque panel and looked like a freeze. Each new screen gets registered in three places: the close handler, the swipe-away gesture, and the Escape ordering. Anything that covers the screen gets one sweeper that retracts it if it is showing when it should not be.

## Updating the screen during text entry (an iOS trap)

**If the set of form controls on screen changes while text is being entered, iOS rebuilds the bar above the keyboard — and takes the Japanese conversion candidates down with it.** Worse, **rewriting an attribute with the same value still counts as a change.**

Two fixes. Write only when the value actually changes. And **skip the update entirely while an input has focus, then redo it when focus leaves.** Alongside that, frequently rebuilt regions stopped using `<button>` (same appearance and same hit area, with the role declared on a `div` instead). In an app like chat, where the screen updates while you are typing, this has to be settled as a convention.

## How waiting is shown

Float a "loading…" card in the middle of the screen and it will cover something. There is a surface that covers nothing: the 2px bottom edge of the header. Run a bar across it left to right and you have said "waiting" without hiding a single piece of information — and without words, so there is nothing to translate.

## Anything the UI promises gets implemented

If the desktop layout prints "⌘/Ctrl + Enter to send" under the input, that shortcut works. Printed and broken is worse than never printed.
