---
sidebar_position: 2
---

# 操作方法・ショートカット

GitHub Copilotの基本操作を学びます。

## Github Copilotの操作方法

| アクション | 説明 | ショートカット |
| :--- | :--- | :--- |
| インライン候補を受け入れる | 提案された内容をソ−スコードに反映する。 | Windows: `Tab` <br/> Mac: `Tab` |
| インライン候補を無視する | 提案された内容を却下し非表示にする。 | Windows: `Esc` <br/> Mac: `Esc` |
| 次のインライン候補を表示する | 複数の候補を提案された場合、次の候補を表示する。 | Windows: `Alt + ]` <br/> Mac: `Option + ]` |
| 前のインライン候補を表示する | 複数の候補を提案された場合、前の候補を表示する。 | Windows: `Alt + [` <br/> Mac: `Option + [` |
| インライン候補をトリガーする | 現在カーソルがある位置で提案させる。 | Windows: `Alt + \` <br/> Mac: `Option + \` |
| GitHub Copilot を開く | 提案候補一覧を表示する。 | IDEによるため下記リンク参照 |
| GitHub Copilot のオン/オフを切り替える |  | IDEによるため下記リンク参照 |

参考：[環境での GitHub Copilot の構成 - GitHub Docs](https://docs.github.com/ja/copilot/configuring-github-copilot/configuring-github-copilot-in-your-environment?tool=vscode)

## Github Copilot Chatの操作方法

Copilot Chatにはエージェントコマンドとスラッシュコマンドが用意されており、<br/>
それぞれを単独、もしくは組み合わせて、質問の意図と範囲を伝えることができます。

### エージェントコマンド

Copilotのロールを設定するためのコマンドです。回答の範囲を限定することができます。<br/>
コマンドの後に質問を入力し使用します。

| コマンド | 説明 |
| :--- | :--- |
| @workspace | ワークスペース内のコードをコンテキストとして回答してくれます。<br/>関連するコードの探索や、ワークスペース内のコードに関する質問を行う際に有効です。 |
| @vscode | VS Codeの機能やコマンドについて把握しています。<br/>「VS Codeのこの設定を変えたい」「こういうショートカットある？」のような質問を行う際に有効です。 |

### スラッシュコマンド

Copilotに行ってほしいタスクを指示するコマンドです。<br/>
コマンドの後ろに指示を追加して使用することも可能です。

| コマンド | 説明 | 併用可能コマンド |
| :--- | :--- | :--- |
| /explain | 選択したコードの解説を行ってくれます。 | @workspace |
| /fix | 選択したコードの修正を提案してくれます。 | @workspace |
| /new | 指定したフレームワーク等でプロジェクトの雛形を作成してくれます。<br/>`@workspace /new spring boot` のように使います。 | @workspace |
| /newNotebook | 要件を伝えるとJupyter Notebookを作ってくれます。 | @workspace |
| /terminal | 行いたい作業のコマンドを説明してくれます。<br/>`/terminal dockerのコンテナに入りたい` | @workspace |
| /tests | 選択したコードのテストを生成してくれます。 | @workspace |
| /api | VS Codeの拡張機能開発に関する質問に答えてくれます。 | @vscode |
| /help | Copilotのヘルプを表示してくれます。 |  |
| /clear | 現在の会話を終了します。 |  |
