---
title: "Before Writing a Single Post, I Renamed My GitHub Account"
date: 2026-08-22T08:00:00+08:00
description: "The decision to start publishing this blog: Hugo + PaperMod, GitHub Actions deploying to GitHub Pages under a custom domain, a private source repo force-pushing built output to a separate public repo, and a GitHub username rename along the way."
lang: "en"
altUrl: "/ja/archive/2026-08-22-building-this-blog/"
altLabel: "日本語"
tags: ["side projects", "self-hosting"]
---

Last post was about building an RSS reader and tearing it down the same day. Around the same time, I made a bigger call: to start writing down what I'd been doing, in public. This blog is the result, and I started it that same day.

## Why

The same newsletter that had introduced me to MulmoClaude in the first place also carried some advice from its author: if you want to move toward being an engineer, publish real work on GitHub. The domain setup, self-hosting, and email troubleshooting I'd been doing seemed like the kind of thing that could be genuinely useful to someone hitting the same problem via search, so I decided to write it up.

## Choosing a diary format

I first considered topic-organized how-to posts, then switched partway through to a chronological diary - writing things in the order they actually happened, mistakes and detours included. It's closer to how it actually went.

## Picking the stack

I went with Hugo as the static site generator, mainly because multi-language support (i18n) is built in. Theme: PaperMod. Deploy is GitHub Actions building the site and pushing it to GitHub Pages, with a custom domain (`blog.example.com`) pointed at it via a Cloudflare CNAME.

I split it into two repos: the actual Hugo source I edit (`blog-source`) stays private, and a single Actions job builds it and force-pushes only the built static output to a separate public repo (`blog`). Editing history and drafts never leave the private repo - only the finished output is public, which I like.

## Renamed my username while I was at it

I also renamed my GitHub username at this point. The old one had a string based on my birthdate in it, added without much thought when I first signed up, and I'd wanted to change it for a while. My first choice was already taken, so I landed on a `-dev` suffix instead. With zero public repos at the time, the switching cost was basically nothing.

I also set up a GitHub profile README - creating a repo with the exact same name as your username makes it auto-display on your profile page. Kept it to two lines:

> Tinkering with computers on the side. Hoping it helps someone.

## Where things stand

The blog itself and a public GitHub account are both in place now. The actual posts are what comes next, written up after the fact as things happen.

To be continued.
