---
title: "Self-Hosting: What I Moved, and What I Refused to Move"
date: 2026-10-13
weight: 17
description: "Five dated decisions from moving off paid services onto a server I rent — most of them decisions not to move something: the passkeys that turned out not to be data, the collaborative editor I counted the files for and did not install, the vendor alias feature that would have created the lock-in it advertises against, the second backup copy that would have tied me to one address, and the one thing I deliberately left unencrypted."
lang: "en"
tags: ["decision record", "self-hosting", "backup", "email", "lock-in"]
---

**It started with a bill, not a principle.** The first move was off a cloud provider because the monthly charge was higher than I wanted to pay for what I was getting. "Data sovereignty" is a phrase I only started using later, after I had already moved things. I am putting that first because the order matters: the reasoning below is the reasoning of someone reacting to costs and annoyances, and then noticing a pattern in his own choices afterwards.

The pattern turned out to be about refusing. **Four of the five records below are decisions not to move something, not to install something, or not to switch something on.** That is the part I have never seen written down, and it is the part that took the actual thinking. Deciding to run your own photo library is easy. Deciding which three things to leave exactly where they are is not.

**What this covers** — Five dated decisions from replacing paid services with ones I run myself, the option turned down in each, and which calls look right in hindsight. The operational detail of how any of it is built is deliberately not here.

A note on what is missing: the disk, and the decision not to run my own mail, are in [the server record](/writing/self-hosted-server-decisions/) and are not repeated.

---

## Decision 1 — I replaced the password manager, and the passkeys were not data

**Date.** 22 August 2026

**What I was torn between.** A commercial password manager that worked fine, against running [Vaultwarden](https://github.com/dani-garcia/vaultwarden) myself. The subscription was $52.19 a year.

**What I chose.** **Self-host it.** The vault moved to Vaultwarden; the subscription was cancelled.

**What I turned down.** Staying. Later, separately, I also turned down splitting my vault into two accounts to keep the most sensitive items away from a machine I do not fully control — I decided to accept that instead, which is a different record.

**Why.** Not the money, in the end. The money was the reason I started looking; the reason I moved was that a password vault is the one store where I most wanted the answer to "who else can reach this" to be nobody.

**What the comparison missed.** **Fifteen passkeys, which could not be exported.** Passkeys are, by design, not extractable — the private key never leaves the authenticator. So there is no migration: for each of fifteen sites you delete the old one and register a new one, by hand, one at a time. It took three days.

Two things inside that were worth more than the decision itself. **The old browser extension has to be fully disabled, not signed out** — while it is enabled it intercepts the browser's requests and the new one never gets a chance to answer. And one of the fifteen was listed in my head as "unused" and was in fact in daily use for work. **I came within one click of deleting the way I log in to something I need.**

**Right or wrong in hindsight.** **Right, with the cost in the wrong column.** I had sorted the move into "data, which is portable" and "subscription, which is cancellable". The expensive part was neither: it was the fifteen credentials that looked like data and behaved like hardware. And the saving did not start that month — I had paid the annual renewal on 2 July and cancelled on 22 August, so I had already bought the year I was leaving.

**What stuck.** **"Exportable" is a property of the format, not of the account.** Before comparing two tools, find out what cannot come with you. And **do not trust your own memory of which entries are unused** — check each one against something outside your head.

---

## Decision 2 — I moved the files and left the collaborative ones behind

**Date.** October 2026

**What I was torn between.** Having moved file storage from Google Drive to a [Nextcloud](https://nextcloud.com/) of my own, the obvious next step was to install a collaborative editor alongside it so documents could be edited in place, the way they had been. The alternative was to accept that my own storage is storage, and nothing more.

**What I chose.** **No editor. Storage only.** Files are edited in desktop applications. Anything that genuinely needs two people typing into it at once stays on the service it is already on.

**What I turned down.** Installing Collabora or OnlyOffice alongside it. Either is a supported, well-documented thing to add.

**Why.** I counted first. In the folder I was migrating — the one with every document for a long-running personal application in it — there were **96 files. Exactly two were native documents of the kind that needs that editor.** The rest were already ordinary files: 54 PDFs, 38 word-processor documents, and a handful of images. No spreadsheets, no slides, no forms.

So the trade was: take on an office suite, and its upgrade path, and its security surface, permanently — to serve two files. I exported those two by hand instead. **That took about a minute, once.**

**Right or wrong in hindsight.** **Right.** Neither of those two files has needed editing since. Had I installed the suite, I would now be maintaining it for a use that has not recurred.

**What stuck.** **Count what the feature is for before you adopt the feature.** The instinct is to match what you are replacing, feature for feature; the question is how many times the feature was actually used. **A migration does not have to be total in order to be finished.**

---

## Decision 3 — I did not use the vendor's address-masking feature

**Date.** 29 September 2026

**What I was torn between.** I wanted a separate email address per service, so that any one of them can be switched off without touching the others. My mailbox was on iCloud at the time, and Apple's **Hide My Email** is exactly that feature — included, at no extra cost, already switched on. The alternative was to build the same thing on a domain I own.

**What I chose.** **Aliases on my own domain.**

**What I turned down.** Hide My Email — the convenient one, the one that was already there.

**Why.** Every address it generates ends in a domain that belongs to the vendor. **So the feature whose purpose is to let me leave a service at will can only be used by permanently not leaving the vendor who provides it.** On the day I stop paying them, every address stops — all of them, at once, which is the failure I was trying to make impossible in the first place.

Stated generally: **the alias layer and the mailbox layer should be two different things.** If they are separate, either one can be replaced without disturbing the other. If the alias layer is a feature of the mailbox, they are one thing wearing two names.

**Right or wrong in hindsight.** **Right, and proved so within weeks.** In late September 2026 I moved my mailbox off iCloud to Fastmail — one of the ordinary, unglamorous moves that this whole exercise is supposed to make survivable. It touched nothing else. **Had my per-service addresses ended in `@icloud.com`, that single move would have required re-registering an address at every service I use, simultaneously, under time pressure** — and leaving Apple is precisely the situation those addresses were supposed to protect me through.

I did not foresee the move when I made the decision. **The decision was right for a reason I had not thought of yet**, which is the strongest argument I know for reasoning about the day you leave rather than about the next twelve months.

**What stuck.** **Test a convenience feature against the day you stop using the thing that provides it.** If that day breaks everything the feature touched, the feature is a dependency being sold as independence. And **keep the layer that holds your names on a name you own.**

---

## Decision 4 — The second copy is not a machine of mine

**Date.** September 2026

**What I was torn between.** One copy of everything is not a backup, so the question was where the second copy lives. I had a capable machine at home, already paid for, sitting idle. Pointing the backup at it costs nothing per month.

**What I chose.** **Object storage I do not own or operate** — [Backblaze B2](https://www.backblaze.com/cloud-storage) — with the arrangement set up so that deletions do not follow the data all the way to the furthest copy.

**What I turned down.** The machine at home. It was the cheapest option available and I turned it down for a reason that is not technical.

**Why.** **It assumes I will go on owning a machine, in one place, plugged in and switched on.** I intend to be living somewhere else. A backup design that depends on an address is a design with my address as a component, and components get moved.

That is not a hypothetical cost — it is the cost of having to re-plan the whole thing at the exact moment I am busy with a relocation, which is also the moment I would least like to discover that my second copy is in a box.

**Right or wrong in hindsight.** **Right, and faster than I expected.** Within weeks the machine at home stopped being a server at all — everything moved to one I rent, in late September 2026. **Had the second copy been on that machine, the migration would have carried away the backup along with the thing being backed up.** I would have had one copy during the single riskiest week of the year.

**What stuck.** **Check a plan against where you intend to be living, not only against what it costs per month.** Hardware answers are cheap because they move the cost from money into location, and the location term does not appear in any comparison table. And **the second copy should fail for different reasons than the first.** One in a rack and one on my desk is two copies with one weather forecast.

---

## Decision 5 — I deliberately left one thing unencrypted

**Date.** 28 September 2026

**What I was torn between.** Everything in the backup is encrypted before it leaves my control, so that the place storing it holds something it cannot read. The obvious policy is: everything, no exceptions. The password vault's own files were the exception I was considering.

**What I chose.** **Leave the vault's data out of that encryption.**

**What I turned down.** Applying the rule uniformly, which is the version that is easier to describe and easier to feel good about.

**Why.** **The vault is where the encryption key is kept.** So encrypting it closes a loop: to decrypt the backup you need the key, the key is in the vault, and the vault is inside the encrypted backup. The recovery path arrives back where it started. On the one day the backup is for, uniformity would be the thing that makes it useless.

The second half of the reason is that the exception costs little: a password vault's contents are already encrypted by the vault itself, with a key the storage provider never sees. The outer layer would have been a second lock on a locked box, bought at the price of making the box impossible to open.

**Right or wrong in hindsight.** **Right, and it exposed a rule I had been missing.** Which is: **a key that can be re-issued does not belong in the vault; only a key that cannot be re-issued does.** Storing a re-issuable credential adds one more copy of a secret and buys nothing, because the recovery move for that credential was never "find it" — it was "issue a new one". I had been collecting things in there out of diligence.

**What stuck.** **"Encrypt everything" is a slogan, not a policy.** Draw the recovery path as a sequence and look for a step that requires the thing you have not recovered yet. **Any rule applied uniformly to a system that contains its own keys will produce a cycle somewhere.** Find it on a quiet afternoon rather than on the bad day.

---

## What generalises

1. **Before comparing two tools, find out what cannot be exported.** The cost is rarely in the data; it is in the credentials, the integrations and the habits.
2. **Count the uses before adopting the feature.** Matching your old setup feature-for-feature imports work that nothing was asking for.
3. **Judge every convenience against the day you leave.** A feature that only works while you stay is a dependency, whatever it is called.
4. **A plan that requires you to stay in one place has your address as a component.** Put that in the comparison, because no vendor will.

## The question I cannot answer

**All five of these look right in hindsight, and four of them are refusals — which is exactly the shape you would expect if I were grading myself generously.** A refusal is easy to call correct, because the alternative never happened and cannot argue back. I cannot tell you what the office suite would have cost me, because I never installed it.

What I can say is that two of the five were overtaken by events within weeks — a mailbox move and a server move that I had not planned when I decided — and in both cases the decision held for a reason I had not thought of at the time. That is not proof. It is the closest thing to evidence I have.

— Taiki Ito
