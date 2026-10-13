---
title: "Self-Hosting: What I Moved, and What I Refused to Move"
date: 2026-10-13
weight: 17
description: "How running one AI assistant at home turned into owning the photos, files and passwords too: the terms-of-service moment that turned a convenience into a principle, who actually picks the software when an AI does the research, and two deliberate refusals — the second backup copy, and the one store left unencrypted."
lang: "en"
tags: ["decision record", "self-hosting", "data sovereignty", "backup", "Claude"]
---

**It started because my assistant could not leave the house.** I was running [MulmoClaude](https://github.com/receptron/mulmoclaude) the way its README describes: on a machine at home, for the person sitting in front of it. Which was fine until I was not in front of it. Away for work or travel, the assistant I had spent weeks shaping was unreachable, and that was enough to make me look into renting a server.

The part I still find funny is who did the moving. **I decided to migrate; Claude — the thing being migrated — did the work.** It wrote the commands, carried its own workspace across, and reported when it was done. That division of labour has held for everything since: I do not write code. I decide what gets built and why, and I check whether it is actually true when I am told it is done.

So the first move was convenience, not principle. **The principle arrived later, with the photos** — and the records below are roughly the story of that arrival: two things I moved, two things I deliberately refused to do, and what each one taught me.

A note on what is missing: the disk, and the biggest refusal of all — wanting to run my own mail and deciding not to — are in [the server record](/writing/self-hosted-server-decisions/) and are not repeated here.

---

## Decision 1 — I moved the photos out when I realised whose they were

**Date.** 24 August 2026

**What I was torn between.** Years of photos in Google Photos, which worked, against running [Immich](https://immich.app/) on my own machine.

**What I chose.** **Move them.** All of them.

**What I turned down.** Staying, which cost nothing and required nothing.

**Why.** It began with a terms-of-service update, and the realisation that I could not confidently answer what Google was permitted to do with the images — whether, for instance, they could be recompressed in storage without anything I would recognise as consent. I read terms for a living; it bothered me that I could not answer this about my own photographs.

And once I tried to answer it, the bigger thing underneath came into focus. **The practical owner of those photos was not me.** They sat on Google's machines, under Google's terms, which Google can revise. From there the last piece fell in: I had never really asked why Gmail and fifteen gigabytes of storage are free. They are free because **the data is worth more than the storage costs**. I was not being given a service; I was the supply.

I do not think any of this is a revelation to people who work in technology. It was a revelation to me, and the feeling it left was specific: **my data has value, and I wanted the deciding vote on what happens to it.**

**Right or wrong in hindsight.** **Right — with an honest note on what it did and did not buy.** It did not make the photos more secret in any deep sense; a determined adversary was never the threat I was pricing. What it bought is narrower and, to me, worth more: **the terms can no longer change under me.** Whatever goes wrong with my photos from now on will be something I did, which is a failure mode I can work with.

**What stuck.** **"Free" is the price of the storage, not the price of the data.** And when you cannot say who owns a thing you made, you already have your answer.

---

## Decision 2 — The software was proposed by an AI. The lineup is mine

**Date.** August–September 2026

**What I was torn between.** For every service I was replacing there were several open-source candidates, and the research on all of them was done by Claude. The question nobody frames out loud: when an AI does the comparison, **who is actually deciding?**

**What I chose.** **Claude proposes; I decide — and "decide" means I can say, in my own words, why each piece is there.** The lineup that survived that filter: Immich for photos, [Nextcloud](https://nextcloud.com/) for files and contacts, [Vaultwarden](https://github.com/dani-garcia/vaultwarden) for passwords, [Radicale](https://radicale.org/) for calendars, [Joplin](https://joplinapp.org/) for notes.

**What I turned down.** Accepting a recommendation as if it were a decision. They look identical on the day you install something. They are not the same thing, and the difference appears later, when something breaks and the person who must answer for it is me.

**Why.** Two tests, applied to every candidate. **Can I leave it** — is the data in open formats or standard protocols, so that this choice never becomes the lock-in I had just escaped. And **can I explain it** — if I cannot restate in my own words why a component is in the house, I cannot run it, defend it, or notice when it goes wrong.

**What it cost, in one paragraph.** The password move had a bill nobody's comparison table showed: fifteen passkeys, which by design cannot be exported — the key never leaves the device that made it. So there was no migration, only fifteen rounds of delete-and-re-register, by hand, over three days. Somewhere in the middle I nearly deleted one I had mentally filed as unused; it was a work login I use daily. **What cannot be exported is the real switching cost, and you find out what that is only by leaving.**

**Right or wrong in hindsight.** **Right.** A month later the whole stack moved house — from the machine at home to a rented server — and the lineup survived the move unchanged. Every one of those services came up on the new machine with its data intact, which is precisely what the "can I leave it" test was buying, pointed in a direction I had not anticipated: the freedom to leave *my own hardware*.

**What stuck.** **An accepted recommendation becomes a decision only when you can argue for it without the person who recommended it in the room.** That is the whole division of labour with an AI, compressed: it can know more than me about every option, and the veto still has to live with the person who answers for the result.

---

## Decision 3 — The second copy is not a machine of mine

**Date.** September 2026

**What I was torn between.** One copy of everything is not a backup, so the question was where the second copy lives. I had a capable machine at home, already paid for, sitting idle. Pointing the backup at it costs nothing per month.

**What I chose.** **Object storage I do not own or operate** — [Backblaze B2](https://www.backblaze.com/cloud-storage) — with the arrangement set up so that deletions do not follow the data all the way to the furthest copy.

**What I turned down.** The machine at home. The cheapest option available, turned down for a reason that is not technical.

**Why.** **It assumes I will go on owning a machine, in one place, plugged in and switched on.** I intend to be living somewhere else. A backup design that depends on an address is a design with my address as a component, and components get moved.

**Right or wrong in hindsight.** **Right, and faster than I expected.** Within weeks, that machine at home stopped being a server at all — everything moved to the rented one in late September 2026. **Had the second copy lived on it, the migration would have carried away the backup along with the things being backed up**, and I would have had one copy during the single riskiest week of the year.

**What stuck.** **Check a plan against where you intend to be living, not only against what it costs per month.** Hardware answers are cheap because they move the cost from money into location, and the location term does not appear in any comparison table. And **the second copy should fail for different reasons than the first.**

---

## Decision 4 — I deliberately left one thing unencrypted

**Date.** 28 September 2026

**What I was torn between.** Everything in the backup is encrypted before it leaves my control, so the place storing it holds something it cannot read. The obvious policy is: everything, no exceptions. The password vault's own files were the exception I was considering.

**What I chose.** **Leave the vault's data out of that encryption.**

**What I turned down.** Applying the rule uniformly, which is the version that is easier to describe and easier to feel good about.

**Why.** **The vault is where the encryption key is kept.** Encrypting it closes a loop: to decrypt the backup you need the key, the key is in the vault, and the vault is inside the encrypted backup. On the one day the backup is for, uniformity would be the thing that makes it useless.

The second half of the reason is that the exception costs little: a password vault's contents are already encrypted by the vault itself, with a key the storage provider never sees. The outer layer would have been a second lock on a locked box, bought at the price of making the box impossible to open.

**Right or wrong in hindsight.** **Right, and it exposed a rule I had been missing.** Which is: **a key that can be re-issued does not belong in the vault; only a key that cannot be re-issued does.** Storing a re-issuable credential adds one more copy of a secret and buys nothing, because the recovery move for that credential was never "find it" — it was "issue a new one". I had been collecting things in there out of diligence.

**What stuck.** **"Encrypt everything" is a slogan, not a policy.** Draw the recovery path as a sequence and look for a step that requires the thing you have not recovered yet. **Any rule applied uniformly to a system that contains its own keys will produce a cycle somewhere.** Find it on a quiet afternoon rather than on the bad day.

---

## What generalises

1. **"Free" prices the storage, not the data.** If you cannot say who owns a thing you made, that is the answer.
2. **An AI's recommendation becomes your decision only when you can defend it with the AI out of the room.** The veto lives with whoever answers for the result.
3. **The real switching cost is whatever cannot be exported.** You learn what that is only by leaving — so find out before you need to.
4. **A plan that requires you to stay in one place has your address as a component.** Put that in the comparison, because no vendor will.

## The question I cannot answer

**All four of these look right in hindsight, and two of them are refusals — which is exactly the shape you would expect if I were grading myself generously.** A refusal is easy to call correct, because the alternative never happened and cannot argue back.

What I can say is that two of the four were overtaken by events within weeks — the stack moved to a rented server, which tested both the lineup and the backup design in ways I had not planned for when I decided — and both held, **for reasons I had not thought of at the time.** That is not proof. It is the closest thing to evidence I have.

— Taiki Ito
