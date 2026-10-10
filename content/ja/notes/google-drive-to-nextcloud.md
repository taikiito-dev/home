---
title: "ファイルをGoogle DriveからNextcloudに移す"
date: 2026-09-12
lastmod: 2026-10-08
weight: 3
description: "Google Driveの`archive`フォルダ(実質100〜150MB)を自前サーバーのNextcloudへ移した記録。容量にも料金にも困っておらず、引き金になった事件がない移行で、Googleの容量表示が実データの90倍を指す矛盾も未解決のまま残した。docker-compose・Cloudflare Tunnel・rcloneの手順と製品比較は後半。コマンドはClaude(AnthropicのAIアシスタント)が書いたもの。"
lang: "ja"
tags: ["ファイル", "Nextcloud", "Google Drive"]
---

この移行には、引き金になった事件がない。写真を移し終えた次の順番がファイルだった、というだけだ。Google Driveの中身は実質100〜150MB程度しかなく、容量にも料金にも困っていなかった。

**この記事でやること** — Google Driveに置きっぱなしだった`archive`フォルダ(契約書や身分証のコピーなど、実質100〜150MB)を、自前サーバーのNextcloudへ移す。共有フォルダ2つは移さずGoogleに残した。手順は[ページ後半](#手順)にまとめた。

このサイトの他の記事は、たいてい何か困ったことが起きてから動いている。[Googleとの紐付けを外した話](/ja/notes/google-account-unlinking/)はクラウドの請求額から始まっているし、[写真サーバーの容量の話](/ja/notes/photo-storage-capacity/)は空き容量が3年もたないと測れたから始まった。この記事だけは違う。**困っていないのに手を動かした記録**だ。

だから読みどころもそこになる。困っていない移行は、途中で変なものを見つけても、きれいに終わらせる動機がない。実際この作業では**Googleのストレージ表示が実データの90倍を指しているという矛盾**を見つけたが、それは今も未解決のまま放置してある。困っていないから、放置できてしまう。

先に役割を書いておく。**docker-composeの設定やコマンドを書いたのはClaude（AnthropicのAIアシスタント）で、私は決める側をやった。** 私はエンジニアではない。手順を考えなくていいぶん、「何を移し、何を移さないか」だけをじっくり考えられた。だからこのページも、前半に判断、後半に手順（Claudeが書き、自分の環境で実行して結果を確かめたもの）という順で置いてある。

## 何を移したか

対象はGoogle Driveに置きっぱなしになっていた`archive`フォルダで、契約書や身分証のコピーなどが入っている。量は実質100〜150MB程度。写真の移行([前の記事](/ja/notes/google-photos-to-immich/))が59,000枚・100GB超だったのに対して、桁が3つ違う。

---

## 決定 — 全部は移さないと決めた

この移行で本当に決めたことは、これ1件だけだった。製品の選定（Nextcloudを選んだこと）は後半の手順側に回してある。候補を調べて比較したのはClaudeで、私はその比較を読んで決めただけなので、決定として立てるには弱い。

**日付** 2026年9月12日（初版公開の時点）

**迷ったこと** 写真の時は「全部Immichに取り込む」という単純な方針にしたが、Google Driveは事情が違った。中身を確認すると、自分だけのファイルの他に、もう1人の利用者と共有しているフォルダが2つ混ざっていた。1つはiPhoneの体組成計・血圧データを自動書き出しする仕組みの出力先、もう1つはビザ手続き関連の共有フォルダだ。

**採った案** **自分専用の`archive`フォルダだけをNextcloudに移し、共有フォルダ2つはGoogle側に残す。**

**却下した案** 全部まとめてNextcloudへ移す。

**なぜ却下したか** この2つは**相手（連携先アプリと、もう1人の利用者）がGoogle前提で動いている**。無理にNextcloudへ移すと連携が壊れる。移行で増えるデータ主権の度合いと、移すコスト・壊れるリスクを天秤にかけて、残すと決めた。

**後から見た当たり外れ** 当たり。共有フォルダ2つは今もGoogleに残っていて、連携は壊れていない。

**残った教訓** 相手がいるデータは、自分一人の都合では動かせない。「どれだけ主権が増えるか」と「何が壊れるか」を1件ずつ天秤にかけるのが、全部移すより先にやる仕事だった。

---

## つまづいた所・積み残し

**9.68GBの謎（未解決）**: 作業の途中、Googleのストレージ画面で「Driveが9.68GB使用中」と表示されているのに気づいた。しかし実際に移行した中身は100〜150MB程度しかない。**90倍以上の差**があり、計算が全く合わなかった。調べた範囲では、以前どこかのタイミングで大きなファイルを削除した際に**ゴミ箱を空にしていなかった**可能性が濃厚、という所まで辿り着いた。Google Driveのゴミ箱は自動では空にならず、手動で「ゴミ箱を空にする」を押さない限り容量を圧迫し続ける。ただしここは確認しきれず、**保留のまま**になっている。冒頭に書いたことがそのまま出ているのがこれで、容量にも料金にも困っていないので、謎を謎のまま置いても誰も困らない。

**もう1人の利用者との共有**: Google Driveで便利だったことの一つに、フォルダ共有がある。Nextcloudでも同じことは可能で、専用アカウントを作って権限を細かく設定する方法と、アカウント不要のリンク共有で手軽に済ませる方法の2通りがある。どちらにするかはまだ決めていない、**現在進行形の課題**として残っている。

**YAMLのインデント事故**: Cloudflare Tunnelの設定ファイルを1マスずれて書いたせいで、Nextcloudだけでなく**同じトンネルを通していた他のサービスまで全部落とした**。これは手順のStep 2に具体的に書いた。困っていない移行でも、事故は普通に起きる。

## 結果

`archive`フォルダはNextcloud経由でMacからGoogle Driveと変わらない感覚で使えるようになった。共有フォルダ2つは「無理に移さない」という判断のままGoogleに残っている。ストレージ表示の9.68GBは未解決。

---

# 手順

ここから下は**Claudeが書き、自分の環境で実行して結果を確かめたもの**だ。2026年9月の版で、実際にこれで`archive`フォルダのファイルが移り、今も毎日動いている。

置いておく理由は2つある。ひとつは、**作業の全体像と長さが先に分かる**こと。見てのとおり4段階で、終わりのある作業だ。もうひとつは、**自分が使っているAIに「これと同じことをやりたい」と渡す材料になる**こと。ゼロから説明するより、動いた実例を見せたほうが早い。あなたもClaudeやChatGPTのようなAIを使えるなら、自分の環境に合わせて出し直してもらうのがいちばんいい。

## Step 0: 製品を選ぶ — 候補はClaudeが調べ、私がその比較を読んで決めた

Google Driveの代わりになる自前ホスト型のソフトは複数ある。**候補を挙げて比較したのはClaudeで、私はできあがった比較を読んで選んだ。** 自分で4製品を触って絞ったわけではないので、そこは正直に書く。比較そのものは同じことをやる人の役に立つので残しておく。

| 製品 | 性格 | 比較で挙がった点 |
|---|---|---|
| **Nextcloud**（採用） | ファイル同期＋周辺機能のセット | 連絡先・カレンダー・メモなどアプリを後から足せる |
| Seafile | ファイル同期に特化 | 同期は速いとされるが、周辺機能はNextcloudほど無い |
| Syncthing | サーバーを介さず端末同士が直接同期 | 管理はシンプルだが「どこからでもブラウザで見る」用途を想定していない |
| Filestash | 既存のストレージにWeb UIを被せる | 土台のストレージが既にある前提。今回は土台から用意する必要があった |

選んだのはNextcloud。この後[連絡先・カレンダーも同じNextcloudに移す](/ja/notes/icloud-google-to-nextcloud-contacts-calendar/)ことになったので、アプリを足せる構成は結果として効いた。

## 前提

以下がすでに用意できていることを前提にする。まだの場合は先に[自分の「サーバー」を持つとはどういうことか](/ja/notes/self-hosting-basics/)を読んでほしい。

- 常時起動しているLinux環境(Docker Engineが使える状態)
- 自分名義のドメイン、およびCloudflare(無料プランで可)でそのドメインを管理していること
- Cloudflare Tunnel(`cloudflared`というソフトを使い、ルーターの設定を一切いじらずにサーバーを安全にインターネット公開する仕組み)がすでに動いている状態。導入手順は[自分の「サーバー」を持つとはどういうことか](/ja/notes/self-hosting-basics/)を参照

## Step 1: docker-composeでNextcloudを構築する

作業用フォルダを作り、`docker-compose.yml`を用意する。

```bash
mkdir ~/nextcloud && cd ~/nextcloud
```

`docker-compose.yml`の中身(Nextcloud本体`app`と、データを整理して保存しておくデータベースソフト`db`〈MariaDB〉の2つのコンテナをセットで起動する構成):

```yaml
services:
  db:
    image: mariadb:11
    restart: always
    volumes:
      - ./db:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=<自分で決めた強力なパスワード>
      - MYSQL_PASSWORD=<自分で決めた強力なパスワード>
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud

  app:
    image: nextcloud:latest
    restart: always
    ports:
      - 127.0.0.1:8081:80
    links:
      - db
    volumes:
      - ./data:/var/www/html
    environment:
      - MYSQL_PASSWORD=<自分で決めた強力なパスワード>
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_HOST=db
      - NEXTCLOUD_ADMIN_USER=admin
      - NEXTCLOUD_ADMIN_PASSWORD=<自分で決めた強力なパスワード>
      - NEXTCLOUD_TRUSTED_DOMAINS=drive.example.com
```

`ports`を`127.0.0.1:8081:80`(自分のマシンの中からしかアクセスできない設定)にしているのがポイント。外部への公開はこのあとCloudflare Tunnel経由で行うので、Nextcloud自体を直接インターネットに晒す必要はない。`NEXTCLOUD_TRUSTED_DOMAINS`には、実際に使う自分のドメインを入れる。

起動する。

```bash
docker compose up -d
docker compose ps
```

`app`・`db`の2つが起動していることを確認したら、`http://localhost:8081`にアクセスして管理者アカウント(`NEXTCLOUD_ADMIN_USER`/`NEXTCLOUD_ADMIN_PASSWORD`で指定した内容)でログインできることを確認する。

**Nextcloudの管理者ユーザー名は一度決めると後から変更できない**ので、`admin`のような分かりやすい名前で最初から決めておくとよい。

## Step 2: Cloudflare Tunnelで公開する

`/etc/cloudflared/config.yml`(Cloudflare Tunnelの設定ファイル)の`ingress`(どのドメイン宛のアクセスを、サーバー内のどのポートに転送するかのルール一覧)に、Nextcloud用の行を追記する。

```yaml
ingress:
  - hostname: drive.example.com
    service: http://localhost:8081
  # ...他のサービスの行がここに続く...
  - service: http_status:404
```

⚠️ **ここで事故を起こしている。** `service:`行のインデント(行頭の空白)は他の行と正確に揃えること。**1マスずれるとYAML(設定ファイルの記述形式)の解析エラーになり、Cloudflare Tunnelがまるごと落ちる。** 落ちるのはNextcloudだけではない。同じトンネルを通している他のサービスも全部同時に止まる。1つのサービスを足す作業が、既に動いていたもの全部を巻き込む形になっている。

編集後は必ず文法チェックを通してから反映する。

```bash
cloudflared tunnel ingress validate
sudo systemctl restart cloudflared
```

DNS側は、Cloudflareの管理画面(またはAPI)で`drive`のようなサブドメイン部分のCNAMEレコードを`<トンネルID>.cfargotunnel.com`に向ける。反映後、そのURLでNextcloudのログイン画面が表示されれば成功。

**Nextcloud特有の注意点**: Nextcloud(内部でApacheというソフトを使っている)は、自分がHTTPS経由でアクセスされていることを正しく認識できないと、ログイン後に無限リダイレクトを起こすことがある。Cloudflare Tunnelは末端(サーバーとの接続)を暗号化しないHTTP接続で待ち受けるため、この設定が必要になる場合がある。症状が出た場合は、Nextcloudの`config/config.php`に以下を追記して回避する。

```php
'overwriteprotocol' => 'https',
```

## Step 3: Macと同期する

ここからは、サーバーさえ用意できていれば誰でもできる部分。Google DriveにはMacの「Finder」(ファイル一覧の画面)に統合される専用アプリがあったが、Nextcloudにも同じような公式デスクトップアプリがある。これをインストールしてログインすると、Finder上にNextcloudのフォルダが表示され、Google Driveの時とほぼ同じ感覚でファイルを開いたり保存したりできる。同期は「全部」ではなく**フォルダ単位で選べる**。最初はNextcloudが用意するお試し用のサンプルフォルダ(Documents、Photos、Templatesなど)が並んでいたが、これは削除してよい。本物のデータが入っているのは、移行した`archive`フォルダだけだった。

## Step 4: バックアップを設定する

「移した先が壊れたら意味がない」ので、移行作業そのものと同じくらいバックアップ体制を大事にしている。`rclone`(色々なオンラインストレージをコマンドラインから操作できるツール)を使い、Backblaze B2という安価なオンラインストレージへ、Nextcloudのデータを毎日自動でコピーする設定にした。

```bash
# データベースのダンプ
docker compose -f ~/nextcloud/docker-compose.yml exec -T db \
  mysqldump -u nextcloud -p<パスワード> nextcloud | gzip > /tmp/nextcloud-db.sql.gz

# ファイル本体の同期
sudo rclone --config /home/<user>/.config/rclone/rclone.conf sync \
  ~/nextcloud/data "$B2_REMOTE/nextcloud/data"
```

これを日次のcron(定期実行の仕組み)に登録しておけば、毎晩自動でバックアップが取られる。バックアップの構成そのものは[バックアップを「消されても戻せる」形にする](/ja/notes/backup-ransomware-resistant/)に分けて書いた。

---

## この移行から取ったもの

困っていないまま始めた移行は、途中で見つけた矛盾を解決しないまま終わる。9.68GBの謎がそれで、1年近く放置しても自分は何も困らない。困りごとが先にあった移行（請求額、空き容量）は、困りごとが消えるまで手を止められないので、最後まで詰める。**動く理由が「順番だから」だと、終わる基準も曖昧になる。**

それでも移したこと自体は無駄になっていない。この後、同じNextcloudに連絡先とカレンダーを集約することになり、土台としてそのまま使えた。事件がなくても先に器を作っておくと、次に事件が起きたときに置き場所を探さなくて済む。そのくらいの効用はあった。

次は、同じNextcloudに連絡先とカレンダーも集約した話。→ [連絡先とカレンダーをiCloud・GoogleからNextcloudに移す](/ja/notes/icloud-google-to-nextcloud-contacts-calendar/)

**更新履歴** — 2026-09-12: 初版 / 2026-09-13: docker-compose設定・Cloudflare Tunnel公開手順・バックアップコマンドを追記し、再現可能なレベルに書き直し / 2026-10-07: 構成を「判断」と「手順」に分け、コマンドをClaudeが書いたことを明記 / 2026-10-07: 冒頭を「引き金になった事件がない移行」として書き直し、製品選定を手順側へ移動
