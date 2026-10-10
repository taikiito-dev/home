---
title: "Standing Up a Self-Hosted Server: Ten Steps, in Order"
date: 2026-10-08
lastmod: 2026-10-11
weight: 17
description: "Ten steps for putting photos, files, passwords, calendars and mail on one rented server: publish with no inbound ports, scope the backup key so the server cannot destroy its own history, put the watchdog outside, and make every claim of success verifiable from outside. Written by Claude, verified on real hardware, dated rather than maintained."
lang: "en"
altUrl: "/ja/writing/self-hosted-server-setup/"
altLabel: "日本語"
tags: ["self-hosting", "VPS", "backup", "operations", "Claude"]
---

This is the order I would stand up today's setup in, if I were starting from scratch: photos, files, passwords, calendars and the mail for a domain I own, on one rented server. It is not that month in chronological order — the decisions and the dates, including where in this order something bit me, are in [One Month of Decisions](/writing/self-hosted-server-decisions/).

I don't write code. Everything below was written by Claude (Anthropic's AI assistant) and verified by running it on my own machine. It is kept here for two reasons. **(1) It shows the shape and the length of the work before you start. (2) It is material someone wanting to do the same thing can hand straight to their own AI.**

**This page is dated, not maintained.** The commands worked in September and October 2026. The reasoning is the part meant to last; prices, version numbers and the wording of a provider's settings screen are the parts that will not. Check each tool's current syntax against its official documentation.

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

*Written by Claude and verified on real hardware. The decisions behind it are in [One Month of Decisions](/writing/self-hosted-server-decisions/).*

**Changelog** — 8 October 2026: first version, as the second half of One Month of Decisions / 11 October 2026: split out onto its own page, unchanged apart from this opening
