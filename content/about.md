---
title: "About"
date: 2026-09-12
lastmod: 2026-10-11
standfirst: "What this site is, what it deliberately leaves out, and how the work is split: I decide what gets built, Claude writes the commands."
description: "About taikiito.com — why a non-engineer moved his family's photos, files, passwords and mail off large cloud services onto one server, and why what gets published here is the decisions, not the steps."
lang: "en"
---

## Where it started

It started from wanting to explain what I had been doing in words my wife could follow.

Since September 2026 I have been moving the things I had left sitting on Google, Apple and other large services — photos, passwords, files, mail, contacts — onto hardware I pay for. Google Photos to Immich. Google Drive to a Nextcloud of my own. A commercial password manager to Vaultwarden.

Some of it turned out easier than I expected. Some of it cost me a whole day. I wanted to tell her about it, but the dated dev diary I was keeping at the time was mostly notes to myself and assumed technical background. It was not something I could hand over.

So I rewrote the same experience in a form that needs **no prior knowledge** — and that someone who wants to do the same thing can use directly. That is what the decision records under [Writing](/writing/) are for.

## What this site is, and is not

Not general advice, not a best-practices collection: **only what I actually did**. Including the detours, the mistakes, and the things I gave up on. A flawless set of instructions makes a beginner feel like they are the only one who got stuck. Knowing the author got stuck in the same place is, in practice, the more reassuring document.

## The thing worth stating up front — I did not type the commands

Plainly: **the commands and configuration on this site are not something I worked out and wrote myself.** I am not an engineer. They were typed by Claude, Anthropic's AI assistant. What I did was decide what to do, run the result on my own machines and look at what happened, and doubt the all-clear.

I did not say this at first. The writing read as though I had built it all myself. In October 2026 I changed that.

What changed my mind was realising that **hiding it deletes the most useful part.**

You, reading this, probably have access to Claude or ChatGPT too. So the steps are available to you on request, and the version you get will be newer and fitted to your machine. **What you cannot get on request is where it stalls and what is worth protecting.** Those I decided, so those I can write.

From October 2026 on, what I publish is the decisions — what I settled on, what I turned down, how it looks in hindsight. The steps are left out. A page of commands I did not work out myself is a page I cannot defend when asked about it, and the version your own assistant writes for you will be newer and fitted to your machine anyway.

One page breaks that rule: the deployment guide, which the maintainers of the software asked me to write because nobody else was running it that way. The commands in it are not mine either, but every failure it describes is — I hit all of them. That is the standard it is published to.

The split feels good to work in. Not having to compose the steps means I can spend the attention on what is worth protecting. **Being able to delegate the implementation is what leaves the human side free to concentrate on judgement.** What I was doing over that month was, probably, practice at that. And anyone can start practising.

Host names in the articles are replaced with placeholders like `vault.example.com`. Readers have to substitute their own domain, but writing down which address runs what amounts to publishing a floor plan of my own setup, so I stopped. I used to leave them in, thinking a concrete example would be more useful. I changed my mind.

## How the site is laid out

- **[Writing](/writing/)** — finished pieces, written on the assumption that they will not be reworked after publication: dated decision records, and one operations guide the MulmoClaude maintainers asked for. Only a few live here.
- **[Projects](/projects/)** — what I have built, and where the source lives.

There used to be a dated dev diary here as well. It came down in October 2026, for the same reason the steps did: most of it was not something I could stand behind in my own words.

Updated at whatever pace is sustainable, when there is something to say.

## About me

Based in Singapore.

More small projects on GitHub: [taikiito-dev](https://github.com/taikiito-dev).
