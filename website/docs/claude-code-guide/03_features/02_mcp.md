# MCP

## 概要

Claude Codeの外部ツール連携機能は、Model Context Protocol (MCP) を通じて、Git、テストツール、CI/CDパイプラインなどの外部ツールとシームレスに統合します。これにより、既存の開発ワークフローを中断することなく、AI支援開発を実現できます。

![MCP](../02_basics/images/claude_code_06.png)

## Model Context Protocol（MCP）について

MCP（Model Context Protocol）とは、AIアプリケーションを外部システムに接続するためのプロトコルの一種です。
MCPを使用するとAIアプリケーションは、データソース（ローカル ファイル、データベースなど）／ツール（検索エンジン、計算機など）／ワークフロー（専用のプロンプトなど）に接続して、重要な情報にアクセスし、タスクを実行できるようになります。

Claude Codeでは、このプロトコルを使用して様々な開発ツールと接続してタスクが実行できます。

### MCPの利点

- **標準プロトコル**: 統一されたインターフェースで複数のツールと連携
- **セキュリティ**: 安全な認証と権限管理
- **拡張性**: 新しいツールを簡単に追加可能
- **効率性**: 最適化された通信プロトコル

### MCPアーキテクチャと外部システム

```txt
┌───────────────┐
│    MCPホスト   │
│┌─────────────┐│
││MCPクライアント││
│└─────────────┘│
└───────────────┘
        ↓ MCP(JSON-RPC)
┌───────────────┐
│  MCPサーバー   │
└───────────────┘
        ↓　各ツール固有の接続方法
┌───────────────┐
│  外部システム   │
└───────────────┘
```

- **MCPホスト**: 1つまたは複数のMCPクライアントを調整および管理するAIアプリケーション
  - ここではClaude CodeがMCPホスト
- **MCPクライアント**: MCPサーバへの接続を維持し、MCPホストが使用するためにMCPサーバからコンテキストを取得するコンポーネント
  - ここではClaude CodeのMCP接続機能
- **MCPサーバ**: 各種外部ツールへのアダプターとして機能し、JSON-RPCプロトコルで通信
  - ローカルMCPサーバの場合、ここもClaude Codeが担当
  - リモートMCPサーバの場合は外部のクラウドサービスが提供
- **外部システム**: Git、データベース、各種APIなどの実際のツール・サービス
- **通信プロトコル**: ホストとサーバ間はJSON-RPC、サーバと外部システム間は各ツール固有のプロトコル

### MCPでできること

MCPサーバが接続されると、Claude Codeに以下のようなことを依頼できます。

- **課題トラッカーから機能を実装する**: “JIRA課題ENG-4521で説明されている機能を追加し、GitHubでPRを作成してください。”
- **監視データを分析する**: “SentryとStatsigをチェックして、ENG-4521で説明されている機能の使用状況を確認してください。”
- **データベースをクエリする**: “Postgresデータベースに基づいて、機能ENG-4521を使用したランダムな10人のユーザのメールアドレスを見つけてください。”
- **デザインを統合する**: “Slackへ投稿された新しいFigmaデザインに基づいて、標準のメールテンプレートを更新してください”
- **ワークフローを自動化する**: “新機能についてのフィードバックセッションにこれらの10人のユーザを招待するGmailの下書きを作成してください。“

## MCPサーバの設定

ファイルシステム操作などのMCPサーバはClaude CodeがMCPサーバを起動する「ローカルMCPサーバ」として、クラウドサービスが接続を提供しているMCPサーバは「リモートMCPへの接続」としてMCPサーバを設定します。

その際、ローカル間はstdioのトランスポート方式で、リモートMCPサーバとの間はSSE方式かStreamable HTTP方式での接続になります。将来的にはStreamable HTTP形式がより普及してくるものと想定しています。

### ローカルMCPサーバの設定追加

```bash
# 基本構文
claude mcp add <name> <command> [args...]

# 実際の例: Airtableサーバーを追加
claude mcp add airtable --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

### リモートMCPサーバへの接続設定

#### SSE（Server-Sent Events）サーバの場合

```bash
# 基本構文
claude mcp add --transport sse <name> <url>

# 実際の例: Linearに接続
claude mcp add --transport sse linear https://mcp.linear.app/sse

# 認証ヘッダー付きの例
claude mcp add --transport sse private-api https://api.company.com/mcp \
  --header "X-API-Key: your-key-here"
```

#### Streamable HTTPサーバの場合

```bash
# 基本構文
claude mcp add --transport http <name> <url>

# 実際の例: Notionに接続
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Bearerトークン付きの例
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

#### その他サーバの管理

設定後、これらのコマンドでMCPサーバを管理できます。

```bash
# 設定されたすべてのサーバーをリスト表示
claude mcp list

# 特定のサーバーの詳細を取得
claude mcp get github

# サーバーを削除
claude mcp remove github

# （Claude Code内で）サーバーのステータスを確認
> /mcp
```

## MCPインストールスコープ

MCPサーバの設定は3つのスコープで設定ができ、プロジェクト内でユーザのローカル固有に設定、プロジェクト内で一意に設定、ユーザ内でのみグローバルな設定で保存することができます。

### ローカルスコープ

- ローカルスコープのサーバはプロジェクト固有かつユーザ固有の設定に保存されます
- claude mcp add操作のデフォルトはローカルスコープです
- 用途：個人的な開発サーバ、実験的な設定、または共有すべきでない機密の認証情報を含むサーバなど

```bash
# ローカルスコープのサーバーを追加（デフォルト）
claude mcp add my-private-server /path/to/server

# 明示的にローカルスコープを指定する場合
claude mcp add my-private-server --scope local /path/to/server
```

### プロジェクトスコープ

- プロジェクトスコープのサーバは、プロジェクトのルートディレクトリ内の`.mcp.json`ファイルに設定し、リポジトリで共有することで、チームメンバーが同じMCPツールとサービスにアクセスできます
- 用途：チーム共有サーバ、プロジェクト固有のツール、またはコラボレーションに必要なサービス

```bash
# プロジェクトスコープのサーバーを追加
claude mcp add shared-server --scope project /path/to/server
```

### ユーザスコープ

- ユーザスコープのサーバは、プロジェクト関係なくユーザアカウント内のすべてのプロジェクトで利用可能です
- 用途：個人的なユーティリティサーバ、開発ツール、または異なるプロジェクト間で頻繁に使用するサービス

```bash
# ユーザーサーバーを追加
claude mcp add my-user-server --scope user /path/to/server
```

サーバごとに適切なスコープを設定して利用してください。

### 優先順位

同じ名前のサーバが複数のスコープに存在する場合、以下の順序の優先順位で設定が利用されます。これにより、プロジェクト共有設定を書き換えずに、一時的にローカルスコープに同名のサーバ名で別の設定を使うことが可能です。

1. ローカルスコープ
1. プロジェクトスコープ
1. ユーザスコープ

## 実際にMCPサーバを設定してみる

それでは最後に、いくつか便利なMCPを実際にさまざまなスコープで設定してみて、その利便性を確認してみましょう。

### Playwright MCPサーバ

<!-- textlint-disable ja-technical-writing/max-ten -->
[**Playwright**](https://playwright.dev/) は、Microsoftが開発したWebテストの自動化ツールです。Webアプリに対するテスト内容と、どういう結果ならOKかをテストシナリオとして事前に定義することで、シナリオをコードとして自動で実行します。テストシナリオを事前にすべてコードで定義する必要がありますが、MCPサーバとして利用すれば、自然言語でテスト内容を指示するだけで、テストシナリオコードを常時メンテナンスし続けなくても、オンデマンドで実行したいテストを自動実行させることができます。
<!-- textlint-enable ja-technical-writing/max-ten -->

```bash
# Playwright MCPをプロジェクトスコープでインストールする
claude mcp add playwright npx @playwright/mcp@latest --scope project
```

リポジトリルートに `.mcp.json` ができ、以下の設定を追加していることが確認できます。

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ],
      "env": {}
    }
  }

```

「今作成した機能をWebテストして」などと指示をして自動テストを実施してみましょう。

### AWSドキュメントMCPサーバ

AWSドキュメントMCPサーバはAWSドキュメントにアクセスし、コンテンツを検索し、推奨事項を取得するためのツールです。AWSドキュメントを読んだり、検索したり、利用可能なサービスのリストを取得したりできます。

このAWSドキュメントMCPサーバは今後他のプロジェクトでも自分のために活用することを想定して、「ユーザスコープ」でインストールしてみましょう。

以下のコマンドでユーザスコープ `~/.claude.json` に設定が追加されます。

```bash
# AWSドキュメントMCPサーバーをユーザースコープでインストール
claude mcp add-json "awslabs-aws-documentation-mcp-server" '{"command":"uvx","args":["awslabs.aws-documentation-mcp-server@latest"],"env":{"FASTMCP_LOG_LEVEL":"ERROR","AWS_DOCUMENTATION_PARTITION":"aws"},"disabled":false,"autoApprove":[]}' --scope user
```

あるいは直接 `~/.claude.json` に以下の記述を追記してもOKです。

```json
  "mcpServers": {
    "awslabs-aws-documentation-mcp-server": {
      "command": "uvx",
      "args": [
        "awslabs.aws-documentation-mcp-server@latest"
      ],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR",
        "AWS_DOCUMENTATION_PARTITION": "aws"
      }
    }
  }
```

これにより、「S3バケットの命名ルールに関するドキュメントを参照してください。ソースを引用してください」のように聞くことで、該当のコンテンツを取得してソースを引用表示してくれるはずです。
