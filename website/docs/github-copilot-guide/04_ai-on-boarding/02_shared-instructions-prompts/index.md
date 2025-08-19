---
sidebar_position: 2
---

# インストラクションやプロンプトを共有する

GitHub Copilotへ指示する際は、実装したい機能の要件や仕様を明確に伝えること、つまりどのようなプロンプトを書くかが重要です。  
しかし、それとは別にプロジェクトにおける共通知識として、常に参照して欲しい情報も存在します。また、優れたプロンプトは開発者個人がそれぞれ考えるのではなく、プロジェクト内で共有して改善していくことが理想的です。

GitHub CopilotとVisual Studio Codeには、このような課題を解決するための便利な機能が備わっています。

## カスタムインストラクション

AIは新しい会話を始めると、以前のやり取りを記憶していません。そのため、プロジェクトの目的やコーディング規約といった共通知識は、会話のたびに伝える必要があります。

これらの情報を毎回プロンプトに含めるのは非効率です。そこで役立つのが、Visual Studio Codeに備わるGitHub Copilotへ常に参照させる情報をあらかじめ定義しておく「カスタムインストラクション」の仕組みです。  

Visual Studio Codeでは[以下の方法でカスタムインストラクションを定義できます](https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions)。

- ワークスペースの`.github/instructions`ディレクトリ内に、`[任意の名称].instructions.md`ファイル（`.instructions.md`ファイル）を作成する
- Visual Studio Codeの設定ファイル（`settings.json`）で指定する
- ワークスペース内に`.github/copilot-instructions.md`ファイルを作成する

カスタムインストラクションはMarkdown形式で記述します。

本ガイドでは記述したい内容ごとにファイルを分けられる、`.instructions.md`ファイルの利用を想定しています。  
`.instructions.md`ファイルにプロジェクトの共通知識を格納し、AIに参照させる利用方法を想定しています。つまりインストラクション（指示）という名称ではありますが、実際にはAIに対するガイドラインとして使用します。

どのようなカスタムインストラクションをファイルとして用意するかについては、詳しくは[整備しておくファイル](../files-to-be-maintained)を参照してください。  
またインストラクションファイルは、1度作成して終わりではありません。プロジェクトの状況やAIのコード出力精度を見ながら改善、調整していきましょう。

### `.instructions.md`ファイルを使う

`.instructions.md`ファイルは次の2つのセクションで構成されます。

- Front Matter構文で書かれたメタデータを含むヘッダー
- 指示内容の本文

[Use .instructions.md files](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-instructionsmd-files)

ヘッダーの`applyTo`を使うと、インストラクションファイルを適用するファイルのパターンを指定できます。

以下はどのファイルにも適用されるカスタムインストラクションの例です。

```markdown
---
applyTo: "**"
---
# プロジェクト概要

（省略）
```

以下は拡張子が`.java`のファイルに適用されるカスタムインストラクションの例です。

```markdown
---
applyTo: "**/*.java"
---
# Javaに関するコーディング標準

（省略）
```

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::note[具体的なパターン指定をする時の注意]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
`applyTo`に`**`以外のパターンを指定した場合（対象とするパターンを絞り込んだ場合）、明示的にコンテキストに追加したファイルのパスとパターンが一致した場合にのみ効果があります。  
コンテキストに指定しなくても無条件に適用される`**`とは動作が大きく異なるので注意してください。

なお`applyTo`自体は必須で、省略するとインストラクションファイルとしては無視されます。
:::

カスタムインストラクションは、Agent ModeおよびEdit Modeで利用できます。

[Use instructions to get AI edits that follow your coding style](https://code.visualstudio.com/docs/copilot/chat/copilot-edits#_use-instructions-to-get-ai-edits-that-follow-your-coding-style)

カスタムインストラクションを活用することで、GitHub Copilotに常に参照させたい情報を効率的に指定できます。

以下のように内容ごとにインストラクションファイルを作成し、メンテナンスしていくとよいでしょう。

```shell
.github
└── instructions
    ├── architecture.instructions.md
    ├── conding-standards.instructions.md
    ├── directory-structure.instructions.md
    ├── ...
    ├── references-docs.instructions.md
    └── role.instructions.md
```

## プロンプトファイル

これまでにAIとの対話においてプロンプトが重要なことを解説してきました。

よって、AIの能力を最大限に引き出すためには質の高いプロンプトを書く必要がありますが、開発者個人がそれぞれプロンプトをゼロから考えていたのでは効率が上がりません。  
本ガイドでもプロンプトのサンプルは紹介しますが、プロジェクト内でも固有のプロンプトを作成したくなるでしょう。

Visual Studio Codeは、[プロンプトファイル](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)を作成することでプロンプトを再利用できます。  
プロンプトファイルは`.github/prompts`ディレクトリ内に、`[任意の名称].prompt.md`ファイル（`.prompt.md`ファイル）として作成します。

[プログラミングやテストへ入る前に](../../before-coding-test)プロンプトファイル整備し、プログラミングやレビューに活用します。  
またインストラクションファイルと同様、プロンプトファイルの内容もAIの生成するコードの精度などに関係するため、実際の動作を見ながら改善していきましょう。

### `.prompt.md`ファイルを使う

`.prompt.md`ファイルは次の2つのセクションで構成されるMarkdownファイルです。

- Front Matter構文で書かれたメタデータを含むヘッダー
- プロンプトの本文

以下はAgent Modeでのプロンプトファイルの例です。設計書とクラス名、メソッド名を入力変数で指定して、Serviceクラスの作成を指示しています。

```markdown
---
mode: "agent"
tools: ["codebase"]
description: "Serviceクラスを作成してください"
---

# 前提

このプロンプトファイルには入力変数が含まれます。
プロンプトファイルを呼び出しに、入力変数のいずれかが未指定の場合はプロンプトの実行を中止し、ユーザーに入力変数の指定を指示してください。

# 指示

設計書 ${input:doc} にもとづいて、Serviceクラスを実装してください。

- クラス名: ${input:className}
- メソッド名: ${input:methodName}
```

以下はAsk Modeでのプロンプトファイルの例です。指定されたファイルの概要を尋ねています。

```markdown
---
mode: "ask"
description: "ファイルの概要を説明してください"
---

# 指示

${input:doc} の内容を確認し、概要を説明してください。
```

ヘッダーでは以下の内容を指定します。

- `mode`: GitHub Copilot Chatのモードを指定（`ask`、`edit`、`agent`）
  - デフォルトは`agent`
- `tools`: Agent Modeで使用できる[ツール](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode#_agent-mode-tools)を指定
- `description`: プロンプトの簡単な説明を記述

プロンプトの本文には`${variableName}`の構文で変数を含めることができます。ワークスペース変数、選択変数、ファイルコンテキスト変数、そしてチャットから入力する変数が利用できます。  
チャットから入力する場合は`${input:variableName}`または`${input:variableName:placeholder}`の形式になります。

プロンプトファイルは、チャットから`/[プロンプトファイル名]`で呼び出します。ファイル名から`.prompt.md`を除いた部分がコマンド名になります。

Serviceクラスの作成指示をするプロンプトファイル例のパスが`.github/prompts/generate-service.prompt.md`の場合、チャットでの呼び出し例は以下となります。

```shell
/generate-service doc=#file:ユーザー登録機能.md className=UserService methodName=register
```

有用なプロンプトはプロジェクト内で共有し、作業効率を高めていきましょう。
