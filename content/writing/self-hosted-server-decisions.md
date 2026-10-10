---
title: "Running My Own Server: One Month of Decisions"
date: 2026-10-07
lastmod: 2026-10-11
weight: 16
description: "A non-engineer's record of moving photos, files, passwords, calendars and mail onto one rented server and running it for one month: five dated decisions, the options turned down, and which calls look right in hindsight."
lang: "en"
altUrl: "/ja/writing/self-hosted-server-decisions/"
altLabel: "日本語"
tags: ["decision record", "self-hosting", "VPS", "backup", "operations"]
---

I negotiate crude oil contracts for a living. I don't write code — I decide what to build and why, and Claude Code writes it. **Until September 2026 I had nothing to do with software at all** — no server of my own, no command line, none of it.

**What this covers** — Putting photos, files, passwords, calendars and the mail for a domain I own onto one rented server, and keeping it running since September 2026. Five dated decisions, and the options I turned down. The implementation is a separate page: [Standing Up a Self-Hosted Server](/notes/self-hosted-server-setup/).

In September 2026 I started moving what I had been keeping on large cloud services onto a single server I pay a monthly fee for. Photos, files, passwords, calendars, and eventually mail.

The reason was simple: **I did not like that the terms of custody could change at the custodian's convenience.** Price rises, feature removals, policy changes, account suspensions. None of them are things I can stop. At some point it stopped sitting well with me that everything of the irreplaceable kind — photographs going back to childhood, years of correspondence — was stacked on top of things I could not stop.

That server has been running since September 2026. Two users. It has not been out of my hands for a day.

This page is a record of **what I decided** over the first month: what I was torn between, which option I took, which ones I turned down, and whether the call looks right or wrong from here. With dates. **What I would do, and in what order, to stand this up from scratch** is written out on its own page: [Standing Up a Self-Hosted Server](/notes/self-hosted-server-setup/).

## What is on it

One rented virtual private server, under ten dollars a month. Nothing is exposed by opening ports inward; it is reached through a tunnel the server itself dials outward.

On it: photos, files, passwords, calendars and contacts, a single sign-on front door, a git repository, uptime monitoring, and a chat-and-calendar app I had built for myself. Backups go offsite every night, encrypted.

Mail came last and matters most. Roughly 53,000 messages now live on a domain I own. **That is the part that actually changed things.** Because the address is mine, I can change providers without telling anyone that my address changed — which is the first time the custodian became a replaceable part rather than the foundation.

Two users. One is me; the other is simply a user, and not an engineer either. So "it only breaks for me" was never an available excuse.

## The division of labour — I am not the one typing

Now the part worth being explicit about. Of everything listed above, **I have typed almost none of the commands.** I did not write the configuration files either. Claude — Anthropic's AI assistant — did that. I decided.

This was not a workaround for lack of time. It is the split that produces the most, because not holding the implementation means **I can spend all of my attention on the decisions.** And by the end of the first month, what in those decisions was actually doing the work had narrowed to exactly one thing.

**Doubting the all-clear.** That is it.

There is a structural reason for it. **Claude wants the task to be finished. I am fine if it isn't.** That asymmetry is the source of everything below. The implementing side has a motive to say "done"; I have none. So the doubt has to come from my side — not because I know more, but because I am standing somewhere else.

The five records below are the occasions where that asymmetry actually paid.

---

## Decision 1 — I was out of disk. Three options were compared, and I picked a fourth

**Date.** September 2026

**What I was torn between.** A 200 GB disk was filling up, and photos only ever grow.

**The options I was given.** Three. One, move old data to cheaper network-attached storage. Two, switch to a different storage product. Three, migrate to a bigger server. I was handed a genuine comparison — cost per terabyte, egress charges, failure modes, migration runbooks. I stayed in that comparison for weeks.

**What I chose.** **None of them. I made the disk bigger.** My provider's control panel has a button labelled **Extend SSD Storage**. No reinstall, no migration. 200 GB to 400 GB, done that afternoon.

**What I turned down.** All three. The first was the one most strongly recommended.

**Why.** Reading the comparison table, I noticed every row had the same property: **the setup gets more complicated than it is today.** Data in two places, one more vendor, a longer restore procedure. I am not an engineer, and I am the one who has to fix this when it breaks. **Saving a few dollars a month and being able to fix it myself are not tradeable against each other.** So I asked the dumbest question available: can I just make this disk bigger? I could.

**Right or wrong in hindsight.** **Right — but not cleanly right.** At the capacity I actually needed, extending the disk is the *most* expensive option per terabyte. On price alone I lost. It was still correct, because price was never the axis that mattered.

**What stuck.** When a comparison table appears, **go looking for one option that is not on it.** Boring options — "just make it bigger", "just turn it off", "just delete it" — rarely make the table, because there is nothing to compare. For weeks I had been solving a harder problem than the one I owned.

---

## Decision 2 — I wanted to run my own mail. I decided not to

**Date.** 27 September 2026

**What I was torn between.** Moving mail onto my own domain was already done. The question was whether to run delivery itself on my own server. The research was finished and the method was clear.

**What I chose.** **Not to.** Delivery stays with a provider (Fastmail). What I own is the domain.

**What I turned down.** Running my own mail server. **This was the option I wanted.**

**Why.** Because breaking means something different here than anywhere else in the stack. If photo sync stops for three days, the only person inconvenienced is me. **If mail stops for three days, the other person never learns I am unreachable, and their business stops instead of mine.** Worse, delivery failures are quiet — there is no guarantee I would notice.

I also had precedent against myself: I once left the server down for five and a half days while travelling. The reason that cost nothing is that what went down was photos and a calendar.

**Right or wrong in hindsight.** **Right — but it is the kind of call you can never confirm.** The correctness of something you did not do can only be measured in accidents that did not happen.

**What stuck.** Decide what to self-host by asking **who is inconvenienced when it breaks.** If only I am, self-host it. If someone else's business stops, use a provider. "Can it technically be done" is not an input. Doing it because it is possible has the order backwards.

So far nothing else has crossed that line.

---

## Decision 3 — I stopped believing "backups are running"

**Date.** August–September 2026, several times

**What I was torn between.** The nightly backup had been reporting success for weeks. No alerts. Was that good enough?

**What I chose.** **Count it myself.** During a server migration I compared photo counts between the old and new machines by hand.

**What came out.** **Forty-six files existed only on the machine I was about to decommission.** The backup script had been stopping at one step partway through, and everything after that step had not run for weeks. Silently. "Success" had only ever meant "it did not break in a way I would notice."

**Right or wrong in hindsight.** **Right — and I only just made it.** If I had not counted, those forty-six were gone. My reason for counting was not even principled: I was mid-migration and both machines happened to be in front of me.

**Three more wins of the same shape**

- **A mail client migration.** Reported complete. It was not complete.
- **A mail tooling integration.** Reported solved three times. Not solved, three times.
- **A 53,000-message mail migration.** Source and destination counts were "roughly equal", and I nearly called it done. **Six weeks of mail had not transferred at all.** The gap happened to sit just inside my personal tolerance for "roughly". I recovered 7,536 messages only because an export I had made earlier in the migration for an unrelated reason was still sitting in a trash folder. **That is not a restore procedure. That is luck.**

**What stuck.** Three things.

**Treat "success" as a claim, not a result.** Exit code 0, 200 OK, "no alerts", "done" — every one of them answers a narrower question than the one I am asking.

**Verify by a different route than the one that did the work.** Verifying along the same route just runs the same assumption twice.

**Match the granularity of the check to the granularity of what you would miss.** Aggregate comparisons hide compensating errors. If 500 items fail to copy and 480 duplicate, your totals agree and your data is wrong.

---

## Decision 4 — I called the restore direction myself

**Date.** September 2026

**What I was torn between.** Backups were going offsite encrypted. How they come *back* had not been decided.

**What I chose.** **The server pulls from the backup store.** This one was my call.

**Why.** Not for a technical reason. I thought: **if something has to push the data in, then restoring requires that pushing machine to still be alive.** Needing a second working machine in order to recover from the first one dying felt wrong.

**Right or wrong in hindsight.** **Right — and the situation actually arrived.** At one point the configuration file needed to perform a restore existed only *inside* the backup. Keys locked in the safe, safe locked with the keys. Pull was the only direction that works out of that.

**What stuck.** **A backup you have never restored is not a backup.** And being a non-engineer is not a handicap on this kind of call. "What is still in my hands when this breaks" is a question about sequence, not about technology — and sequence is what I do for a living.

---

## Decision 5 — I stopped accepting "build succeeded" as evidence (today)

**Date.** 7 October 2026

**What I was torn between.** I added two articles to this site. Publishing succeeded. **The articles did not appear.**

**What was actually happening.** Two unrelated causes stacked. First, a configuration key in the site generator had been renamed in a newer version — and the old key is simply *ignored*, so the build keeps succeeding and quietly emits nothing. Second, I had dated an article in the future, and the tool does not publish future-dated pages by default. Also silent.

Neither counts as a failure, so the success report was true. **It just answered something other than the question I was asking, which was: can the article be read?**

**What I chose.** Stamp the published output with **the commit it was built from** (`build-id.txt`).

**What I turned down.** "Be more careful next time." I have tried that repeatedly and it has never once worked.

**Why that shape.** What actually hurts me is not knowing which of two things is wrong: is publishing lagging, or did the article get dropped? Those two have opposite responses, and guessing wrong costs hours of waiting. So all I need is to know which commit production came from. **I do not need the cause. Once the problem is halved, finding the cause is Claude's job.**

**Right or wrong in hindsight.** **Unknown.** I added it today, and it pays off the next time this happens. I will come back and fill this in.

**What stuck.** My job is not to find the cause. **It is to cut the search space in half.** That does not require knowing the implementation.

---

## The habits I actually use now

Only the ones that survived the five records above.

**1. When I hear "done", I look at the outcome by a route other than the work.** I only have to look at the result. I do not have to understand the route.

**2. I am most suspicious right after something is fixed.** A problem I have crossed off is no longer being watched, which makes a half-fix more dangerous than no fix.

**3. When a comparison table appears, I hunt for the boring option missing from it.** Just make it bigger. Just stop doing it. Just delete the component. Interesting solutions crowd out boring ones, and at this size the boring one is usually right.

**4. I decide what to self-host by who is inconvenienced when it breaks.** Technical feasibility is not an input.

**5. When the same symptom stops me three times, I build a tool that narrows it down rather than hunting the cause.** The cause was different every time — one error code, three occurrences, three genuinely different root causes. The reason a fourth evening did not go the same way is that the first three were written down.

---

## The question I still cannot answer

One thing is genuinely open.

**Did I win those five because I doubted, or because I happened to be looking?** The forty-six photos surfaced because both machines were in front of me mid-migration. The six weeks of mail survived because of an export sitting in a trash folder. Neither is comfortably a credit to me.

The checks I have put in since are an attempt to convert that luck into procedure. Whether it worked is not yet known. The next time something slips through, it goes here.

---

*The first month, one server, two users. I have not typed it. I have decided it.*

---

*How I would stand the same setup up from scratch, in order, is on its own page: [Standing Up a Self-Hosted Server](/notes/self-hosted-server-setup/).*

**Changelog** — 7 October 2026: first version / 8 October 2026: added a second half covering how I would stand this up from scratch / 11 October 2026: that second half moved to its own page
