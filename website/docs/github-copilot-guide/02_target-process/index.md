---
sidebar_position: 2
---

# 対象工程と開発プロセス

本ガイドではGitHub Copilotを主に製造および単体テスト工程で活用することを想定しています。  
ここでは、GitHub Copilotの適用工程と従来の開発プロセスからの変化、今後のAgent Modeが安定版となった際に想定される開発プロセスを記載しています。

## 従来の開発プロセス

生成AIが活用されるようになるまでは、以下の図のように各工程におけるソースコードおよびテストコード等の作成やレビューなど、すべての作業を人が実施していました。

![生成AI活用以前の開発プロセス](images/development-process-asis.png)

## GitHub Copilot導入後

GitHub Copilot Chatおよび本ガイドを活用することで、製造や単体テスト工程で生産性の向上を目指します。

GitHub Copilot ChatのAgent Modeを利用すると、GitHub Copilotに指示した後はある程度自律的に動作することを期待して作業を任せられます。  
たとえばAgent ModeのGitHub Copilot Chatに機能開発を依頼すると、ソースコードからテストコードの作成、テスト実行といった定めたプロセスで作業を実施させることができます。  
また開発ルールや静的解析などで修正内容に問題があることを検出できる仕組みを構築しておくと、GitHub Copilot自身に問題を認識させ、自己修復させることも可能です。

![GitHub Copilot導入後の開発プロセス](images/development-process-tobe.png)

この進め方の場合の作業の主体はGitHub Copilotとなりますが、成果物の正しさ・妥当性は人が責任をもって確認・レビューする必要があります。  
もちろんGitHub Copilotからレビューや確認のサポートを得ることはできますが、最終的な責任を持つのは人になります。
