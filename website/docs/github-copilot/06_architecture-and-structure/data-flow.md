---
sidebar_position: 1
---

# GitHub Copilotがインライン補完時に扱うデータと流れについて

import {SpeakerDeck} from '@site/src/components/Embedded';

:::info
GitHub Copilotのアップデートで状況が変わる可能性もありますのでご注意ください。記事作成の元となったページを内容毎に記載しておりますので、参考にしてください。
:::

## 扱うデータの内容

GitHub Copilotはコード片を含めたプロンプトをLLMへ送信することで、コードや提案を生成します。<br/>
このとき、**IDEで開いているすべてのファイル**から**現在開いているファイルのカーソルの周りのコード**と一致するコード片を探し、プロンプトへ追加することで、現在のIDEの情報を扱います。<br/>
プロンプトでは、リポジトリのURLやファイルパスなど、プロジェクトのコンテキストに関わるさまざまな情報を扱います。<br/>
GitHub CopilotはLLMを使用してコードや提案を生成するため、LLMが扱えるトークンの制限が適用されます。<br/>
GitHub Copilotが一度に扱える情報は[8kトークン](https://github.blog/changelog/2023-08-28-github-copilot-august-28th-update/#expanding-copilots-context-window-to-8k)までとなっています。<br/>
詳細を知りたい場合は以下のページを参照してください。

- [GitHub Copilot Trust Center](https://resources.github.com/copilot-trust-center/)
- [How GitHub Copilot is getting better at understanding your code](https://github.blog/2023-05-17-how-github-copilot-is-getting-better-at-understanding-your-code/)

## データの流れ

IDEのGitHub Copilot拡張機能は以下の流れで認証を行います。

1. IDEからGitHub.comへ問い合わせ
    1. 認証及びライセンス確認
    2. GitHub Copilot用のトークンを取得
2. IDEからAzure上のGitHub Copilotサーバへ問い合わせ
    1. 文脈（プロンプト）送信
    2. 提案を作成
    3. 提案を作成後、プロンプトを破棄
    4. 提案を受信

<SpeakerDeck slideId="f929233fe19549e2b32d73f5b545eb47" page={8} />

Azure上のGitHub Copilotサーバは、GitHub.comとは隔離されており、GitHub.comへデータが送信されることはない。

## データのフィルタリング

GitHub Copilotが提案の前後に行うデータへの処理は以下のとおりです。

- プロンプト送信時
  - 認証
  - 感情分析
- 提案返却時
  - セキュリティフィルター
  - 感情分析
  - 二重検知OSSフィルター

<SpeakerDeck slideId="f929233fe19549e2b32d73f5b545eb47" page={9} />
