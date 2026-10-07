---
title: "Taste Is Not a Reason"
standfirst: "Ten rules for deciding an interface by measurement instead of preference, and the three decisions I got wrong first."
description: "How I decide interface questions without arguing about taste: ten rules derived from measuring first-party apps, and three case studies — retiring every read receipt, removing blur to get speed back, and where a permanent navigation bar belongs."
lang: "en"
altUrl: "/ja/taste-is-not-a-reason/"
altLabel: "日本語"
---

I have spent the last several weeks rebuilding the interface of a chat-and-calendar progressive web app that two people use every day: me and one other real user who files bug reports. I have changed it well over a hundred times. Almost all of those changes were about how it looks.

Appearance is the easiest thing to argue about badly. The moment a decision becomes a matter of taste, it stops being decidable, and six months later nobody — including me — can reconstruct why it is the way it is.

So I keep ten rules. Here they are, then three decisions where I broke them and had to measure my way out.

## The ten rules

**1. Take dimensions from measuring first-party apps, not from preference.**
There is no correct number for the corner radius of a message bubble. But there are correct *ratios*. Measured off a first-party app: radius ÷ font size = 1.63, radius ÷ the height of two lines of text = 0.436. So when the font size changes, the radius follows the ratio. Hold the ratio rather than the number and nothing breaks later.

**2. Never read pixel values straight out of a screenshot.**
Screenshots from an iPhone or a Mac are in **Display P3**, a wider colour space than sRGB. Numbers lifted from them and pasted into CSS come out slightly duller than the real thing. Convert to sRGB, and **round-trip a colour you already know** to check your conversion before trusting it. Don't eyeball colours either: when someone sends a screenshot to specify a colour, sample the pixels mechanically.

**3. Don't fight dimensions the OS has already decided.**
Header 44pt. Bottom tab bar 49pt. Anything tapped often gets at least 40px (Apple's own guidance is 44pt square). Invent your own and you fight the position the user's thumb has already memorised.

**4. A permanently visible entry point goes on a surface it shares with nothing.**
Case study below.

**5. If meaning is carried by contrast, keep that mark on one background.**
Also below. I learned this rule by breaking it.

**6. A mark that means one thing goes on the same side regardless of what it is attached to.**
Bottom-right on photos and bottom-left on stickers makes the eye hunt. I put it bottom-left first and was corrected immediately. Position is decided by where the same meaning already lives, not by where there happens to be room.

**7. If the state determines the appearance uniquely, let CSS decide it.**
Inserting a marker from JavaScript means there are five or more paths that have to redraw it — first paint, loading older messages, a new arrival, switching rooms, the optimistic echo of your own send — and you will forget one. If a selector can express it, "forgetting to call it" stops being a category of bug.

**8. Animate `transform` and opacity only. Put blur where the background does not move.**
Below.

**9. A "waiting" indicator belongs on a surface that overlaps no information at all.**
A floating "Loading…" card in the middle of the screen always covers something. There is in fact a surface that covers nothing: the 2px bottom edge of the header. Run a band across it and you have said "working on it" without hiding a single character — and without text, so there is nothing to translate.

**10. Don't make spacing carry meaning.**
I nearly adopted "widen the gap when the sender changes." Then I measured WeChat: the gap does not change when the sender changes. It is a fixed 17pt. Spacing is too convenient as a way to express grouping — use it in one place and you will want it everywhere, until nobody can say what any particular gap means. Deciding not to use it is cheaper.

One more, free: **if you document a shortcut, implement it.** If the desktop layout says "⌘/Ctrl + Enter to send" under the input, that key has to work. Printed and broken is worse than absent.

---

## Case 1 — I removed every read receipt

**The first design.** A small ✓ inside each of my own bubbles: faint when unread, solid when read. The familiar thing.

**The first symptom.** The ✓ on stickers was hard to see, I was told. Stickers are 128px images with no background of their own, sitting directly on the page. I had reused the treatment built for photos — a small dark pill at the bottom-right corner. That was the mistake. A photo is large and filled to its edges, so covering a corner costs nothing. **A sticker is small, and the face is directly under that corner.**

**The first fix.** For stickers only, drop the pill and move the mark *outside* the image. The available room is the 11px gap between the image and the avatar (6px row gap + 5px avatar margin). The mark is 13px, so it sits at `right:-13px` and clears. LINE and WhatsApp both put it alongside.

I broke rule 6 here and placed it bottom-left first. I was told to move it to the right immediately. Of course: the ✓ in bubbles is on the right, so the left is where the eye goes to get lost.

**The real symptom.** Right after shipping that, a much better complaint arrived: **"the inversion of dark and light text is reversed — it's confusing."**

It took me a while to understand. Measuring made it obvious. These are the contrast ratios between the mark and whatever it sits on:

| Where the mark sits | Unread | Read | Direction when read |
|---|---|---|---|
| Inside a bubble (blue) | 1.56 | 2.62 | **lighter** than its background |
| Beside a sticker (white) | 1.56 | 3.64 | **darker** than its background |

Unread agrees: 1.56 in both. But the **direction of travel on becoming read is opposite**. On a blue bubble the mark rises out of the background; on the page it sinks into it. The same event — "they read it" — got brighter in one place and darker in the other.

**What that means.** No amount of tuning fixes this. **As long as meaning is carried by contrast, two different backgrounds make the reversal unavoidable.** There is no single colour that is "darker when read" on white and also on blue. It is not a value problem. It is a structural one.

**The design I landed on.** I **retired every per-message ✓**. What replaced it is one small `read` under the last message I sent. One mark means one background, and the reversal is gone by construction.

That also turned out to be honest about the data. The only read state this app stores is "which message has the other person read up to" — a single pointer, not a state per message. **Showing a ✓ on every message was displaying information I did not have.** iMessage marking only the last message "Delivered/Read" is presumably the same reasoning.

**Implementation**, per rule 7 — CSS decides:

```css
.row.me.read:not(:has(~ .row.me.read)) { /* the marker goes here */ }
```

"My own read row with no later read row of mine after it." Because read state fills in from oldest to newest, exactly one row ever matches. JavaScript's entire job is tagging which rows are read; it does not know where the marker goes. On a browser without `:has()`, the rule is dropped and **the marker simply doesn't appear** — nothing breaks.

The dimensions, for the record. Leave 22px below the row and place the marker absolutely inside that space. If you let it overhang without reserving the space, it collides with the next row: **adjacent vertical margins collapse into one**, so nobody is holding room for an overhang. The 45px inset from the right is avatar 34 + its margin 5 + row gap 6, which is **exactly the right edge of the bubbles**.

**Generalised.** **If meaning is carried by contrast, keep it on one background. If you can't, stop using contrast to carry it.** And match the number of markers to the granularity of the data behind them. One pointer rendered as ten marks will lie somewhere.

---

## Case 2 — What I deleted to make it fast

**Blur went from about twenty places to two**

Put `backdrop-filter` over a translucent fill and anything looks expensive. Headers, the input, menus, the timestamp pill on every photo — I added them cheerfully until there were about twenty.

Blur behaves like this: **if anything behind it moves by one pixel, the blur is recomputed.** In a chat, the background always moves. Scrolling moves all of it. Because a timestamp pill sat on every photo, scrolling a photo-heavy room recomputed blur once per pill.

Two survived: the header buttons and the input. Everywhere else, I kept the translucent fill and compensated by **deepening the backing colour by 0.07–0.12**. The difference is invisible unless you compare side by side. The scrolling improvement was not.

One trap here. **When you remove blur, revisit every opacity you chose while blur was there.** A panel tuned to a pleasing 0.74 *while the background was blurred* lets text read straight through once it isn't. Those went to 0.97–0.98. Blur and opacity are separate properties and a single visual decision.

**A decoration that never moved produced a ghost**

After the blur work I applied rule 9 to the calendar, replacing its floating "loading" card with the band running along the bottom edge of the header. A report arrived immediately: **"there's a squashed character to the right of November."**

The culprit was the small `⌄` next to the month heading. It carried an `opacity` and a `transition` — both of which tell the browser "this may be about to move." A browser told that promotes the element to its own layer. And **while an animation ran nearby, that layer's stale pixels stayed on screen as a ghost.**

Three fixes. **Express faintness with colour, not `opacity`.** **Throw away `transition` on things that don't move** — don't give a stationary decoration the apparatus for moving. And **bound the repaint on the side that does animate** (`contain: layout paint`).

The lesson fits in one line: **don't make a small stationary decoration a candidate for its own layer.**

Same day, same `⌄`, one more: shapes in a flex row don't wrap when space runs short the way text does. They just distort, and a distorted glyph reads as a broken character. Anything laid out beside text gets `flex: 0 0 auto`.

**The motion rules underneath all of this**

- animate `transform` and opacity; never width, height, or position itself
- no shadow on a moving element (a 1px edge line stands in for it)
- compute finger tracking once per frame, no more
- **never let width follow the finger** — change it once, when a threshold is crossed
- declare "about to move" only while it is actually moving
- on release, decide open-or-closed by **velocity** (px/ms), not position: fast gestures open from barely anywhere, slow ones need 40%
- when you change a duration, change every timer keyed to that duration with it
- all of the above turns off under the OS "reduce motion" setting

**Generalised.** **Speed comes from measuring what you added and removing it.** Guessing doesn't locate it. My prime suspect before measuring was the header. The actual cost was the timestamp pill on every photo.

---

## Case 3 — Where a permanent entry point goes

**The design.** Four tabs along the bottom — chat, calendar, photos, settings. Above 1000px the tabs are hidden and a 56px vertical rail appears at the left edge.

**Why not in the header.** I tried the header first. A header always has something in it: the room name, a back arrow, search, a menu. Put the navigation in there and **the thing it competes with changes per screen.** On the calendar it fights the month stepper; in photos, "deselect"; in chat, search. Fix one and it overflows somewhere else. It becomes whack-a-mole.

**Hence rule 4: a permanently visible entry point goes on a surface it shares with nothing.** The bottom edge and the left edge are those surfaces. I don't think Outlook, Slack and Teams all have a left rail because of fashion.

**What it cost instead.** Making navigation permanent means it is on screen *while you are typing*. That is where iOS bit me.

**If the set of form controls on screen changes while text is being composed, iOS rebuilds the bar above the keyboard — and takes the Japanese conversion candidates down with it.** The routine that keeps the tab bar in sync was rewriting the "current tab" attribute every time. And **rewriting an attribute with the same value still counts as a change.**

Two fixes: write only when the value actually differs, and **skip the whole update while the input has focus, then run it once focus leaves.** Alongside that I stopped using `<button>` in the parts that get rebuilt often (same appearance, same hit area, just an element with the role declared instead). In an app where the screen updates while you are mid-sentence, this has to be a standing rule, not a patch.

**Dimensions.** 49pt for the tab bar, 44pt for the header. One caution: **the amount of space the content reserves must not exceed the real height.** Every pixel of overshoot is taken from the content. A permanent entry point costs content area the moment you add it, so it is worth getting that number exactly right.

**One way out.** Every full-screen panel opened from the tabs closes through a single function. Anything that moves to a different context routes through it. Before that existed, **the login screen once ended up underneath an opaque panel and the app looked frozen.** Adding a screen now means registering it in three places: that closer, the swipe-to-dismiss list, and the Escape chain.

**Generalised.** **Decide what goes permanent by asking who it competes with, not where it fits.** And a permanent thing always bills you somewhere. Here the bill arrived as a broken input method.

---

## What's left

Almost every one of these ten rules exists because I broke it first. The read-receipt contrast problem shipped and was lived with for weeks before someone described it well enough for me to measure it. Until then, the best I could say was "it feels confusing."

The one claim I will make is this: **a judgement about appearance can be restated as something measurable.** "Confusing" became "the direction of contrast inverts depending on the background." The moment it was restated, there was exactly one fix.
