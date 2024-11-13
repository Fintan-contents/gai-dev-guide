---
sidebar_position: 09
---

# 導入検討時に考慮すべき事項 [FAQ]

:::info
この記事は、2023年11月末時点の情報を元に作成しています。GitHub Copilotのアップデートで状況が変わる可能性もありますので、ご注意ください。
:::

## GitHub Copilotが提案を行う仕組み

GitHub Copilotは提案を生成の際エディタのソースコードにアクセスし、プロンプトを作成します。プロンプトはセキュアな形でモデルに送信され、提案が生成されたあとプロンプトは破棄されます。<br/>
アクセスするソースコードは編集中のファイルだけでなく隣接ファイルや関連ファイル、リポジトリのURLなどを含むことがあります。

## FAQ

### 全般

#### Q。使用したいのですが、利用申請はどうすればよいですか？

利用申請の手続きは各社ごとの対応方針に従ってください。

#### Q. コードリポジトリがGitHubでなくてもGitHub Copilotを利用できますか？

利用できます。例えば、コードリポジトリが社内のgit、svnで管理しているプロジェクトでもGitHub Copilotをご利用いただけます。

#### Q. 顧客受託開発PJで利用する場合に確認すべき事項はなんですか？

お客様にメリット、セキュリティへの対策をご説明し、PJごとに利用許諾を得るようにしてください。<br/>
各社ごとの対応方針に従ってください。

#### Q. PJメンバ外部パートナーの開発者も利用できますか？

アカウントの払い出しは、各社ごとの対応方針に従ってください。<br/>
TISでは、自社社員およびTIS派遣パートナー様のいずれもご利用いただくことが可能としています。

### セキュリティについて

#### Q. GitHub Copilot利用中に入力を推奨しないデータはありますか？

機密性の高い情報（個人情報、パスワード、APIキーなど）は入力しないでください。

#### Q. 送信されるデータは暗号化されていますか？

またGitHub Copilot for Businessは、サジェストを生成する目的以外ではエディタのソースコードにアクセスしません。サジェストを生成するために使用されたプロンプトは、セキュアに送信され、提案が生成されると保持されず破棄されます。

#### Q. GitHub Copilotが提案するコードの品質は問題ないですか？

GitHub Copilotが提案するコードの品質は使用される文脈やコードベースによって変わります。<br/>
提案されたコードは常に手動でレビューし、必要に応じて調整することが推奨されます。

#### Q. GitHub Copilotが提案するコードに脆弱性はありますか？

GitHub Copilotが提案するコードには、脆弱性を含まれる恐れがあります。Copilotは過去のコードから学習するため、その学習データに含まれる脆弱性を反映することがあります。ユーザは提案されたコードを慎重にレビューし、セキュリティベストプラクティスに従ってください。

#### Q. GitHub Copilotが提案するコードは商用利用しても問題ありませんか？

GitHub Copilotが生成するコードは、一般的には商用利用が可能です。しかし、生成されたコードが他のソースコードを参考にしている場合、そのソースコードのライセンスに従う必要があります。

#### Q. GitHub Copilotが提案するコードの権利は誰が保有しますか？

GitHub Copilotによって生成されたコードの権利は、そのコードを生成したユーザに帰属します。ただし、生成されたコードが他の著作権で保護されたコードに基づいている場合は、それらの権利に注意する必要があります。

#### Q. GitHub Copilotの提案にOSSライセンスのコードが含まれる場合はありますか？

ありますが、設定で対策可能です。

「Suggestions+matching+public+code」という設定を「Blocked」にすることで。
公開されたコードと一致するコードの提案をブロックし、著作権・ライセンス違反のリスクを軽減できます。

一般に、生成AIにおいては著作権侵害のリスクが指摘とそれに加えてオープンソースソフトウェアライセンスの課題があります。<br/>
普段の開発においては、OSSとして公開されているライブラリやフレームワーク単位でライセンスを確認し、そのライセンスに従って利用しています。<br/>
しかし、Copilotによって生成されたコードはそのライセンスを確認することができません。<br/>
そのため、生成されたコードにOSSライセンスが適用されると、ソースコードの公開要求や損害賠償といったリスクがあります。<br/>
そういったリスクを軽減するため、Copilotには「Suggestions matching public code」という設定があります。
GitHub Copilot for Businessでは、この設定を強制することができるため、この設定を事前に行いましょう。

#### Q. プロジェクト内のソースコードはGitHub Copilotの学習に使用されますか？

学習には使用されません。GitHub Copilot for Businessは、サジェストを生成する目的以外ではエディタのソースコードにアクセスしません。サジェストを生成するために使用されたプロンプトは、セキュアな形でモデルに送信されます。提案が生成されると、プロンプトは保持されません。

### 費用について

#### Q. GitHub Copilotを利用する場合の費用の考え方は？

まず、法的リスクに備えるためにもTISでは`GitHub Enterprise`での全社の利用方針とします。その場合にかかる一人当たりの利用料は、以下の2つの合計になります。一人あたり7万弱/年です*1。

- GitHub Enterprise: 年間契約で1人あたり年間231ドル、1ドル=150円の場合に34,650円/年*1
- GitHub Copilot for Business: 1人あたり年間約228ドル。1ドル=150円の場合に34,200円/年

:::note
*1 `GitHub Enterprise`の契約は各社契約ごとに変動ありますので、あくまで参考情報として参照してください。
:::

## その他

その他のセキュリティ・プライバシーの詳細については以下GitHub Copilot公式ページを参照ください。

[GitHub Copilot Trust Center](https://resources.github.com/copilot-trust-center/)

### ライセンス関連のサポートについて

参考：[マイクロソフト、お客様向けの Copilot Copyright Commitment を発表 - News Center Japan](https://news.microsoft.com/ja-jp/2023/09/12/230912-copilot-copyright-commitment-ai-legal-concerns/)

> 第三者がマイクロソフトの Copilot または Copilot が生成する出力結果を使用した法人のお客様を著作権侵害で訴えた場合、お客様が製品に組み込まれたガードレールとコンテンツフィルターを使用しているという条件の下で、マイクロソフトはお客様を弁護し、訴訟の結果生じた不利な判決または和解により課された金額を支払います。
>
> GitHub Copilot も含まれます。