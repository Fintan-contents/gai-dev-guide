---
sidebar_position: 1
---

# 補足

:::note
本ページの内容はGitHub Copilot ChatのAgent Mode向けですが、Agent Mode以外のModeやコード補完も含めて活用方法を補足しています。
:::

[プログラミング〜テスト](../../programming-agent)では、GitHub Copilot ChatのAgent Modeを使い、ソースコードの作成からテスト実施まで一連の流れを自律的に実施してもらう方法を記載しました。

ここでは、ソースコードの修正や質問、コード補完など少し小さな粒度でGitHub Copilot Chatを扱う方法を紹介します。

## 実装を修正・改善してもらう

既存のコードに対して、コメントの追加やリファクタリングなど、特定の変更を加えたい場合に有効な方法です。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Agent Modeを使います。
:::

簡単な修正やリファクタリング、Javadocのようなコメントの追加のようなタスクをGitHub Copilotに指示します。

たとえばJavadocの生成では対象のソースコードを開き、以下の指示をすればよいでしょう。

```
○○メソッドのJavadocを作成してください
```

より具体的な指示の例を以下に示します。

```
// リファクタリングの指示
重複しているコードを共通化して、可読性を向上させてください。
```

Agent Modeであればインストラクションファイルに[開発の進め方](../ai-on-boarding/files-to-be-maintained/how-to-proceed-with-development)を記載することにより、このような修正であってもテストコードへの反映やテストの実行といったステップを自動的に実施します。

テストが合格した後にGitHub Copilotが変更内容の承認を求めてくるので、確認して問題がなければ承認します。期待通りでなければ、追加の指示を与えて修正を依頼するか、手動で修正します。

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
質問は、GitHub Copilot Chatの**Ask Modeで**行ってください。Agent ModeのGitHub Copilot Chatに対して質問すると、指示が質問であるにも関わらずファイルを修正されてしまうことがあります。

既存のコードの説明であれば対象のソースコードを開き、以下のように質問するとよいでしょう。

```
// 既存コードに関する質問
〇〇メソッドの処理内容を説明してください
```

新しい実装の方法について質問することもできます。

```
// 実装方法に関する質問
Javaでファイルを読み込むにはどうすればいいですか？
```

## エラーの解決をサポートしてもらう

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->
<!-- textlint-disable jtf-style/4.3.2.大かっこ［］ -->
:::info[使用するGitHub Copilot ChatのMode]
<!-- textlint-enable jtf-style/4.3.2.大かっこ［］ -->
<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->
Ask Modeを使います。
:::

コンパイルエラーや実行時エラーが発生した場合に、その解決をGitHub Copilotに依頼します。

エラーが発生しているソースコードを開き、Chatウィンドウにエラーメッセージを貼り付けて、以下のように質問します。

```
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
GitHub Copilotのためだけに本来は不要なコメントが作成されるようでは本末転倒です。そのような場合はGitHub Copilot ChatのAgent Modeを使い、より具体的な指示でコード生成を依頼する方が効率的でしょう。
