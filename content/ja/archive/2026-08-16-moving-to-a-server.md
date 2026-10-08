---
title: "MacBookからAWS Lightsailへ移行して、ハマった3つの問題と直し方"
date: 2026-08-16T09:00:00+08:00
description: "MulmoClaudeをAWS Lightsailに移行した記録。CSRFのtrusted originエラー、Docker Desktop/Docker Engineのネットワークの違いによる原因不明のエラー、メモリ増設と縮小の顛末まで。"
lang: "ja"
altUrl: "/archive/2026-08-16-moving-to-a-server/"
altLabel: "English"
tags: ["MulmoClaude", "デバッグ記録"]
---

MulmoClaudeはそれまでローカルのMacBookで動かしていた。ノートを閉じたら止まる、持ち歩いたら止まる。外出先からもちゃんとしたWeb UIで使いたかったのと、Telegram bot運用は複数スレッドの並行やMarkdown表示のあたりで限界を感じていたので、常時稼働のサーバーに移すことにした。

## 構成を決めるまで

自分のマシンから直接SSHで繋ぐ案は、企業のネットワークが外向きのポート22(SSH)を塞いでいることが多いので早々に除外した。代わりに、ドメイン経由でHTTPSアクセスし、手前にCloudflare Accessで認証ゲートを置く構成にした。ログインはGoogleアカウント、加えてアプリ側の共有シークレットでも二重にロックしている。

クラウドはさくらのクラウドとAWS Lightsailで迷ったが、Singaporeリージョンのレイテンシを優先してLightsailにした。最初は$7/月(1GB RAM、2 vCPU)の一番小さいバンドルから始め、足りなければ後で上げる方針にした。

## 詰まったところ

**1. 送信しても無反応になる(CSRF)**

移行作業自体は終わったのに、ブラウザからメッセージを送っても何も起きない。エラーも出ない。原因は、アプリ内蔵のCSRFガードが`Origin`ヘッダーをチェックしていて、新しいドメインを`.env`の`MULMOCLAUDE_TRUSTED_ORIGINS`に追加し忘れていたことだった。自分の公開ドメインをここに足して`systemctl restart`したら直った。同じようにセルフホストしていて、公開ドメインからの送信だけ無言で失敗する場合は、まずここを疑うといい。

**2. 内部API呼び出しが断続的に失敗する**

数日後、`presentForm`や`manageCollection`など内部のMCPブリッジ呼び出しが「Network error calling ...: fetch failed」で落ちるようになった。最初はメモリ不足を疑い、zram-toolsで圧縮swapを作ったり、Lightsailのプランを$7/月(1GB)から$12/月(2GB)に上げたりしたが、症状は変わらなかった。

結局、アプリのソース(`server/index.ts`)を読んで根本原因が分かった。アプリは`127.0.0.1`にしかbindしない設計になっており、Mac(Docker Desktop)ではこれがhypervisor越しにloopbackへ届くのに対し、Linux(Docker Engine)では単に`docker0`ブリッジの実IP(このケースでは`172.17.0.1`)に解決されるため、接続を受け付けていなかった。Macでは表面化しなかった設計上の穴が、Linux移行で初めて出てきた形だ。修正は、`socat`でブリッジ側からloopbackへTCPを1本中継するだけで済んだ。

```
ExecStart=/usr/bin/socat TCP-LISTEN:3001,bind=172.17.0.1,fork,reuseaddr TCP:127.0.0.1:3001
```

これをsystemdサービスとして登録したら、`curl http://host.docker.internal:3001/`が200を返すようになり、機能もすぐに正常化した。メモリ・zramの対応が無駄だったわけではないが(実際に空きは増えた)、このエラーの直接原因ではなかった。

**3. プランを下げようとしたら作り直しになった**

原因判明後、節約のため$7/月(1GB)に戻そうとしたが、Lightsailはスナップショット経由でのプラン縮小に対応しておらず、1GBインスタンスを作り直す必要があった。作り直したインスタンスは、Dockerのサンドボックスイメージビルドのような負荷時にたびたびハングし、SSHもブラウザコンソールも反応しなくなることが複数回あった。このワークロード(本体+Dockerサンドボックス+Telegram bridge)は1GBでは支えきれないと判断し、$12/月(2GB)を最終プランとして確定した。

いくつかのつまずきを経て、今はこのサーバーが24時間動き続けている。
