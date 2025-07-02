---
sidebar_position: 1
---

# コーディングをサポートしてもらう

:::note
本ページは、GitHub Copilot ChatのAgent Modeが一般提供となった後に統廃合する可能性があります。
:::

ここでは、GitHub Copilotにコーディングをサポートしてもらい、製造工程を効率よく進めていく方法を記載します。

前提として、GitHub Copilotにテストコードを作成してもらうためにはAIが理解しやすい形式で書かれた開発設計書が必要です。

## 設計書をもとに実装してもらう

設計書などのドキュメントをもとに、新しいコードを生成する際の基本的な進め方です。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Edit Modeを使います。
:::

GitHub Copilotに実装してもらいたい機能の設計書をMarkdown形式で用意しておき、ソースコードの作成を指示します。

以下のような[プロンプトファイル](../../ai-on-boarding/shared-instructions-prompts)を用意しておき、Chatウィンドウで呼び出します。

```markdown
---
mode: "edit"
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

ここで、プロンプトファイルおよびプロンプトに指定すべき変数の値を以下と仮定します。

- プロンプトファイル： `.github/prompts/generate-service.prompt.md`
- 設計書（`${input:doc}`）： `#file:ユーザー登録機能.md`
- 実装対象のクラス名（`${input:className}`）： `UserService`
- 実装対象のメソッド名（`${input:methodName}`）： `register`

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[ポイント]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
`#file`は[Visual Studio Codeでファイルをコンテキストに追加する変数](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)です。
:::

この時、Chatウィンドウでは以下のように指示します。

```shell
/generate-service doc=#file:ユーザー登録機能.md className=UserService methodName=register
```

この指示で、GitHub Copilotは`UserService`クラスの実装を行います。この時、[事前に整備したインストラクションファイル](../../ai-on-boarding/files-to-be-maintained)の内容を読み取り、プロジェクトの共通知識に沿ったコードを生成しようとします。

生成されたコードに問題がなければ承認し、そうでなければ拒否してGitHub Copilotに修正を依頼する、もしくは自分で修正するといった作業を行ってください。

### ポイント

AIが生成するコードは、人が確認しなければいけません。1度に大量のソースコードを作成させるのではなく、人が確認できる量のソースコードを生成させ、対話を繰り返しながら進めていくようにしましょう。

期待する精度のコードが生成されない場合は、以下のようなことが考えられます。

- プロンプトファイルの指示内容が曖昧
- 設計書の記述が曖昧
- コンテキストに与えるべき情報が不足している
- インストラクションファイルで指示すべき内容が足りていない

実装してもらいたい内容が変わっても似たような指示を繰り返していたり、いつも同じ情報を追加で与えているような場合はインストラクションファイルやプロンプトファイルなどを見直すことも検討しましょう。  

また、完璧なコードが生成されることを目指して永遠にプロンプトなどの改善とトライ＆エラーを繰り返すのではなく、ある程度のところで割り切って残りは人が修正するといった割り切りも必要でしょう。

AIにソースコードを出力させてもうまくいかない場合は、1度Ask Modeで実装予定の内容を出力させ、確認や調整を行ってからEdit Modeで出力させるという方法もあります。  
Modeの切り替えが手間にはなりますが、試してみてください。

## 実装を修正・改善してもらう

既存のコードに対して、コメントの追加やリファクタリングなど、特定の変更を加えたい場合に有効な方法です。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Edit Modeを使います。
:::

簡単な修正やリファクタリング、Javadocのようなコメントの追加のようなタスクをGitHub Copilotに指示します。

たとえばJavadocの生成では対象のソースコードを開き、以下の指示をすればよいでしょう。

```markdown
○○メソッドのJavadocを作成してください
```

より具体的な指示の例を以下に示します。

```markdown
// リファクタリングの指示
重複しているコードを共通化して、可読性を向上させてください。
```

GitHub Copilotが提案した変更内容を確認し、問題がなければ承認します。期待通りでなければ、追加の指示を与えて修正を依頼するか、手動で修正します。

インストラクションファイルは自動的に読み込まれます。  
タスクに必要だと思われる場合は、コンテキストにファイルを追加することを検討してください。

このような指示は、アドホックなプロンプトで十分なことが多いでしょう。  
頻繁に使ったり、指示内容が大きくなりがちなタスクの場合は、プロンプトファイルとしてプロジェクト内で共有することを検討しましょう。

## 実装方法や既存コードの質問をする

実装中に不明点が出てきた場合や、既存コードの理解を深めたい場合に、GitHub Copilotを相談相手として活用する方法です。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

実装方法がわからない時や、既存のコードがなにをしているのか説明を求めたくなることもあるでしょう。

このような場合、GitHub Copilotに質問できます。  
質問は、GitHub Copilot Chatの**Ask Modeで**行ってください。Edit ModeのGitHub Copilot Chatに対して質問すると、指示が質問であるにも関わらずファイルを修正されてしまうことがあります。

既存のコードの説明であれば対象のソースコードを開き、以下のように質問するとよいでしょう。

```markdown
// 既存コードに関する質問
〇〇メソッドの処理内容を説明してください
```

新しい実装の方法について質問することもできます。

```markdown
// 実装方法に関する質問
Javaでファイルを読み込むにはどうすればいいですか？
```

## エラーの解決をサポートしてもらう

:::info[使用するGitHub Copilot ChatのMode]
Ask Modeを使います。
:::

コンパイルエラーや実行時エラーが発生した場合に、その解決をGitHub Copilotに依頼します。

エラーが発生しているソースコードを開き、Chatウィンドウにエラーメッセージを貼り付けて、以下のように質問します。

```markdown
このエラーの原因と解決方法を教えてください。

（ここにエラーメッセージを貼り付ける）
```

GitHub Copilotは、エラーの原因と解決策の候補を提示してくれます。  
提示された内容をもとに、コードを修正してください。

## コード補完を行う

:::note
このセクションはGitHub Copilot Chatについて書いたものではありません。
:::

GitHub Copilotのコード補完は、コーディング中にリアルタイムでコードを提案する機能です。人がコードを書く主体となり、AIがそれを補助する形で開発を進める場合に有効です。

### 基本的な使い方

コードを書き始めると、GitHub Copilotが自動的に補完候補を提案します。
提案を受け入れる場合は`Tab`キーを、拒否する場合は`Esc`キーを押します。

また`Alt + \` (macOSでは `Option + \`) を押すことで、いつでも手動で補完をトリガーできます。

### 補完のヒント

- コメントで意図を伝える： これから書こうとしている処理の内容をコメントとして記述すると、GitHub Copilotがその意図を汲み取り、より精度の高いコードを提案してくれます
- 複数の候補から選択する： `Alt + ]` (macOSでは `Option + ]`) や `Alt + [` (macOSでは `Option + [`) を使うと、他の補完候補に切り替えることができます

コメントを使うとコード補完の精度を上げることができますが、これを目的にコメントを大量に書くような使い方には注意しましょう。  
GitHub Copilotのためだけに本来は不要なコメントが作成されるようでは本末転倒です。そのような場合はGitHub Copilot ChatのEdit Modeを使い、より具体的な指示でコード生成を依頼する方が効率的でしょう。
