---
title: "Moving to a Server That Never Turns Off"
date: 2026-08-16T09:00:00+08:00
description: "Migrating MulmoClaude to AWS Lightsail. A silent CSRF trusted-origin failure, a mystery 'Network error calling ...' traced to a Docker Desktop vs Docker Engine networking difference, and a memory-plan saga."
lang: "en"
altUrl: "/ja/archive/2026-08-16-moving-to-a-server/"
altLabel: "日本語"
tags: ["MulmoClaude", "debugging"]
---

Continuing from before. I'd been running MulmoClaude on my local MacBook, which meant it stopped working whenever I closed the lid or took it with me. I increasingly wanted proper web UI access while out and about, away from home. The Telegram bot couldn't handle multiple threads well and its Markdown rendering was weak, so I was starting to feel its limits.

## Weighing the options

Leaving my laptop on 24/7 was ruled out on electricity and portability grounds. Connecting directly via SSH from my own machine was ruled out early too - corporate networks commonly block outbound port 22 (SSH). Instead I went with HTTPS over a domain, fronted by an authentication gate (Cloudflare Access). Login is via Google account, plus the app's own shared secret (`MULMOCLAUDE_AUTH_TOKEN`) as a second layer.

I went back and forth with Sakura Cloud, but chose AWS Lightsail for the lower latency from its Singapore region. Started on the $7/mo bundle (1GB RAM, 2 vCPUs, 40GB SSD), planning to upgrade later if it wasn't enough.

## A silent failure: the CSRF trusted-origin gap

The migration itself went through, but sending a message from the browser just silently failed - no error, no response.

The cause: the app's built-in CSRF guard checks the `Origin` header, and the new domain hadn't been added to `MULMOCLAUDE_TRUSTED_ORIGINS` in `.env`. Adding my public domain there and running `systemctl restart mulmoclaude.service` fixed it. If you're self-hosting MulmoClaude and sends silently fail only from your public domain, check this first.

## Chasing down "Network error calling ..."

A few days later, internal MCP-bridge calls like `presentForm` and `manageCollection` started intermittently failing with "Network error calling ...: fetch failed."

My first suspicion was memory pressure. `/proc/meminfo` did show low `MemAvailable`, with swap mostly used. I installed `zram-tools` for compressed swap (`/dev/zram0`) and dropped `vm.swappiness` to 10 - no change. I even bumped the Lightsail plan from $7/mo (1GB) to $12/mo (2GB) just in case, and the error still reproduced 100% of the time.

The real cause turned up when I read the app's source (`server/index.ts`): it's designed to **bind only to loopback** - `app.listen(port, "127.0.0.1", ...)`. The sandboxed agent reaches the host via `host.docker.internal`. On **Docker Desktop (Mac)**, that resolves through a hypervisor proxy that does reach loopback. On **Docker Engine (Linux)**, it just resolves to the real IP of the `docker0` bridge (`172.17.0.1` in this case) - a genuinely different interface, which a loopback-only bind will never accept a connection from. A latent bug that never surfaced on the Mac, exposed for the first time on Linux.

The fix was a single `socat` relay bridging the docker-bridge address to loopback:

```
ExecStart=/usr/bin/socat TCP-LISTEN:3001,bind=172.17.0.1,fork,reuseaddr TCP:127.0.0.1:3001
```

Registered as a systemd unit, and `curl http://host.docker.internal:3001/` immediately started returning 200, with `presentForm`/`manageCollection` working right away. The memory/zram work wasn't entirely wasted (headroom genuinely improved), but it was never the actual cause of this error.

## Why I ended back on $12/mo (2GB)

Once the real cause was fixed, I tried downgrading back to $7/mo (1GB) to save money. Lightsail, though, **doesn't support resizing an instance down via snapshot** - it meant rebuilding a 1GB instance from scratch. That rebuilt instance repeatedly hung under load (like building the Docker sandbox image), with SSH and even Lightsail's own browser console becoming unresponsive, more than once.

I concluded 1GB can't reliably sustain this workload (MulmoClaude itself, the Docker sandbox, and the Telegram bridge together) and settled on $12/mo (2GB) as the final plan. Stability won over saving a few dollars.

## Running 24/7

A few stumbles along the way, but this server has been running around the clock ever since. I can use it anytime, from anywhere, regardless of what state my own laptop is in.

To be continued.
