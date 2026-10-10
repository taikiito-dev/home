---
title: "About"
date: 2026-09-12
lastmod: 2026-10-08
standfirst: "What this site is, what it deliberately leaves out, and the one thing worth stating up front: I did not type the commands."
description: "About taikiito.com — why a non-engineer moved his family's photos, files, passwords and mail off large cloud services onto one server, and how the writing here is split between decisions and implementation."
lang: "en"
altUrl: "/ja/about/"
altLabel: "日本語"
---

## Where it started

It started from wanting to explain what I had been doing in words my wife could follow.

For about a month I have been moving the things I had left sitting on Google, Apple and other large services — photos, passwords, files, mail, contacts — onto hardware I pay for. Google Photos to Immich. Google Drive to a Nextcloud of my own. A commercial password manager to Vaultwarden.

Some of it turned out easier than I expected. Some of it cost me a whole day. I wanted to tell her about it, but the [diary](/archive/) I was writing at the time was mostly notes to myself and assumed technical background. It was not something I could hand over.

So I rewrote the same experience in a form that needs **no prior knowledge** — and that someone who wants to do the same thing can use directly. That is why the [writing](/writing/) section exists.

## What this site is, and is not

Not general advice, not a best-practices collection: **only what I actually did**. Including the detours, the mistakes, and the things I gave up on. A flawless set of instructions makes a beginner feel like they are the only one who got stuck. Knowing the author got stuck in the same place is, in practice, the more reassuring document.

## The thing worth stating up front — I did not type the commands

Plainly: **the commands and configuration on this site are not something I worked out and wrote myself.** I am not an engineer. They were typed by Claude, Anthropic's AI assistant. What I did was decide what to do, run the result on my own machines and look at what happened, and doubt the all-clear.

I did not say this at first. The writing read as though I had built it all myself. In October 2026 I changed that.

What changed my mind was realising that **hiding it deletes the most useful part.**

You, reading this, probably have access to Claude or ChatGPT too. So the steps are available to you on request, and the version you get will be newer and fitted to your machine. **What you cannot get on request is where it stalls and what is worth protecting.** Those I decided, so those I can write.

From October 2026 on, each article is built in two halves: **decisions** on top (what I settled on, what I turned down, how it looks in hindsight), and **implementation** below (written by Claude, run on my own machines, confirmed by me). The order matters, because **the decisions are the part you need first.**

The split feels good to work in. Not having to compose the steps means I can spend the attention on what is worth protecting. **Being able to delegate the implementation is what leaves the human side free to concentrate on judgement.** What I was doing over that month was, probably, practice at that. And anyone can start practising.

Host names in the articles are replaced with placeholders like `vault.example.com`. Readers have to substitute their own domain, but writing down which address runs what amounts to publishing a floor plan of my own setup, so I stopped. I used to leave them in, thinking a concrete example would be more useful. I changed my mind.

## How the site is laid out

- **[Writing](/writing/)** — the main thing here. One article per job: moving some specific thing off a large service and onto something I run. What I decided and why, then the steps. Not a diary — kept up to date as a reference to the current correct state. Most of it is in Japanese; two of the records are in English.
- **[Projects](/projects/)** — what I have built, and where the source lives.
- **[Archive](/archive/)** — a dated dev diary I kept until the summer of 2026. I folded it because a dated post goes stale and never gets corrected. It is left here for the record; anything still current is in Writing.

Updated at whatever pace is sustainable, when there is something to say.

## About me

Based in Singapore. Petroleum trading is my job. I am not an engineer and not planning to become one — I decide what gets built and why, and I build it with Claude Code.

My photos, files, passwords, mail and calendars run on a server of mine, and two people use it every day. I did not type the commands. **I only decided.**

I would be glad if this site read as a worked example of how far you can get without specialist knowledge — though not in the sense I first meant it. **What stood in for expertise was not effort or self-study, but the habit of checking whether something is really finished when you are told it is.** That one is available to anybody.

More small projects on GitHub: [taikiito-dev](https://github.com/taikiito-dev).
