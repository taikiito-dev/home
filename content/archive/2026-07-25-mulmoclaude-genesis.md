---
title: "How I Ran Into MulmoClaude, and Got It Actually Usable"
date: 2026-07-25T09:00:00+08:00
description: "A regular office worker who tinkers with computers on the side, building a personal AI assistant setup from scratch. Includes the ERR_MODULE_NOT_FOUND stumble."
lang: "en"
altUrl: "/ja/archive/2026-07-25-mulmoclaude-genesis/"
altLabel: "日本語"
tags: ["MulmoClaude"]
---

I have a regular day job, and tinker with computers on the side. Not an engineer. This blog is a record of what I did, in the order it happened. If it makes you think "I could probably do this too," that's exactly the point.

As a first step, here's how it all started.

## How it started

I came across "MulmoClaude" through Satoshi Nakajima's newsletter - an open-source project that lets you self-host an AI assistant like ChatGPT or Claude on your own machine instead of as a SaaS, with conversation history and memory persisted as local files you control. I decided to set it up on my MacBook. Environment: Node.js v24.18.0, git 2.50.1, Claude Code CLI v2.1.220.

## First stumble: `ERR_MODULE_NOT_FOUND`

There are a few install methods. I first tried the developer route: `git clone`-ing `receptron/mulmoclaude`. Running `yarn install` then `yarn dev` threw `ERR_MODULE_NOT_FOUND` and the server wouldn't start. The cause: I was trying to start `dev` before the package workspace had actually been built. Running `yarn build:packages:dev` first fixed it immediately. If you hit this exact error, check that build step first.

Once it was working, I found out the officially recommended path is `npx mulmoclaude@latest` - no build step, no repo to manage. I switched over the same day. The port also changed, from `5173` (the git-clone/`yarn dev` setup) to `3001` (npx). I still run the npx version today. Had I started there, I'd have skipped the `ERR_MODULE_NOT_FOUND` stumble entirely.

## Getting it into actual daily use

Once it was running, I made a few changes to turn it into something usable day to day. First, I wanted access when I wasn't at my computer, so I created a bot (`taiki_mulmoclaude_bot`) via BotFather and wired it up following the official Telegram Bot API steps. Being able to chat with it on the go turned out to be genuinely useful.

Alongside that, everything I'd built up talking to the official Claude app (my work, where I live, my interests, day-to-day notes) got carried over as "memory" (a system that accumulates as local Markdown files) into this new setup. Picking up from that existing history, instead of starting from zero, made a real difference.

Finally, I didn't want a broken local environment to wipe everything out, so early on I created a private GitHub repository and set up regular automated backups via `git push`. That habit is still going, and it later gave me the confidence to move everything to a server.

By this point, I had MulmoClaude running on my machine, reachable via Telegram, with its data backed up on GitHub. Next: moving it to an always-on cloud server.
