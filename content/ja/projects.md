---
title: "プロジェクト"
standfirst: "作ったものと、使っているプロジェクトに報告したこと。"
description: "予約メールをカレンダーに入れる道具、シングリッシュ採集サイト、使っているツールに出したバグ報告。"
lang: "ja"
altUrl: "/projects/"
altLabel: "English"
---

## booking-to-caldav

予約の確認メールを、自分のカレンダーサーバーの予定に変える道具。定期的に見に行くのではなくIMAPの接続を開いたまま待つので、深夜3時に届いた確認メールが数秒後には予定になっている。飛行機は共有カレンダー、理髪店や歯科は個人のカレンダーへ振り分ける。

見た目より厄介だった点が2つある。航空会社の確認メールは `24 Dec (Wed)` と書いて**年を書かない**ので、曜日から年を復元する必要がある。それに現地の時計の時刻しか書いておらず**時差が無い**ので、空港コードだけが時間帯の手がかりになる。素直に読むとシンガポール発東京行きが1時間長く出る。

2026年10月から自分のサーバーで動かしている。

[github.com/taikiito-dev/booking-to-caldav](https://github.com/taikiito-dev/booking-to-caldav)

## singlish-lah

シンガポールの日常会話で出会ったシングリッシュ・現地スラングを集めたサイト。日本語で、ここで暮らす日本語話者に向けて書いている。

[singlish.taikiito.com](https://singlish.taikiito.com) · [ソース](https://github.com/taikiito-dev/singlish-lah)

## 報告したこと

毎日の作業に使っているツールを、VPSの上・Dockerの中・Macではない環境で、何週間も立ち上げたまま、日本語で動かしている。作られ方も試され方もそういう環境ではないので、6件の報告がそこから出てきた。うち4件が修正につながっている。

- [#3415](https://github.com/receptron/mulmoclaude/issues/3415) — 会話ログへのリンクの経路が違っていて、エディタからは開けなかった
- [#3357](https://github.com/receptron/mulmoclaude/issues/3357) — 1往復ごとにポートを1つ取りこぼし、20往復ほどで連携先が黙って消えた
- [#3018](https://github.com/receptron/mulmoclaude/issues/3018) — 手で登録した連携先が、準備できていても一覧に出てこなかった
- [#2937](https://github.com/receptron/mulmoclaude/issues/2937) — 24時間より長い間隔の指定が、全部「毎日UTC0時」に潰れていた

どれも自分の腕で見つけたものではない。誰も動かしていない機械が1台あった、というだけのこと。

[報告の一覧](https://github.com/receptron/mulmoclaude/issues?q=is%3Aissue+author%3Ataikiito-dev)

## リポジトリ

上記のソースと、このサイトのソース、それに小さなサイドプロジェクト。

[github.com/taikiito-dev](https://github.com/taikiito-dev)
