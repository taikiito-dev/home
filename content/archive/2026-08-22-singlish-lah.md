---
title: "Riding the Momentum of Starting the Blog, I Also Shipped a Singlish Glossary Site"
date: 2026-08-22T08:30:00+08:00
description: "A small side project shipped the same day as this blog: a plain HTML/CSS/JS Singlish-term glossary for Japanese speakers, plus the subdomain + repo pattern that later projects would reuse."
lang: "en"
altUrl: "/ja/archive/2026-08-22-singlish-lah/"
altLabel: "日本語"
tags: ["side projects"]
---

Last post was about building the shell of this blog. Same day, riding the momentum, I shipped one more small site: a glossary of Singlish expressions you actually hear in daily conversation in Singapore, aimed at Japanese speakers.

## Deliberately a different stack

The blog runs on Hugo, but this one is plain HTML/CSS/JS with no build step at all. If I'm going to put projects out as a portfolio, showing range in approach felt better than reaching for the same stack every time. Data lives in a `terms.json` file, with search and category filtering built on top of it. At launch: 33 terms across 5 categories (stock phrases, reactions/emotions, food & daily life, relationships/how people address each other, and things picked up at work).

Content is a mix of generally well-known Singlish terms plus a few I've actually heard myself. The plan going forward is to keep appending to `terms.json` as new ones come up.

## The subdomain pattern became a real pattern

The domain-and-repo shape settled into an actual template at this point: one dedicated GitHub repo per project, one `<project>.example.com` subdomain via a Cloudflare CNAME. One thing I learned here: the CNAME has to stay DNS-only (not proxied), or GitHub Pages' automatic HTTPS certificate issuance gets delayed or fails outright.

## Back and forth on the footer line

I rewrote the footer copy twice. The first version said something like "hope this is useful to someone" - writing it out, it felt a bit presumptuous, so I changed it to a more self-aware "way too niche for anyone, but I made it for myself so here it is." Looking at that again, I decided neither was actually necessary and removed the line entirely. Stating what the thing is felt like enough; why it exists is something a reader can decide for themselves.

## Two more things shipped, same day

The blog and this glossary, both shipped the same day, both riding the same subdomain pattern. Whatever comes next, that pattern makes it fast to stand up.

To be continued.
