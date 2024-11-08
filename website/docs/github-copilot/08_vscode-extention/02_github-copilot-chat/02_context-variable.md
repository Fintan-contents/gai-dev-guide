---
sidebar_position: 2
---

# コンテキスト変数について

GitHub Copilot Chatにはコンテキスト変数という便利な機能があります。<br/>
ここではその機能について紹介します。

| コンテキスト変数 | 説明 |
| :--- | :--- |
| `#editor` | コマンドに `#editor` とすることでエディタで選択中のファイル情報をプロンプトに含めることができます。 |
| `#file` | `#file:package.json` のように指定することで特定のファイルの情報をプロンプトに含めることができます。 |
| `#selection` | 範囲選択したコードやテキスト情報をプロンプトに含めることができます。 |
| `#terminalLastCommand` | 最後に選択したターミナルの最後のコマンドの情報をプロンプトに含めることができます。 |
| `#terminalSelection` | ターミナル上での選択エリアの情報をプロンプトに含めることができます。 |

エージェントコマンド、スラッシュコマンドと併用することも可能です。<br/>
[**操作方法・ショートカット**](../01_github-copilot/02_shortcuts.md)

import {SpeakerDeck} from '@site/src/components/Embedded';

<!-- https://speakerdeck.com/yuhattor/ai-powered-development-with-github-copilot-20240202 -->
<SpeakerDeck slideId="c183f4601ad7409da0d473f98f93a892"  page={23} />

参考：<br/>
[AI-Powered Development with GitHub Copilot 20240202 - Speaker Deck](https://speakerdeck.com/yuhattor/ai-powered-development-with-github-copilot-20240202)
