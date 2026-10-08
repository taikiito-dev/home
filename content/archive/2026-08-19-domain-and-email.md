---
title: "Getting My Own Domain, and Email On It"
date: 2026-08-19T09:00:00+08:00
description: "Got a domain with my own name on it, found a backdoor I'd accidentally left open while reviewing access settings, and hit silent delivery failures even with SPF/DKIM/DMARC all correctly configured."
lang: "en"
altUrl: "/ja/archive/2026-08-19-domain-and-email/"
altLabel: "日本語"
tags: ["self-hosting"]
---

Last time I wrote about moving to an always-on server. Next: getting my own domain, and email on top of it.

## Why bother with a domain

The server itself was running fine, but the address you'd use to reach it wasn't exactly memorable, and I wanted something with my own name in it. I registered `taikiito.com` via Cloudflare Registrar.

I also learned that a brand-new domain tends to get treated with suspicion for a while by various automated network filters, as "uncategorized" and unclassified. There's basically no way around this except time - letting the domain accumulate age and a sending history until it earns a trustworthy classification. I registered it now, well before I'd actually rely on it, and I'm letting that trust build up patiently.

## A backdoor I'd left open myself

While reviewing my access setup, I tried reaching the Lightsail origin's raw IP directly instead of the domain - and it loaded fine.

That meant the authentication gate I'd set up via Cloudflare Access, which protects access through the domain, could be completely bypassed by hitting the origin IP directly. The lock I'd built for the front door meant nothing if you came in through the back.

The same day, I set up `ufw` to only allow inbound traffic on ports 80/443 **from Cloudflare's published IP ranges** (`https://www.cloudflare.com/ips-v4`), denying everything else by default. I made sure to run `ufw allow OpenSSH` explicitly *before* enabling ufw (get that order wrong and you can lock yourself out of SSH the moment the firewall activates). After applying it, domain access kept working fine, and direct origin-IP access was cut off entirely.

## A 522 error when adding a second origin

Under this domain, I added a second entry point for MulmoClaude and a subdomain for a digital business card (neither URL is published here - the MulmoClaude one sits behind Cloudflare Access but I'd still rather not expose the subdomain name itself, and the card page has my personal contact details on it).

Right after setting up the DNS (A record) and the Cloudflare Access policy for the second entry point, hitting it returned Cloudflare's **522 error (connection timed out to origin)**. The cause: SSL/TLS encryption mode is managed per zone (per domain), not globally. The new `taikiito.com` zone had defaulted to **Full** mode, so Cloudflare tried HTTPS to the origin on port 443, but nginx there was only listening on port 80. Switching it to **Flexible** mode, matching the existing domain, fixed it immediately.

## Went ahead and set up SPF/DKIM/DMARC for email too

Since I had the domain, I used iCloud+'s **Custom Email Domain** feature to set up `me@example.com`. No extra subscription - just three DNS records, exactly as instructed:

- **MX**: `mx01.mail.icloud.com` / `mx02.mail.icloud.com`
- **SPF** (TXT): `v=spf1 include:icloud.com ~all`
- **DKIM** (CNAME): `sig1._domainkey` → `sig1.dkim.example.com.at.icloudmailadmin.com`

These prove, through a few different mechanisms, that mail is genuinely coming from my domain and not being spoofed. Simple copy-paste work.

## Still didn't reach one particular inbox

The setup was correct, but a test email to one of my other addresses never arrived. No bounce either - it just silently disappeared.

Just in case, I added **DMARC** too (TXT, `v=DMARC1; p=none; rua=mailto:(report address)`) and confirmed via an external DNS checker that it had propagated correctly. Still nothing. The cause was a sender-reputation problem that SPF/DKIM/DMARC being perfectly correct simply can't fix - the domain has no sending history yet. Mail servers with strict filtering seem especially sensitive to this.

I'd run out of technical levers to pull, so I'm letting time solve this one too. Even with SPF/DKIM/DMARC configured flawlessly, a domain's "trust" has a component that correct technical settings alone can't fix - learned twice now, once for web access and once for email.

To be continued.
