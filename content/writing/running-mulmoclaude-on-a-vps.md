---
title: "Running MulmoClaude on a VPS — an unofficial companion to the README"
date: 2026-10-10
lastmod: 2026-10-13
weight: 18
description: "An unofficial companion to the MulmoClaude README, for running it on a rented server and reaching it over a public hostname: which routes are deliberately left unauthenticated, why something must authenticate the request before the server sees it, and the operational traps that cost the most time."
lang: "en"
langLabel: "English"
altUrl: "/writing/running-mulmoclaude-on-a-vps/ja/"
altLang: "ja"
altLabel: "日本語"
defaultUrl: "/writing/running-mulmoclaude-on-a-vps/"
tags: ["MulmoClaude", "self-hosting", "VPS", "Cloudflare", "operations"]
---

> **Read this before you serve MulmoClaude on a public hostname.**
>
> **Put an authenticating proxy in front of it** — Cloudflare Access, an authenticating reverse proxy, a VPN, Tailscale; anything that stops the request before the server sees it. Two routes are token-free by design: `/api/files/*`, so that `<img>` tags can load, and the `/ws/pubsub` websocket handshake. On loopback that is a sound design. On a public hostname with nothing in front, **anyone who knows the URL can read files out of your workspace and follow your conversations as they stream**, without ever needing the token.
>
> **Check your own install before relying on anything here.** The handshake half is closed upstream: [#3435](https://github.com/receptron/mulmoclaude/pull/3435) requires the bearer token on the `/ws/pubsub` handshake and was merged on 10 October 2026, closing [#3433](https://github.com/receptron/mulmoclaude/issues/3433). Any release cut before that merge does not have it. Check your own version against the merge rather than against a number written on this page, which will age. `/api/files/*` stays token-free either way, so the proxy is required regardless of which version you run.
>
> The bearer token does not cover this. Everything below assumes the proxy is there.

**This page is a companion to the official [README](https://github.com/receptron/mulmoclaude#readme) and [user guide](https://receptron.github.io/mulmoclaude/) — not a replacement for them.** Install, prerequisites and first run belong to the README and are not repeated here; everything in its [Prerequisites](https://github.com/receptron/mulmoclaude#prerequisites) applies, on the server rather than on your laptop. This page picks up where the README's **Quick Start** ends, and covers the one configuration the project does not ship.

**If you are asking an assistant to do this for you, give it this page.** Most people who put MulmoClaude on a server will not type these commands themselves. Every constraint below is stated as a rule, with the command that proves it and the point at which it should stop and ask you.

**What MulmoClaude is.** [MulmoClaude](https://github.com/receptron/mulmoclaude) is an open-source, MIT-licensed personal AI assistant: Claude with a workspace of plain files, where chat opens the right tool — a wiki, a spreadsheet, a chart — and small apps get built for an audience of one. It is designed local-first, for the machine in front of you, bound to `127.0.0.1`. Mine has run on a rented server since September 2026 — which is exactly the setup this page is about.

**Who this is for.** You already have a server and a domain, and you want MulmoClaude running on the server rather than on the machine in front of you — so that it stays awake, keeps working while you are away, and the full browser UI is reachable from anywhere.

**If you only want your phone, you probably don't need this page.** The README's [Remote Access](https://github.com/receptron/mulmoclaude#remote-access) does that already: sign in at both ends with the same Google account and the phone finds your host through the project's relay. No hostname, no proxy, nothing to operate — and none of the risk at the top of this page. The trade is that it depends on a Google account and a shared relay, and gives the phone a purpose-built view rather than the whole app. If that trade suits you, use it and stop reading.

**Two other cases where none of this is needed.** If the service stays bound to `127.0.0.1` and is used only from that machine, there is nothing here you have to do. And if access is only ever over a VPN or Tailscale, with nothing listening on a public interface, the VPN already satisfies the requirement in section 1 — the rest of the page still applies.

**What this is not.** I run this setup. The project does not. When I raised the token-free paths with the maintainers ([#3425](https://github.com/receptron/mulmoclaude/issues/3425)), they confirmed the behaviour, shipped the fix for one of them, and were clear that a public-hostname deployment sits outside what they test. Their suggestion was that this guidance be published by a user, with the warning at the top — which is this page. So this guide is mine, and so is the responsibility for it. Nothing here carries the project's endorsement.

**The shape, not the products.** What matters below is the shape: nothing listening on the public interface, something that authenticates the request *before* the server receives it, a pinned version, and a monitor that watches the server rather than the front door. Cloudflare, Authentik and systemd are what I happen to run, and I name them because a guide with the names taken out cannot be followed. They are not the requirement. Substitute a VPN, Tailscale, an authenticating reverse proxy, a different supervisor, and the shape holds.

## Four decisions, not steps

Doing this involves four choices that are yours. If you have delegated the work, these are the points where whoever is doing it should stop and ask you.

1. **Which authenticating layer to use.** It has to be something you will maintain; an unmaintained door is the failure mode here.
2. **Any DNS change, certificate issuance, or tunnel creation on an account that is not solely yours.**
3. **Any change to the bind address.** There is no case where widening it is correct. If someone tells you there is, make them say why, and stop.
4. **Which version to pin to.**

## The whole thing, in order

1. Rent a small Linux server. Install MulmoClaude on it as the README describes; leave it bound to `127.0.0.1`.
2. Run it under systemd with the **version pinned**.
3. Create a Cloudflare Tunnel so the hostname reaches `localhost` **without opening any inbound port**.
4. Put an **authenticating proxy** in front of the hostname. Do not skip this; see the next section for what is at stake.
5. Add the public origin to `MULMOCLAUDE_TRUSTED_ORIGINS` and **restart**.
6. Point your monitoring at the server's own port, not at the public URL.

The rest of this page is those six steps with the failures I hit in each.

## 1. What is exposed, and what to put in front of it

MulmoClaude authenticates `/api/*` with a bearer token. Two paths are exempt, both deliberately:

- **`/api/files/*`** — necessarily exempt. An `<img>` tag cannot carry an `Authorization` header, so images in chat would not load if it were not.
- **`/ws/pubsub`** — the Socket.IO endpoint. The handshake took no authentication at all until [#3435](https://github.com/receptron/mulmoclaude/pull/3435) landed; see the note at the top about checking your own install.

The important part is *why this has been fine*. The server binds to `127.0.0.1`. The exempt paths are open, but the only person who can reach them is the person sitting at that machine. **Serving over a public hostname does not add or remove a lock. It changes who can stand in front of the door.** After that, knowing the hostname is enough to read workspace files and to subscribe to conversations as they stream — no token required.

So the requirement is specific: something must **authenticate the request before the server receives it**. Not beside it — in front of it.

**Do not try to settle this by checking a version number.** Because `/api/files/*` stays exempt either way, the front layer is required on every version. #3435 reduced the blast radius; it did not remove the requirement.

What does not count as a front layer: the bearer token on its own; a hostname nobody has guessed yet; a firewall rule that still admits the public internet; authentication configured inside MulmoClaude.

Prove it from a machine that is **not** the server, in a session with no cookies:

```sh
curl -sS -o /dev/null -w '%{http_code}\n' https://HOST/api/files/raw
curl -sS -i -N https://HOST/ws/pubsub 2>&1 | head -5
```

Expect a redirect to, or a challenge from, the front layer in both cases — not a 200, and not anything MulmoClaude itself produced. For the websocket, the challenge must come before any Socket.IO payload appears.

Mine is Cloudflare Access with [Authentik](https://goauthentik.io/) as the identity provider, self-hosted, so the account and its passkey belong to me rather than to a vendor. A request arrives at Cloudflare, is bounced to Authentik, and only continues once a passkey has been presented. MulmoClaude sees nothing until then. An authenticating reverse proxy, a VPN or Tailscale all satisfy the same requirement; pick whichever you will actually maintain.

If you do wire Authentik to Cloudflare Access, three things are not obvious:

- The redirect URI is `https://<your-team>.cloudflareaccess.com/cdn-cgi/access/callback`, matched strictly.
- The page you need in Zero Trust is **Identity provider integrations**, which is hard to find by browsing. Press ⌘+K and type "identity".
- On the Access application, turn **"Accept all available identity providers" off** and select only your own. Otherwise you have built a door with a second, unlocked door beside it.

One failure whose symptom lies: if you create the Authentik OAuth2 provider **through the API**, `grant_types` comes back empty while the admin UI looks entirely normal. Login fails with `error=invalid_request / The request is otherwise malformed`, and nothing appears in Authentik's event feed. The real message is in the container log:

```sh
docker logs authentik-server-1   # "Invalid grant_type for provider"
```

Fix with `PATCH /api/v3/providers/oauth2/<pk>/` and `{"grant_types":["authorization_code","refresh_token"]}`.

## 2. Reaching the server without opening a port

I use a Cloudflare Tunnel. `cloudflared` runs on the server, dials out to Cloudflare, and traffic for `mulmoclaude.example.com` comes back down that connection to `localhost:3001`. Nothing listens on the public interface and the firewall stays shut. The server keeps its `127.0.0.1` bind — **never change it to `0.0.0.0`**, not even to test whether the tunnel works. The whole safety of the default configuration rests on that bind.

Prove it on the server:

```sh
ss -tlnp | grep -vE '127\.0\.0\.|\[::1\]'
```

Expect MulmoClaude's port to be absent from the output. Check IPv6 too — a `*:PORT` entry means both families, and grepping for `0.0.0.0` will not match it.

Three things that cost time:

**A tunnel created in the Cloudflare dashboard is remotely managed, and the `ingress:` section of your local `/etc/cloudflared/config.yml` is ignored.** Only `tunnel:` and `credentials-file:` do anything locally. You can edit that file all afternoon and change nothing. The tell is in the journal at startup:

```
INF Updated to new configuration config="{...}" version=4
```

Routes for a remotely-managed tunnel are changed in the dashboard, or through the API at `/accounts/<id>/cfd_tunnel/<id>/configurations`. If you use the API, note that `PUT` replaces the entire ingress array — `GET` and keep a copy first, and leave the catch-all 404 rule last.

**Keep the hostname to one label.** Cloudflare's free universal certificate covers `example.com` and `*.example.com`, but not `m.mulmoclaude.example.com`. A two-label name fails at the TLS handshake, which looks nothing like a certificate problem while you are debugging it. Join the words with a hyphen instead.

**If a new route answers "Unable to connect to origin", the daemon did not reload — restart it.** And restart it properly: **do not send it `SIGHUP`.** It exits on `SIGHUP` rather than reloading, which takes every route down with it, not just the one you were working on.

## 3. `MULMOCLAUDE_TRUSTED_ORIGINS`

Once you are on a public hostname, the CSRF guard needs to know about it:

```sh
MULMOCLAUDE_AUTH_TOKEN=...
MULMOCLAUDE_TRUSTED_ORIGINS=https://mulmoclaude.example.com
```

The behaviour worth knowing is the failure. **Add the origin, skip the restart, and you land in a state that reads perfectly and refuses to write** — sending, attaching, deleting, bookmarking and changing model all return 403 while the page itself looks healthy. Reading being unaffected is what makes it hard to recognise. I hit this rather than read the source for it; what I can tell you is that restarting the service after editing the variable clears it.

## 4. Keeping it running

```ini
[Unit]
StartLimitIntervalSec=300
StartLimitBurst=5

[Service]
User=you
WorkingDirectory=/home/you/mulmoclaude
ExecStart=/usr/bin/npx mulmoclaude@VERSION
Restart=always
RestartSec=5
```

**Pin the exact version. Do not write `@latest`.** `VERSION` above is a placeholder on purpose — put in the version you have actually checked yourself, against the merge noted at the top of this page rather than against any number written here.

With `@latest`, every restart after a new release quietly becomes an in-place upgrade of the running tree. On 6 October 2026 a restart of mine landed minutes after a release, the install was interrupted, and npm left a staging directory behind:

```
npm error ENOTEMPTY: rename '.../node_modules/mulmoclaude' -> '.../node_modules/.mulmoclaude-FQR3GhWi'
```

The leftover is the part that matters: once it was there, the same rename failed the same way on every attempt that followed — and `Restart=always` turns a one-off into a loop. Mine restarted **75 times across about 12 minutes** before I stopped it. Recovery was `systemctl stop`, `rm -rf ~/.npm/_npx/<hash>`, `systemctl start`.

**`RestartSec` is not what stops that loop.** Mine had it; five seconds between attempts is what produced one restart every ten seconds for twelve minutes rather than a tighter spin. What stops it is a limit on how many attempts are allowed: `StartLimitBurst` with `StartLimitIntervalSec`, which puts the unit in a failed state instead of retrying forever. Those two go in `[Unit]`, not `[Service]`.

There is a deeper point here that I have not acted on. **`npx` in `ExecStart` means the service reaches the network in order to start** — which is the only reason an interrupted install could break startup at all. Installing the package and pointing `ExecStart` at the binary removes that whole class of failure. I run the `npx` form, so the pre-warm below is a workaround for a shape I chose, not the better shape.

Pinning has one consequence: changing the version number in the unit means the next restart installs a fresh tree instead of reusing the one already on disk, and the restart sits there waiting for it. Warm it first, from the workspace directory:

```sh
cd /home/you/mulmoclaude && npx --yes mulmoclaude@VERSION --version
```

Then edit the unit, `systemctl daemon-reload`, restart. Keep the previous cache directory; it is your rollback. And **never patch files inside the installed tree** — start hooks run before npx installs, so at the moment a patch matters you are patching the version you are about to replace.

As for the server itself: mine is a Contabo Cloud VPS, 6 vCPU and 12 GB of RAM. MulmoClaude is not the demanding part; everything else I run on the box is. Disk and price are left out here on purpose — mine have both changed since I started, and neither is something you need from me in order to follow this page.

## 5. Monitoring, and one way to get it wrong

**Do not monitor the public URL to check the server is alive.** Mine sat behind Cloudflare Access, so the monitor followed the redirect, found a perfectly healthy login page, and reported OK every single minute of the twelve-minute outage described above. Not one alert fired.

Monitor the server's own port from inside the machine instead.

**That check has its own blind spot, and mine still has it.** A monitor running on the same machine cannot tell you the machine is gone; it dies with it. What closes that is a probe from somewhere else — an external uptime service hitting an endpoint that answers without authentication, or a dead-man's switch that the on-box check has to keep feeding. Mine runs on the same box as the server, so what I have catches the server dying and would not catch the machine dying.

And a monitor is not a monitor until you have made it go red on purpose — point it at a closed port once and confirm the failure is actually recorded.

## What not to do

- Don't bind to `0.0.0.0`, even temporarily.
- Don't serve a public hostname with only the bearer token in front, for the reasons in section 1.
- Don't write `@latest` in a systemd unit, for any package.
- Don't let a restart policy retry without a limit.
- Don't patch files inside an npx-installed tree.
- Don't send `SIGHUP` to `cloudflared` expecting a reload.
- Don't treat a 200 from the public URL as proof the server is up.

## What on this page expires

Re-check these upstream rather than trusting this page. **This page is maintained against upstream**: when something listed here changes, the page gets corrected, and the dates at the top record when it last was.

- **2026-10-10 — [#3435](https://github.com/receptron/mulmoclaude/pull/3435) merged**, requiring the bearer token on the `/ws/pubsub` handshake, closing [#3433](https://github.com/receptron/mulmoclaude/issues/3433). Any release cut before that merge lacks it.
- **`/api/files/*` is token-free.** True as of the date at the top of this page. It is a design consequence of `<img>` tags, so it is unlikely to change — but verify rather than assume.
- **Version numbers are deliberately absent from the constraints above.** Check your installed version against the merge, not against a number written on a page.
- The Cloudflare specifics will drift fastest of anything here.

---

I have run this setup daily since September 2026, and reach it mostly from a phone. I don't write code — I decide what gets built and why, and Claude Code writes it.

I raised this upstream expecting a one-line answer. What came back was a careful one, and a clear line: the project does not run this configuration, so the project will not document it — but it will point at someone who does. My thanks to [isamu arimoto](https://github.com/isamu) for drawing that line so plainly.

— Taiki Ito
