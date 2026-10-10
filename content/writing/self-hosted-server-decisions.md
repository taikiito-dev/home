---
title: "Running My Own Server: One Month of Decisions"
date: 2026-10-07
lastmod: 2026-10-10
weight: 16
description: "A non-engineer's record of moving photos, files, passwords, calendars and mail onto one rented server and running it for one month: five dated decisions, the options turned down, which calls look right in hindsight, and how to stand the same setup up from scratch."
lang: "en"
altUrl: "/ja/writing/self-hosted-server-decisions/"
altLabel: "日本語"
tags: ["decision record", "self-hosting", "VPS", "backup", "operations"]
---

I am not a software engineer. I negotiate crude oil contracts for a living and I have never held a job that involved writing code. **Until September 2026 I had nothing to do with software at all** — no server of my own, no command line, none of it.

**What this covers** — Putting photos, files, passwords, calendars and the mail for a domain I own onto one rented server, and keeping it running since September 2026. Five dated decisions, and the options I turned down. The implementation notes are in the [second half](#implementation).

In September 2026 I started moving what I had been keeping on large cloud services onto a single server I pay a monthly fee for. Photos, files, passwords, calendars, and eventually mail.

The reason was simple: **I did not like that the terms of custody could change at the custodian's convenience.** Price rises, feature removals, policy changes, account suspensions. None of them are things I can stop. At some point it stopped sitting well with me that everything of the irreplaceable kind — photographs going back to childhood, years of correspondence — was stacked on top of things I could not stop.

That server has been running since September 2026. Two users. It has not been out of my hands for a day.

This page is a record of **what I decided** over the first month: what I was torn between, which option I took, which ones I turned down, and whether the call looks right or wrong from here. With dates. Decisions in the first half, implementation in the second: **what I would do, and in what order, to stand this up from scratch** is written out in the [second half](#implementation).

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

# Implementation

Everything below was written by Claude (Anthropic's AI assistant) and verified by running it on my own machine. It is kept here for two reasons. **(1) It shows the shape and the length of the work before you start. (2) It is material someone wanting to do the same thing can hand straight to their own AI.**

This is not that month in chronological order. It is **what I would do, and in what order, to stand up today's setup from scratch.** The five records above are a log of where in this order something bit me. The commands worked in September and October 2026, so check each tool's current syntax against its official documentation.

## The environment this assumes

- One rented server (Ubuntu 24.04). As of September 2026, 6 vCPU / 12 GB RAM / 200 GB SSD / unmetered transfer came to $9.00 a month, no setup fee, on a one-month term
- Docker Engine and `docker compose` available
- One domain I own
- Object storage at a different company (I use Backblaze B2). **Not the same company as the server**
- A second computer, separate from the server. **Firewall verification is impossible without it** (Step 2)

## Step 1: Choose the server and own the domain

**The plan is decided by memory and disk.** Budget 1.2–1.5× your measured data for disk. Against 115 GB of photos plus 16.6 GB of files, I estimated 170–180 GB including OS, Docker and databases, and started at 200 GB.

**Memory is decided by the number of containers, not the volume of photos.** I nearly got this wrong — "if old photos move off, memory can shrink too" is false. I run 14 containers permanently, and I have a history of every service repeatedly falling over from memory exhaustion. On top of that, **a rented server has no GPU, so face recognition and image search run on CPU and system memory, which pushes the memory requirement up rather than down.** Shrink later, once it has proven stable.

**Region is not decided by proximity.** My first-choice region carried a surcharge and was out of stock at the order screen. Switching to a region with no surcharge had a side effect: **the path to the backup store got shorter, which made both the restore and the nightly backup faster.** The latency figures on the order screen are **raw network latency and do not apply to a setup running through a tunnel.**

**I skipped the annual-term discount.** Being unable to walk away quickly if the provider disappoints defeats the purpose.

**Own the domain yourself and leave mail delivery to a provider.** This is the single highest-return thing of that month: because the address is mine, I can change providers without telling anyone my address changed. Why I did not self-host delivery is in Decision 2.

## Step 2: Publish without opening any inbound ports

**Stop punching holes inward through a router or firewall; use a tunnel the server dials outward.** I use Cloudflare Tunnel. The entry point narrows to one, and the server's address never appears publicly.

On top of that, **bind containers to loopback from day one.**

```yaml
ports:
  - '2283:2283'            # 🔴 opens on every network interface
  - '127.0.0.1:2283:2283'  # ✅ reachable only from the machine itself
```

The tunnel daemon runs on the host and talks to `localhost`, so loopback binding does not affect what is published. **Behind a home router both forms behave identically; on a server with a public address they are nothing alike.** I deliberately rest my defence on this design rather than on the firewall. A firewall reverts to defenceless if one line disappears; nothing listening outward has nothing to delete.

Take the inventory by **exclusion**.

```bash
# 🔴 this misses things
ss -tlnp | grep 0.0.0.0

# ✅ exclude "myself" and look at everything that is left
ss -tlnp | grep -vE "127\.0\.0\.|\[::1\]"
```

The form `*:PORT` (listening on both IPv4 and IPv6) never matches `0.0.0.0`. That is how 19 unauthenticated ports escaped my notice. **Processes running directly on the host are not stopped by Docker-oriented firewall rules**, so looking only at containers is not enough. **Having closed IPv4, always check IPv6.** They are entirely separate configurations.

Verify **from the second computer, always**.

```bash
nc -vz <server address> 2283   # → Operation timed out  is correct
nc -vz <server address> 22     # → succeeded!            is correct
nc -vz -6 <IPv6 address> 2283  # measure IPv6 too
```

Connecting to your own public address from inside the server takes an internal path, so **it reports "connected" even when the port is closed.** Write this down as a fixed check to run after a reboot, after touching the firewall, and after touching container configuration.

## Step 3: Add services one at a time

Do not add them in batches. For each one, register it in three places before moving on — the tunnel's routes, the backup's targets, and the monitoring's targets. **Something added later that is missing from exactly one of the three** is what ends up costing the most.

What I run today: photos, files, passwords, calendars and contacts, the login front door, a git repository, uptime monitoring, and the chat-and-calendar app I built for myself.

**HTTP 200 is not proof of function.** I have had a service return 200 after a cutover while the thing inside it did not work. **Before the cutover, exercise one real round trip through the service itself.** If anyone other than you uses it, this step is not optional.

## Step 4: Put a single front door in front of them

Stop keeping a separate password in each service and put a single sign-on front door (I use Authentik) ahead of them.

Two holes I actually fell into here.

🔴 **When you remove the password stage, look at what the second-factor stage does for users who have none configured.** Mine was set to skip, which almost left the state where **a user with no authenticator at all could log in with a username only.** Change it to deny.

🔴 **Consolidating the front door does not close each app's own login door.** Moving the front door to passkeys leaves the app's own native login page alive. Each one has to be disabled, or blocked upstream.

**Keep more than one way back in.** I built a browser-based route, but it authenticates through the front door itself, so **it is unusable precisely when the front door is shut** — it is circular. A way back in must not pass through the front door. Mine are direct SSH from my own machine, and the provider's console. Keep a second copy of the second-factor backup codes **somewhere other than the password server**, for when the password server is the thing that is down.

## Step 5: Build the backup so it reports every step

This is the part I rewrote most.

**The script emits `OK`/`FAIL` per step and a completion marker at the end.** With `set -e` and an abort partway through, nobody can tell what finished. My old script **completed only 5 of its 34 runs** — the last step was stalling on a password prompt. **A completion marker had been absent for a month and nobody noticed**, which means a real failure was equally undetectable.

⭐ **Audit the denominator.** "All 33 succeeded" only says "the 33 I decided to do all passed." **A service missing from the script fails silently forever.** No log will ever tell you. Audit it from three directions at once.

```bash
docker ps                             # containers
systemctl list-units --type=service   # what runs under systemd
ls /home/<user>                       # where the data lives
```

**Look from one direction only and the other is structurally invisible.** That was my hole: part of my own app ran under systemd rather than Docker, so it never appeared in `docker ps`, and as a result **not one systemd unit definition, `crontab`, or firewall rule was in the backup.** All the data comes back, and how to start it does not.

📌 **`rclone` silently skips symlinks.** Half of `/etc/systemd/system` is symlinks, so dereference with `cp -aL` before handing it over. Miss this and you get "synced" directories that are actually empty.

I now run this audit automatically once a month, and it reports **only when something is uncovered.**

## Step 6: Keep the restore keys outside the server

**Restore by having the server pull from the backup store.** A push model requires the pushing machine to still be alive. Needing a second working machine in order to recover from the first one dying is backwards. That is Decision 4.

Then **copy the keys and configuration needed to pull outside the server.** I keep four secure notes in my password server.

1. The `rclone` configuration, including the object-storage access key
2. The tunnel's configuration and credentials
3. The full set of `docker-compose.yml` files
4. Environment files and systemd unit definitions

A password-manager mobile app keeps an offline cache once logged in, so these come out of a phone even with no access to the server at all. **Saving them is not the end of it.** Verify from a different device that **the values in those notes alone are enough to see everything in the backup store.** I turned that into a script and **run it every time I rotate a key.**

**Do one restore test.** I rebuilt a directory from the raw files in the store and confirmed 124 files matched exactly under `diff -rq`. **A backup you have never restored is not a backup.**

## Step 7: Make the backup hard to delete

If taking the server also means deleting the backups, going offsite was only half useful.

**① Narrow the key on the server to what it actually uses.** Mine held 18 capabilities, including **immediate purge via lifecycle rewriting and the ability to stop the replication rule.** "Thirty days of version retention makes it safe" was not true. The script only ever uses list, read, write and delete — five capabilities. **The key-creation UI in the web console cannot select capabilities finely**, so the provider's CLI is required. It handles the master key, so run it from your own machine, not the server.

**② Create a replication target that deletions do not propagate to.** My provider's replication **does not replicate deletions or hide markers**, which makes the destination a structurally append-only mirror. If the key on the server is scoped to the source bucket, it structurally cannot reach the destination.

**① and ② are a pair, and ① comes first.** Without ①, the server side can simply switch off the replication rule from ②.

**Two easy mistakes in the destination's lifecycle settings.** Do not choose "keep only the last version" — the moment of an overwrite attack destroys the good older version, which was the entire point of the second copy. Leave the "days from upload to hiding" field empty — a number there auto-deletes the live backup itself. The only field to fill is "days from hiding to deletion." I set 180 days because nightly-overwritten database dumps otherwise **accumulate about 80 GB a year.**

**After rotating a key, measure that the old key is really dead.** My rotation script now refuses to write the configuration file unless read, write and delete tests all pass first.

🔴 **I broke this once.** The rotation script *rebuilt* the configuration file, which wiped out an encryption remote added later, and the next backup lost five steps outright. **When you add something to the configuration, go find the existing scripts that rewrite it.** Nothing in the name "key rotation" suggested it reconstructed the whole file.

## Step 8: Put the watchdog outside the server

Run uptime monitoring on the same server and **the monitoring dies with the server, so no notification goes out. The one failure you most want reported is the one that is not.**

Make it two tiers. The monitor on the server covers the fast case at one-minute intervals; **the monitor outside the server covers the case that must never go quiet**, however slow it is. I run the second one on GitHub Actions (GitHub runs a script on a schedule it decides) at 30-minute intervals.

What mattered in the decision logic.

- **Treat 4xx as alive.** A service behind a login correctly returns 302 or 401 when unauthenticated; calling that a fault means permanent false alarms. Only 5xx, refusal and timeout count as down
- **Require three consecutive failures before declaring a fault.** That is the buffer against a brief network drop. Monitoring software that defaults to "one failure, instant fault" should be brought into line
- **Notify only on transitions.** No repeated alarms while something is down. On recovery, include how long it was out. When everything goes down at once, change the wording to say the whole server is likely gone

🔴 **Scheduled runs on an external service have a trap.** GitHub **automatically disables scheduled runs after 60 days with no repository activity.** No fault means no commit, so **a long healthy stretch silently stops the monitoring.** Commit an observation every 7 days even when nothing changed. Also, **scheduled runs can be badly late** — I measured over five hours — so do not write explanations that depend on the clock. The value here is not speed; it is never going quiet.

## Step 9: When disk runs out, just make it bigger

Per Decision 1, **the first thing to look at is the extend button in your existing provider's control panel.** No reinstall, no migration, no new components. Go looking for the boring option the comparison table left out.

Practical notes.

- The added space shows up as **an expansion of the existing disk** (not as an extra disk). But **the partition and the filesystem do not grow by themselves**
- In my environment `growpart` plus `resize2fs` expanded it online with no downtime. That assumes the partition being expanded is the last one with contiguous free space right after it, so **confirm with `--dry-run` first**
- This **rewrites the root partition table**, so running the backup by hand and confirming every step is `OK` beforehand is mandatory practice
- ⚠️ **The official help said no reboot was required, and a forced reset happened anyway.** Budget downtime for expansion work

Per terabyte, extending the disk is the **most expensive** option. At my size the difference was a few dollars a month, and "spend those few dollars to avoid complexity" was correct. **The answer inverts with scale**, so I wrote down a threshold: if the old data I would offload exceeds 1 TB, revisit the method.

## Step 10: Make claims of success verifiable from outside

Finally, turn what Decisions 3 and 5 left behind into tooling.

**Stamp published output with the source it was built from.** I put a file at the root of the site's published output (`build-id.txt`) containing the source commit id, the build time and the ref. Comparing production's copy with the latest source separates "publishing is lagging" from "the content got dropped." Those two have opposite responses, and guessing wrong costs hours of waiting. **I do not need the cause. Halving the search space is enough.**

🔴 **The probe you separate with must be something that changes every time.** I once byte-compared a file between production and source and declared delivery healthy — but **that file's content had not changed in the most recent publish.** It matches even when delivery is frozen, which made it **a test that could not fail.**

Apply the same shape to data. **Never verify a restore or a copy by matching counts.** My numbers were 60,525 against 60,619 — a 0.15% gap, well inside what I would wave through. **Check that every path recorded in the database actually exists**, one by one. Aggregate comparisons hide compensating errors.

And **verify by a different route than the one that did the work.** Verifying along the same route just runs the same assumption twice.

---

*The first half of this page is a record of decisions; the implementation in the second half was written by Claude and verified on real hardware.*

**Changelog** — 7 October 2026: first version / 8 October 2026: added a second half covering how I would stand this up from scratch
