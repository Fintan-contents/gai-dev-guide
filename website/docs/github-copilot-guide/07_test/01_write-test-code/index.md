---
sidebar_position: 1
---

# テストコードの作成をサポートしてもらう

:::note
本ページは、GitHub Copilot ChatのAgent Modeが一般提供となった後に統廃合する可能性があります。
:::

ここでは、GitHub Copilotにテストコードの作成をサポートしてもらい、単体テスト工程を効率よく進めていく方法を記載します。

前提として、GitHub Copilotにテストコードを作成してもらうためには、テスト対象のソースコードに加えてAIが理解しやすい形式で書かれたテスト仕様書および設計書が必要です。

## テスト仕様書もとにテストコードを作成してもらう

テスト仕様書をもとに、テストコードを生成する際の基本的な進め方です。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Edit Modeを使います。
:::

以下をコンテキストに追加し、GitHub Copilotにテストコードの作成を指示します。

- テスト仕様書
- 設計書
- テスト対象のソースコード

以下のような[プロンプトファイル](../../ai-on-boarding/shared-instructions-prompts)を用意しておき、Chatウィンドウで呼び出します。

```markdown
---
mode: "edit"
description: "テストクラスを作成してください"
---

# 前提

このプロンプトファイルには入力変数が含まれます。
プロンプトファイルを呼び出しに、入力変数のいずれかが未指定の場合はプロンプトの実行を中止し、ユーザーに入力変数の指定を指示してください。

# 指示

テスト仕様書 ${input:spec} をもとに、テスト対象クラス ${input:targetClass} の単体テストクラスを作成してください。

- 実装するテストクラス名: ${input:testClassName}

テストコードの内容を検討する際には、以下も参考にしてください。

- 設計書 ${input:doc}
- テスト対象クラス: ${input:targetClass}
```

ここで、プロンプトファイルおよびプロンプトに指定すべき変数の値を以下と仮定します。

- プロンプトファイル：`.github/prompts/generate-test.prompt.md`
- テスト仕様書（`${input:spec}`）： `#file:ユーザー登録機能テスト仕様書.md`
- テストクラス名（`${input:testClassName}`）： `UserServiceTest`
- 設計書（`${input:doc}`）： `#file:ユーザー登録機能.md`
- テスト対象クラス（`${input:targetClass}`）： `UserService.java`

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[ポイント]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
`#file`は[Visual Studio Codeでファイルをコンテキストに追加する変数](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)です。
:::

この時、Chatウィンドウでは以下のように指示します。

```shell
/generate-test spec=#file:ユーザー登録機能テスト仕様書.md testClassName=UserServiceTest doc=#file:ユーザー登録機能.md targetClass=#file:UserService.java
```

この指示で、GitHub Copilotは`UserServiceTest`クラスの実装を行います。この時、[事前に整備したインストラクションファイル](../../ai-on-boarding/files-to-be-maintained)の内容を読み取り、プロジェクトの共通知識に沿ったテストコードを生成しようとします。

生成されたテストコードに問題がなければ承認し、そうでなければ拒否してGitHub Copilotに修正を依頼する、もしくは自分で修正するといった作業を行ってください。

### ポイント

AIにソースコードを生成させた場合と同様、テストコードも人が確認しなければいけません。

ただしテストコードは大量に生成することになるため、レビューでもAIの助けを借りるようにしましょう。  
詳しくは[テストコードをレビューする](../test-code-review)を参考にしてください。

もちろん期待する精度のテストコードが生成されない場合は、情報が不足していたり指示が曖昧であるといったことが考えられます。
必要に応じてインストラクションファイルやプロンプトファイルなどを見直すことも検討しましょう。

また、完璧なテストコードが生成されることを目指して永遠にプロンプトなどの改善とトライ＆エラーを繰り返すようなことをしないのも、[コーディングをサポートしてもらう](../../programming/coding)と同じです。

## テストコードを修正・改善してもらう

既存のテストコードに対して、テストケースの追加やリファクタリングなど、特定の変更を加えたい場合に有効な方法です。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Edit Modeを使います。
:::

簡単な修正やリファクタリング、テストケースの追加のようなタスクをGitHub Copilotに指示します。

たとえばテストケースの追加では対象のソースコードを開き、以下の指示をすればよいでしょう。

```markdown
○○メソッドの異常系のテストケースを追加してください
```

より具体的な指示の例を以下に示します。

```markdown
// リファクタリングの指示
重複しているテストコードを共通化して、可読性を向上させてください。
```

GitHub Copilotが提案した変更内容を確認し、問題がなければ承認します。期待通りでなければ、追加の指示を与えて修正を依頼するか、手動で修正します。

インストラクションファイルは自動的に読み込まれます。
タスクに必要だと思われる場合は、コンテキストにファイルを追加することを検討してください。

このような指示は、アドホックなプロンプトで十分なことが多いでしょう。
頻繁に使ったり、指示内容が大きくなるこりがちなタスクの場合は、プロンプトファイルとしてプロジェクト内で共有することを検討しましょう。

## 実装方法や既存のテストコードの説明を依頼する

テストの実装中に不明点が出てきた場合や、既存のテストコードの理解を深めたい場合に、GitHub Copilotを相談相手として活用する方法です。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

テストの実装方法がわからない時や、既存のテストコードがなにをしているのか説明を求めたくなることもあるでしょう。

このような場合、GitHub Copilotに質問できます。
質問は、GitHub Copilot Chatの**Ask Modeで**行ってください。Edit ModeのGitHub Copilot Chatに対して質問すると、指示が質問であるにもかかわらずファイルを修正されてしまうことがあります。

既存のテストコードの説明であれば対象のソースコードを開き、以下のように質問するとよいでしょう。

```markdown
// 既存コードに関する質問
〇〇Testクラスの××というテストメソッドで、どのようなテストおよび確認を行っているのか説明してください
```

新しいテストの実装方法について質問することもできます。

```markdown
// 実装方法に関する質問
Mockitoを使って、○○クラスが依存する△△をモックにするにはどうすればいいですか？
```

## 失敗するテストの修正をサポートしてもらう

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

テストが失敗する場合に、その原因や解決方法をGitHub Copilotに相談します。

失敗するテストコードを開き、Chatウィンドウにエラーメッセージを貼り付けて、以下のように質問します。

```markdown
このテストが失敗する原因と解決方法を教えてください。

（ここにテスト失敗時のエラーメッセージを貼り付ける）
```

GitHub Copilotは、エラーの原因と解決策の候補を提示してくれます。
提示された内容をもとに、テストコードもしくはソースコードそのものを修正してください。

## コード補完を行う

GitHub Copilotのコード補完機能もテストコードの実装に役立ちます。
詳細は[コーディングをサポートしてもらう](../programming/coding)を参照してください。
