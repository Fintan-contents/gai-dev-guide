---
sidebar_position: 1
---

# 効果的なGitHub Copilotプロンプトの原則

GitHub Copilotを効果的に扱うコツとして以下の4つが挙げられています。

import {SpeakerDeck} from '@site/src/components/Embedded';

<!-- https://speakerdeck.com/yuhattor/ai-powered-development-with-github-copilot-20240202 -->
<SpeakerDeck slideId="c183f4601ad7409da0d473f98f93a892"  page={19} />

## 文脈

GitHub Copilotが予測のために使う文脈を制御すると、より良い結果が生まれやすくなります。

- 文脈として与えたいファイルのみをタブで開く。
  - GitHub Copilotは現在タブで開かれているファイルを予測のために扱います。
- GitHub Copilot Chatを使う場合は、@workspaceコマンドや、#file等のコンテキスト変数コマンドを使つことで、文脈の指定を行えます。

## 意図

GitHub Copilotが何をゴールにすべきか伝えることで、意図にそった結果が生まれやすくなります。

- コメントで意図を記載する。
- クラス名、メソッド名等で意図を伝える。

## 明瞭さ

GitHub Copilotは指示が明瞭であればあるほど、意図した結果が生まれやすくなります。<br/>
曖昧さを避け、明瞭な指示を行いましょう。

## 具体性

プロンプトが具体的であるとGitHub Copilotの予測精度が良くなります。

- 具体的な出力例をプロンプトに含める
- 出力・入力の型を記載する

引用元：<br/>
[AI-Powered Development with GitHub Copilot 20240202 - Speaker Deck](https://speakerdeck.com/yuhattor/ai-powered-development-with-github-copilot-20240202)
