---
sidebar_position: 1
---

# コードを生成する

GitHub Copilot ChatのAgent Modeを使い、ソースコードやテストコードを生成させ、完成度を高めていく方法について記載します。

## ソースコード作成からテスト実施までを行う

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Agent Modeを使います。
:::

GitHub Copilotに実装してもらいたい機能の設計書とテスト仕様書をMarkdown形式等のテキスト形式で用意しておき、機能の実装を指示します。  
テストコードは開発の進め方から判断してGitHub Copilotが自動で作成し、テストの実行まで行います。

以下のような[プロンプトファイル](../../ai-on-boarding/shared-instructions-prompts)を用意しておき、Chatウィンドウで呼び出します。

```markdown
---
mode: "agent"
tools: ["Agentが使用できるツール"]
description: "Serviceクラスを作成してください"
---

# 前提

このプロンプトファイルには入力変数が含まれます。
プロンプトファイルを呼び出しに、入力変数のいずれかが未指定の場合はプロンプトの実行を中止し、ユーザーに入力変数の指定を指示してください。

# 指示

設計書 ${input:doc} にもとづいて、Serviceクラスを実装してください。

- クラス名: ${input:className}
- メソッド名: ${input:methodName}

テストコードはテスト仕様書 ${input:spec} をもとに作成してください。  
またテストコードの内容を検討する際には、設計書 ${input:doc} とテスト対象クラス ${input:className} クラスも参考にしてください。

# 実装パターン

## Serviceの実装例

（省略）

# テストコードパターン

## Serviceのテストコード実装例

（省略）
```

ここで、プロンプトファイルおよびプロンプトに指定すべき変数の値を以下と仮定します。

- プロンプトファイル： `.github/prompts/generate-service.prompt.md`
- 設計書（`${input:doc}`）： `#file:ユーザー登録機能.md`
- テスト仕様書（`${input:spec}`）： `#file:ユーザー登録機能テスト仕様書.md`
- 実装対象のクラス名（`${input:className}`）： `UserService`
- 実装対象のメソッド名（`${input:methodName}`）： `register`

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[ポイント]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
プロンプトファイルの`tools`には、Agent Modeに利用させてもよいツールを指定します。

また`#file`は[Visual Studio Codeでファイルをコンテキストに追加する変数](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)です。
:::

この時、Chatウィンドウでは以下のように指示します。

```shell
/generate-service doc=#file:ユーザー登録機能.md spec=#file:ユーザー登録機能テスト仕様書.md  className=UserService methodName=register
```

この指示で、GitHub Copilotは[事前に整備したインストラクションファイル](../../ai-on-boarding/files-to-be-maintained)の内容を読み込んだうえで以下の作業を行います。

- `UserService`クラスの作成
- テストクラスの作成とテストメソッドの実装
- テストの実施

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[ポイント]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
テスト実施などのためにGitHub Copilotが外部コマンドを実行する際には、ユーザに実行許可を求めます。  
これは意図しないコマンドの実行を防ぐための安全機能ですが、許可を与えない限りAIのタスクはそこで停止することに注意してください。
:::

ユーザに変更内容の承認を求めるのは、開発の進め方で定めた内容が完了した時になります。  
それまでは、外部コマンドの実行でユーザに実行許可を求める場合を除き、実装内容に問題があった場合は自己修復を試みます。

最終的に生成されたコードに問題がなければ承認し、そうでなければ拒否してGitHub Copilotに修正を依頼する、もしくは自分で修正してください。

### 人が確認できる量のソースコードを生成させる

Agent Modeを利用すると定めた開発の進め方に則りテストコードの作成まで行うため、1度に生成されるソースコードのボリュームが大きくなりがちです。
また単にソースコードを生成するのではなく、テスト実行など複数のステップを挟むため実行時間も伸びやすくなります。

一方で、AIが生成するコードは人が確認しなければいけません。  
生成されるソースコード量や実行時間も大きくなるため、インストラクションファイルが整備しきれていなかったり、曖昧な指示をしてしまったりすると、AIに大幅な修正依頼をすることが多くなるでしょう。  
結果として、かえって生産性が低下する要因となりかねません。

特に開発の初期段階では、扱いきれないほどの大量のソースコードを生成させるのではなく、人が確認できる量のソースコードを生成させて精度を見てみるとよいでしょう。

### AIに与える情報や開発プロセスを調整する

期待する精度のソースコードが生成されない場合は、以下のような点を見直し必要に応じて修正します。

- インストラクションファイルやプロンプトファイルの指示内容が曖昧ではないか
- 設計書の記述内容が曖昧ではないか
- コンテキストに与えるべき情報の不足していないか
- AIに与える情報が膨大になっていないか

AIに与える情報が多すぎる場合は、生成する成果物の精度が低下します。この場合、以下のようなプロセス変更を検討してみましょう。

- ソースコードの作成、テストコードの作成とテスト実施をわけて指示する
- テストケースが大量にある場合は、入力となるテスト仕様書を分割して生成を指示する

この時、Agent Modeが自己修復できるようなプロセスとしましょう。たとえば1回の指示ではソースコードの作成のみに留める場合、ビルドや静的解析が成功するところまでを確認する、などです。  
人が作業を実施した場合に、確認する単位に合わせると考えやすいでしょう。

また、完璧なコードが生成されることを目指して永遠にプロンプトなどの改善とトライ＆エラーを繰り返すのではなく、ある程度のところで割り切って残りは人が修正するといった割り切りも必要なことがあります。  

AIにソースコードを出力させてもうまくいかない場合は、1度Ask Modeで実装予定の内容を出力させ、確認や調整を行ってからAgent Modeで出力させるという方法もあります。  
Modeの切り替えが手間にはなりますが、試してみてください。

本ガイドが目指すGitHub Copilot導入の目的は、AIを活用した生産性の向上です。AIに完璧に作業をさせることではありません。  
AIの出力精度を向上させ生産性を上げるための工夫は必要ですが、AIを活用するという手段に囚われすぎないでください。

## レビューを行う

GitHub Copilotにソースコードやテストコードのレビューをサポートしてもらい、レビュー効率を高める方法を記載します。

### ソースコードのレビュー

作成されたソースコードをレビューします。

#### 定型的な観点でのソースコードレビュー

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

まず、プロジェクトで定められたコーディング規約や、一般的な品質（パフォーマンス、セキュリティなど）の観点でレビューを行います。
これらの定型的なチェックはAIに任せることで、人はより本質的な機能のレビューに集中できます。

[観点別にレビューを実施する](../../before-coding-test/review-perspective)で紹介したように、レビューしたいソースコードを開き、レビュー観点別に用意したプロンプトを[Promptis](https://marketplace.visualstudio.com/items?itemName=tis.promptis)で一括実行します。
たとえば、「セキュリティ」、「パフォーマンス」、「可読性」といった観点ごとにプロンプトを用意し、一括でレビューを実行することで、網羅的かつ効率的なレビューが可能になります。

#### 機能的な観点でのソースコードレビュー

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

次に、ソースコードが設計書の仕様を正しく満たしているかを確認します。
AIにレビューさせることで、人による確認だけでは見落としがちな観点に気づける可能性があります。

以下のような[プロンプトファイル](../../ai-on-boarding/shared-instructions-prompts)を用意しておき、Chatウィンドウで呼び出します。

```markdown
---
mode: "ask"
description: "ソースコードが設計書に定義された仕様を満たしているかレビューしてください"
---

# 前提

このプロンプトファイルには入力変数が含まれます。
プロンプトファイルを呼び出しに、入力変数のいずれかが未指定の場合はプロンプトの実行を中止し、ユーザーに入力変数の指定を指示してください。

# 指示

設計書 ${input:doc} の内容を確認して、現在開いているソースコードが必要な処理を実装しているかレビューしてください。  
指摘は箇条書きで記載してください。
```

ここで、プロンプトファイルおよびプロンプトに指定すべき変数の値を以下と仮定します。

- プロンプトファイル： `.github/prompts/review-service.prompt.md`
- 設計書（`${input:doc}`）： `#file:ユーザー登録機能.md`

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[ポイント]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
`#file`は[Visual Studio Codeでファイルをコンテキストに追加する変数](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)です。
:::

この時、Chatウィンドウでは以下のように指示します。

```shell
/review-service doc=#file:ユーザー登録機能.md
```

AIからのフィードバックを参考に、ソースコードを修正・改善します。

ただし、最終的な成果物責任は人にあることを忘れないようにしましょう。AIはあくまでサポート役です。

### テストコードのレビュー

ソースコードと同様に、テストコードもレビューします。

#### 定型的な観点でのテストコードレビュー

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

プロジェクトで定められたテストコードの規約や、使用しているテストフレームワークの作法に沿っているかなどを確認します。
ソースコードの定型レビューと同様に、[Promptis](https://marketplace.visualstudio.com/items?itemName=tis.promptis)などを活用して効率的にレビューを行いましょう。
「テストの命名規則」や「アサーションの適切さ」といった観点でプロンプトを用意しておくと便利です。

#### 機能的な観点でのテストコードレビュー

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

テストコードが、テスト仕様書で定義されたテストケースを網羅しているか、内容が妥当かを確認します。

以下のような[プロンプトファイル](../../ai-on-boarding/shared-instructions-prompts)を用意しておき、Chatウィンドウで呼び出します。

```markdown
---
mode: "ask"
description: "テストコードがテスト仕様書に定義された仕様を満たしているかレビューしてください"
---

# 前提

このプロンプトファイルには入力変数が含まれます。
プロンプトファイルを呼び出しに、入力変数のいずれかが未指定の場合はプロンプトの実行を中止し、ユーザーに入力変数の指定を指示してください。

# 指示

テスト仕様書 ${input:spec} と設計書 ${input:doc} の内容を確認して、現在開いているテストコードが必要なテストを実装しているかレビューしてください。  
特に、テストケースの網羅性や、テストデータ、アサーションが適切かどうかの観点で確認してください。

指摘は箇条書きで記載してください。
```

ここで、プロンプトファイルおよびプロンプトに指定すべき変数の値を以下と仮定します。

- プロンプトファイル： `.github/prompts/review-test.prompt.md`
- テスト仕様書（`${input:spec}`）： `#file:ユーザー登録機能テスト仕様書.md`
- 設計書（`${input:doc}`）： `#file:ユーザー登録機能.md`

この時、Chatウィンドウでは以下のように指示します。

```shell
/review-test spec=#file:ユーザー登録機能テスト仕様書.md doc=#file:ユーザー登録機能.md
```

AIからのフィードバックを参考に、テストコードを修正・改善します。
これによりテストコードの品質を高め、テストの見落としを防ぐことができます。

ただし、ソースコードのレビューと同様に、最終的な成果物に対する責任は人にあることを忘れないようにしましょう。
