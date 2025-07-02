---
sidebar_position: 3
---

# 技術スタック

プロジェクトで使用する技術スタック（プログラミング言語、フレームワーク、ライブラリなど）をAIに伝えましょう。  
あらかじめプロジェクトの技術スタックを明示しておくことで、AIはそれを前提としたコードを生成しようとします。これにより、環境に合わないコードや、利用していないライブラリを使ったコードが生成されるのを防ぎ、手戻りを減らすことができます。

以下は、プロジェクトの技術スタックに関する[インストラクションファイル](../../shared-instructions-prompts)の記述例です。

```markdown
---
applyTo: "**"
---

# 技術スタック

このプロジェクトでは以下の技術スタックを採用しています。コード生成の際は、これらのバージョンやライブラリの利用を前提としてください。

- 言語
  - Java 21
- フレームワーク
  - Spring Boot 3.4
- 認証・認可
  - Spring Security 6.3
- データベースアクセスライブラリ
  - MyBatis 3
- ロギングライブラリ
  - SLF4J
  - Logback
- テスティングフレームワーク
  - Spring Test
  - JUnit 5
  - AssertJ
  - Database Rider
- ビルドツール
  - Apache Maven 3.9
- 自動生成ツール
  - MyBatis Generator 1.4
- アプリケーションサーバ
  - Apache Tomcat 10.1（組込）
- データベース
  - PostgreSQL 17
- コンテナ
  - Docker
```

このようなインストラクションファイルを、`.github/instructions/technology-stack.instructions.md`のようなファイル名で作成します。これにより、GitHub Copilotはプロジェクトの技術的な制約を理解した上で、開発をサポートしてくれるようになります。
