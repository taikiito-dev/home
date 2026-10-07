---
title: "Exit Code 0 Is Not Evidence"
standfirst: "Fourteen months of running my own infrastructure, and the eleven times a tool told me everything was fine."
description: "Eleven documented failures from fourteen months of self-hosting, and the one pattern they share: a tool reported success, and the report was true in a narrow sense and false in the sense that mattered."
---

I am not a software engineer. I negotiate crude oil contracts for a living. In 2025 I started moving my family's data off other people's servers and onto one I pay for, and I have been operating it since.

What follows is not a how-to. The deployment guides already exist, and mine would not be better than theirs. This is the other half — the part that does not get written down, because it is embarrassing and because the person who lived it is usually too busy to stop and write it.

Every incident below has the same shape. A tool reported success. I believed it. The report was true in a narrow sense and false in the sense that mattered.

## What I run

A single virtual private server. Docker Compose, a reverse proxy, and an outbound-only tunnel — nothing is exposed by opening ports inward. On top of that: a photo library, a file-sync server, a password vault, a calendar server, a self-hosted identity provider doing single sign-on, a git server, an uptime monitor, and a progressive web app I wrote myself. Two daily users.

Encrypted offsite backups go to a different company's object storage on a nightly schedule. I also moved roughly 53,000 messages onto a mail domain I own, with strict sender authentication, which means I can change providers without telling anyone my address changed. That last part is the whole reason the exercise is worth doing: the address is mine, so the vendor is a replaceable part.

Fourteen months. Here is what went wrong.

---

## 1. The backup script that stopped and said nothing

**Symptom.** After migrating to a new server, forty-six photos existed only on the machine I was about to decommission.

**What I believed.** The nightly backup had been running for months. It exited. No alerts. Therefore it was backing everything up.

**What was actually true.** The script began with `set -e`. One step failed partway through — and `set -e` did exactly what it is designed to do: it stopped the script. Everything after that step never ran, every night, silently. The script's "success" was only the absence of a crash I would have noticed.

**How I found out.** Not from monitoring. From manually comparing file counts between the two machines during the migration, because I happened to be looking.

**What I changed.** I rewrote it so each step reports its own outcome, and the script ends by printing either a clear all-clear line or a clear failure line. It no longer halts at the first problem; it attempts everything and tells me what did not work. `set -e` is correct for a script whose output you read. It is actively dangerous for one that runs at 2 a.m. while you are asleep.

**The general lesson.** A backup that has never been restored is not a backup, and a backup job whose only failure signal is "did the process crash" is not monitored. Ask of any automated job: *if one step inside this failed last night, how would I learn?* If the answer is "I wouldn't," that job is decoration.

---

## 2. The sync tool that deleted files and returned success

**Symptom.** Files present at the destination disappeared after a routine sync.

**What I believed.** `sync` means "make the destination match the source." Safe, idempotent, boring.

**What was actually true.** It *is* one-way mirroring, which means it deletes at the destination — that part was my misreading and I own it. But the sharp edge was this: symlinks were skipped with a warning, and the real files at the destination were removed. This happened even for symlinks pointing at nothing. **And the exit code was 0.** There was no failure to detect, because by the tool's own definition nothing had failed.

**What I changed.** I no longer use one-way mirroring against anything I care about. Restores use a copy operation that never deletes. Before any mirroring run I check explicitly for files that exist *only* at the destination. For a library of around 59,000 files that comparison takes about four minutes, which is a price I am now happy to pay.

**The general lesson.** Exit code 0 means *the program finished the thing it thought it was doing*. It does not mean *the outcome you wanted happened*. Where those two can diverge, you need a separate check that measures the outcome rather than the process.

---

## 3. Testing a firewall from inside the firewall

**Symptom.** None. That is the point.

**What I believed.** I had blocked a set of ports. I verified it by connecting to my own public address from the server itself and confirming the connection behaved as expected.

**What was actually true.** My blocking rules were scoped to traffic arriving on the external interface. A connection originating on the box to its own public address never traverses that interface — it takes a local route. **So the test could only ever report "reachable."** It was structurally incapable of detecting the failure it existed to detect, and it failed in the dangerous direction: the one where everything looks fine.

**What I changed.** All external reachability testing now happens from a machine that is not the server. It is one extra step and it is not optional.

**The general lesson.** A test that cannot fail is not a test. Before trusting a verification, ask what result you would see if the thing being verified were broken. If you cannot describe that result, you have not verified anything.

---

## 4. Closing the door and leaving the window open

**Symptom.** Two services that should have required authentication were reachable from the open internet.

**What I believed.** I had found an exposure, written blocking rules, confirmed the ports were closed, and moved on. I had marked the task done.

**What was actually true.** I had written rules for one address family. The server also has a public address on the other, and the container runtime was listening on both. That path was untouched — no rules at all. The login screens for two services had been publicly reachable the entire time I believed I had fixed the problem.

**What I changed.** Every network rule is now written and verified for both address families, and my reachability check tests both explicitly. Separately, and more importantly: I stopped relying on blocking rules as the primary defence. Services bind to the loopback interface and are reached only through the tunnel. Firewall rules are the second layer now, not the first.

**The general lesson.** This is the most uncomfortable category of failure I have: **"I solved it" when I had solved half of it.** It is worse than an unsolved problem, because an unsolved problem is still on the list. A half-solved one has been crossed off.

---

## 5. The ports my search pattern could not see

**Symptom.** A routine audit of listening sockets showed nothing unexpected. A later audit, done differently, found nineteen.

**What I believed.** To list what is exposed, show the listening sockets and filter for the wildcard address.

**What was actually true.** A socket listening on both address families displays with a different wildcard notation — the string I was filtering for was not in it. My pattern was searching for something that was not there and returning an empty result, which I read as "nothing exposed."

I had also assumed exposure could only come from container port mappings. These were host processes, which my mental model did not cover at all.

**What I changed.** I inverted the filter. Instead of listing what matches "exposed," I list everything and **exclude** what is provably local. Anything left that I do not recognise gets investigated rather than filtered away.

**The general lesson.** Allowlist your audits; do not blocklist them. A filter built from "things I expect to be bad" can only find the problems you already imagined. A filter built from "things I have confirmed are fine" surfaces the ones you did not.

---

## 6. The flag in the wrong position, and the zero that hid it

**Symptom.** A configuration I had validated turned out to be invalid.

**What was actually true.** I had placed the config-file flag after the subcommand instead of before it. The tool did not recognise the flag in that position — and **returned exit code 0 anyway**, having validated nothing. I read the zero as "configuration is valid."

**What I changed.** For anything that validates rather than acts, I now confirm the tool actually read the file I meant — usually by feeding it something deliberately broken and checking that it complains. If it does not complain about a broken file, it was never looking at my file.

**The general lesson.** Validation tools are the easiest place for a false pass to hide, because a passing validation produces no output to be suspicious of. **Test your tests with a known-bad input.**

---

## 7. The 200 OK that hid a month-long failure

**Symptom.** A site served fine over plain HTTP. Encrypted requests failed.

**What I believed.** The site was up. I checked it repeatedly over several weeks and it responded every time.

**What was actually true.** The TLS certificate had never finished issuing. Plain HTTP worked perfectly, which is exactly why I did not investigate — I was checking the wrong protocol and getting a reassuring answer. This went on for about a month.

The root cause was two layers down and entirely mine: my publish step force-pushed, rewriting history on every deploy. The certificate issuance process kept getting reset to the beginning. I had tried removing and re-adding the domain more than ten times, which addressed nothing, because the thing undoing my fix ran every time I published.

**What I changed.** I check certificate state as a field I query, not as "does the page load." And in the end I removed the component causing it from the path entirely rather than continuing to fight it. **Sometimes the fix is deleting the thing, not repairing it.**

**The general lesson.** Two. When a symptom survives ten attempted fixes, the problem is not the thing you keep fixing — stop and look for what is undoing your work. And a success response from a layer you are not testing is not evidence about the layer you are.

---

## 8. "Roughly the same number" is not verification

**Symptom.** Thousands of messages nearly lost during a mail migration.

**What I believed.** Source and destination had approximately matching counts. Migration complete. I started deleting from the source.

**What was actually true.** Six weeks of mail had not transferred at all. The totals happened to be close enough that the discrepancy sat inside my tolerance for "roughly." I recovered about 7,500 messages, and only because an export I had made months earlier for an unrelated reason still existed. That is not a recovery procedure. That is luck.

**What I changed.** Migrations are verified by matching unique identifiers, per item, not in aggregate. And nothing is deleted from a source until the destination has been verified by a *different* method than the one that performed the copy.

**The general lesson.** Aggregate checks hide compensating errors. If 500 items fail to copy and 480 duplicate, your totals look fine and your data is wrong. The verification has to be at the granularity of the thing you would miss.

---

## 9. Benchmarking two different things and believing the number

**Symptom.** I measured encrypted storage as roughly fifteen times slower than unencrypted, and nearly made an architectural decision on that basis.

**What was actually true.** The two mounts I was comparing had different caching and read-chunk settings. I was not measuring encryption overhead. I was measuring my own configuration difference. With the settings aligned, the real gap was well under a second on a 17 MB file — a genuine cost, and a trivial one.

**What I changed.** Any A/B comparison now starts by diffing the configuration of A and B, and I make the measurement reproduce before I believe it.

**The general lesson.** A number that supports a decision deserves more scepticism than one that does not, and a surprisingly *large* effect is usually a methodology error rather than a discovery. I was about to accept a worse design to avoid a cost that did not exist.

---

## 10. Three architectures compared, and the button I never clicked

**Symptom.** Running out of disk. Weeks of comparative analysis.

**What I believed.** Growing past my disk meant choosing between offloading old data to object storage over a network filesystem, moving to a different storage product, or migrating to a larger server. I evaluated all three in detail — per-terabyte costs, egress behaviour, failure modes, migration runbooks.

**What was actually true.** My provider's control panel has a button that extends the existing disk. No reinstall, no migration, two commands afterwards to grow the partition and the filesystem. I had never considered it. I found it because I stopped and asked the dumbest available question: *can I just make this disk bigger?*

At the size I actually needed, extending the disk is the most expensive option per terabyte — and it was still correct, because the alternatives cost a few dollars a month less and a great deal of complexity more.

**What I changed.** Before comparing architectures, I check whether the current setup has a boring parameter I can simply increase.

**The general lesson.** This is my favourite failure, because nothing broke. I just spent weeks solving a harder problem than the one I had. **Interesting solutions crowd out boring ones, and at this scale the boring one is usually right.** Worth saying plainly: the question that found it was mine, asked out of frustration, against the grain of the analysis I had already done.

---

## 11. Secrets in a history, put there by a method I had already replaced

**Symptom.** A private repository's history contained a server's private key, service configuration files, and an expired API token.

**What was actually true.** Those files were tracked because, at one point, committing them *was* how they got backed up. Later I moved backups to encrypted object storage — which made the tracking unnecessary. **Nobody removed it, because removing it was not a step in setting up the new method.** The old mechanism kept running correctly, doing something that was no longer wanted.

**What I changed.** Removed the files from tracking, rotated what needed rotating. And adopted a rule I now apply generally: **when you replace a mechanism, explicitly audit what the old one was doing and turn that off.** Migration checklists are good at adding the new thing and bad at subtracting the old one.

**The general lesson.** The dangerous legacy system is not the one that is broken. It is the one that still works.

---

## What I actually do differently now

Not best practices. Five habits that came out of the failures above.

**I treat a success report as a claim, not a result.** Exit code 0, 200 OK, "no alerts," "the process is running" — each answers a narrower question than the one I am asking. For anything that matters, I check the outcome by a different route than the one that produced it.

**I ask what a failure would look like.** Before trusting a check, I describe the output I would see if the underlying thing were broken. If I cannot describe it, the check is theatre. This is what the firewall test taught me and it is the highest-return habit on this list.

**I am most suspicious right after I fix something.** The address-family incident and the certificate incident were both "solved" problems. A problem I have crossed off is no longer being watched, which makes a half-fix more dangerous than no fix. I now re-verify from scratch rather than from the state of mind of having just succeeded.

**I check for the boring parameter before designing anything.** Can I make this bigger. Can I turn this off. Can I delete the component instead of repairing it. Twice now the answer was yes, after I had already built the complicated version in my head.

**I write the failures down at the time.** Not for an audience — because by the second occurrence I could not remember what I had already ruled out. One error code in particular I diagnosed three separate times with three different root causes, and the only reason I did not lose a fourth evening to it is that the first three were written down. Those notes are the reason this page exists. I did not reconstruct any of it from memory.

---

## Why publish this

Two reasons.

The guides for setting this up are good and plentiful. The record of what it costs to *keep* it running is almost nonexistent, which means everyone arriving at this decision estimates the hard part from no data. I had to learn all of the above by hitting it. Someone else can have it for free.

And a narrower one. I came to this without a software engineering background, which meant I had no instinct for which reassuring signals to distrust. That turned out to be the actual skill — not knowing the commands, but knowing which confirmations are worthless. If you are in the same position, the list above is roughly what I would have wanted on day one.

---

*Fourteen months, one server, two users, eleven documented failures. Still running.*
