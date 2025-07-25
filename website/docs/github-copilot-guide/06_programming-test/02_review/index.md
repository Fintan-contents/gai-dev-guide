---
sidebar_position: 1
---

# レビュー

GitHub Copilotにソースコードやテストコードのレビューをサポートしてもらい、レビュー効率を高める方法を記載します。

## ソースコードのレビュー

作成されたソースコードをレビューします。

### 定型的な観点でのソースコードレビュー

実装する処理によらず、プロジェクト内でのコーディング標準やセキュリティなど遵守して欲しいルールがあるでしょう。

このような観点でのレビューを行う方法を記載します。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

通常、一般的なコード品質やパフォーマンス、セキュリティなどの観点は静的解析に近い位置づけで実施されるべきものです。  
これらは静的解析ツールでは確認することが難しく、人による確認となりがちです。そして、その精度は実施する人の能力や感性に依存していると言わざるをえません。

しかし、本質的にレビューしたいのは機能的な観点です。

このようなレビューは、AIに実施させるのがよいでしょう。

[観点別にレビューを実施する](../../before-coding-test/review-perspective)で紹介したように、レビューしたいソースコードを開き、レビュー観点別に用意したプロンプトを[Promptis](https://marketplace.visualstudio.com/items?itemName=tis.promptis)で一括実行します。
たとえば、「セキュリティ」、「パフォーマンス」、「可読性」といった観点ごとにプロンプトを用意し、一括でレビューを実行することで、網羅的かつ効率的なレビューが可能になります。

### 機能的な観点でのソースコードレビュー

定型的なレビューを行った後は、実装しなければならない機能的な内容を網羅しているか、誤っていないかを確認する必要があります。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

人がレビューすることも重要ですが、AIにレビューさせることで人によるレビューでの見落とし防止や多角的な視点での確認が期待できます。 特にAIが生成したコードをレビューさせる場合は、AI自身によるセルフチェックとしても有効です。

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

## テストコードのレビュー

ソースコードと同様に、テストコードもレビューします。

### 定型的な観点でのテストコードレビュー

テストコードにも、プロジェクトで定められたテストコード標準やテストフレームワークの作法など、遵守すべきルールが存在します。このような観点でのレビューはAIに任せることで、人はより本質的なレビューに集中できます。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

ソースコードの定型レビューと同様に、[Promptis](https://marketplace.visualstudio.com/items?itemName=tis.promptis)などを活用して効率的にレビューを行いましょう。
「テストの命名規則」、「アサーションの適切さ」、「テストデータの妥当性」といった観点ごとにプロンプトを用意し、一括でレビューを実行することで、網羅的かつ効率的なレビューが可能になります。

### 機能的な観点でのテストコードレビュー

定型的なレビューの後は、テストコードが実施したいテスト仕様を網羅しているか、テストケースの内容が妥当かを確認する必要があります。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

人がレビューすることも重要ですが、AIにレビューさせることで人によるレビューでの見落とし防止や多角的な視点での確認が期待できます。

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
