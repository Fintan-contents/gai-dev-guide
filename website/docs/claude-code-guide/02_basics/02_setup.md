# セットアップガイド

## 概要

このガイドでは、Claude Codeを使用するための開発環境を段階的に構築します。

:::note INFO
ローカル環境と、Dev Container環境でClaude Codeをセットアップします。ローカル環境だけで利用する場合にはDev Container環境の設定は不要ですが、Claude Codeによる破壊的な変更が発生してもローカル環境を安全に保全できるDev Container環境についてもひととおり理解しておくことを強く推奨します。
:::

## 1. Claude Codeのセットアップ

### Claude Codeをインストールする

**NPMインストール ※[Node.js 18以降がインストールされている](https://nodejs.org/en/download/)場合:**

```bash
npm install -g @anthropic-ai/claude-code
```

### Claude Codeにログインする

ここではAmazon Bedrockによる認証方法を記載します。この方法でClaudeモデルへのアクセスを設定してください。

#### Amazon Bedrockによる認証

Amazon Bedrockの提供するClaudeモデルにアクセスするようにセットアップするためには、以下の前提条件が必要になります。

##### Amazon BedrockでClaude Codeを設定するための前提事項

- Bedrockアクセスが有効になっているAWSアカウント
- Bedrockで希望するClaudeモデル（例：Claude Sonnet 4）へのアクセス
- AWS CLIがインストールされ設定されている（オプション - 認証情報を取得する他の仕組みがない場合のみ必要）
- 適切なIAM権限

##### AWSアカウントのセットアップ

まず、AWSアカウントで必要なClaudeモデルへのアクセスがあることを確認してください。

1. Amazon Bedrockコンソールに移動
1. 左側のナビゲーションでModel accessに移動
1. 希望するClaudeモデル（例：Claude Sonnet 4）へのアクセスをリクエスト
1. 承認を待つ（ほとんどのリージョンで通常は即座）

:::note INFO
日本国内での利用を想定するため、モデルアクセスは`ap-northeast-1`リージョンで有効である必要がある点に注意してください。
:::

##### 端末側のAWS認証情報の設定

Claude CodeはデフォルトのAWS SDK認証情報チェーンを使用します。以下のいずれかの方法で認証情報を設定してください。

:::note
他にも、SSOプロファイルの利用や[Bedrock APIキーの利用](https://aws.amazon.com/blogs/machine-learning/accelerate-ai-development-with-amazon-bedrock-api-keys/)といった手段もあります。詳細については公式ドキュメントをご参照ください。
:::

- オプションA: AWS CLI設定

    ```bash
    aws configure
    ```

- オプションB: 環境変数（アクセスキー）

    ```bash
    export AWS_ACCESS_KEY_ID=your-access-key-id
    export AWS_SECRET_ACCESS_KEY=your-secret-access-key
    export AWS_SESSION_TOKEN=your-session-token
    ```

#### Claude Codeを設定する

Bedrockを有効にするため、以下の環境変数を設定してください。

```bash
# Bedrock統合を有効にする
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=ap-northeast-1
```

さらに、デフォルトでモデルがUSリージョンのモデルが設定されているため、東京リージョンを含むAPACのクロスリージョン推論モデルを利用する場合、推論プロファイルIDかアプリケーション推論プロファイルを指定してください。

```bash
# 推論プロファイルIDを使用
export ANTHROPIC_MODEL='jp.anthropic.claude-sonnet-4-5-20250929-v1:0'
export ANTHROPIC_SMALL_FAST_MODEL='apac.anthropic.claude-3-haiku-20240307-v1:0'

# アプリケーション推論プロファイルARNを使用
export ANTHROPIC_MODEL='arn:aws:bedrock:ap-northeast-1:your-account-id:application-inference-profile/your-model-id'

# オプション: 必要に応じてプロンプトキャッシュを無効にする
export DISABLE_PROMPT_CACHING=1
```

<!-- markdownlint-disable-next-line MD024 -->
#### 動作確認

これでClaude CodeへのアクセスをBedrock経由に設定することができました。`claude`コマンドを実行し、Bedrock経由でClaudeモデルにアクセスすることができることを確認してください。

```bash
/status
```

:::note INFO
東京リージョンではClaude 4 Opusが提供されていないことにより、エラーになる可能性があります。モデルの指定コマンドを実行して、適切なアプリケーション推論プロファイル（Claude 4 Sonnet）を選択し直すことで実行可能になります。

```bash
/model
```

:::

最終確認です。最終的に環境変数は以下のように設定されているはずです。

```bash
# Bedrock統合を有効にする
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=ap-northeast-1

# 推論プロファイルIDを使用
export ANTHROPIC_MODEL='jp.anthropic.claude-sonnet-4-5-20250929-v1:0'
export ANTHROPIC_SMALL_FAST_MODEL='apac.anthropic.claude-3-haiku-20240307-v1:0'

# アプリケーション推論プロファイルARNを使用
export ANTHROPIC_MODEL='arn:aws:bedrock:ap-northeast-1:your-account-id:application-inference-profile/your-model-id'

# オプション: 必要に応じてプロンプトキャッシュを無効にする
export DISABLE_PROMPT_CACHING=1
```

:::note INFO
Bedrockを使用する場合、認証はAWS認証情報を通じて処理されるため、/loginと/logoutコマンドは無効になります。
:::

## 2. 基本ソフトウェアのインストール

ここまでのセットアップで、ターミナル上でClaude Codeを使う準備はできています。ここからはIDEに統合してClaude Codeを使うことで、いくつかさらに利便性を上げる設定を追加できます。本ガイドではこれ以降Claude CodeをIDEに統合して利用する方法を基本的な使い方として解説します。

### Visual Studio Code

Claude CodeをIDE統合して利用するために、まずはVS Codeをインストールします。

**インストール方法:**
1. [Visual Studio Code公式サイト](https://code.visualstudio.com/)にアクセスする
2. お使いのOS（Windows、macOS、Linux）に対応したインストーラーをダウンロードする
3. ダウンロードしたインストーラーを実行してインストールする

**動作確認:**

```bash
# インストール確認
code --version
```

### Dockerのインストール

Dev Containerに接続して安全に利用するために、ローカルのDocker環境を準備します。

**Windows:**

:::warning ライセンスに関する注意
Docker Desktop for Windowsは、一定規模以上の企業での商用利用時に有償ライセンスが必要になる場合があります。詳細は[Docker社の公式サブスクリプションページ](https://www.docker.com/pricing/)をご確認ください。企業での利用を検討する場合は、ライセンス規約の確認を推奨します。
:::

**オプションA: Docker Desktop（有償ライセンスが必要なケース有）**

1. [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)をダウンロードする
2. インストーラーを実行する
3. WSL2バックエンドを有効化する

**オプションB: WSL2 + Docker CE（無償だが、セットアップがやや複雑）**

この方法は無償で商用利用可能です。

1. [Microsoft公式ドキュメント](https://learn.microsoft.com/ja-jp/windows/wsl/install)に従ってWSL2をインストールする
2. [Docker公式ドキュメント](https://docs.docker.com/engine/install/ubuntu/)に従って、WSL2内のUbuntu上にDocker CEをインストールする

**macOS:**
1. [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)をダウンロードする
2. インストーラーを実行する

## 3. VS Code拡張機能のインストール

### 拡張機能のインストール

VS Codeを起動し、以下の拡張機能をインストールしてください。

1. **Claude Code** (anthropic.claude-code)
    - Windows: Ctrl+Shift+X → "Claude Code" で検索 → インストール
    - macOS: ⌘+Shift+X → "Claude Code" で検索 → インストール
2. **Docker** (ms-azuretools.vscode-Docker)
    - Windows: Ctrl+Shift+X → "Docker" で検索 → インストール
    - macOS: ⌘+Shift+X → "Docker" で検索 → インストール
3. **Dev Containers** (ms-vscode-remote.remote-containers)
    - Windows: Ctrl+Shift+X → "Dev Containers" で検索 → インストール
    - macOS: ⌘+Shift+X → "Dev Containers" で検索 → インストール

これらの拡張機能を有効化することで、Claude CodeのIDE統合や、DevContainer環境内で安全にClaude Codeを実行できるようになります。

## 4. 最初のプロジェクトのセットアップ

GitHubやGitLabのリモートリポジトリを作成し、ローカルにクローンして最初のリポジトリを作成しましょう。

## 5. (オプション) Dev Containerの設定

最後に、ローカルでClaude Codeを使うよりも安全なDev Container環境をセットアップしましょう。

:::note INFO
この操作は任意です。
:::

### 基本構成

Anthropic社が公式に提供している[devcontainer feature](https://github.com/anthropics/devcontainer-features)を利用することで、簡単にClaude CodeをDev Container環境に導入できます。

プロジェクトルートに`.devcontainer/devcontainer.json`を作成し、以下の最小構成から始めることができます。

**最小構成のdevcontainer.json例:**

```json
{
  "name": "Claude Code Project",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/anthropics/devcontainer-features/claude-code:1": {}
  }
}
```

### セキュリティ強化

Claude Codeは強力なAIエージェントであるため、意図しない外部通信や破壊的な変更を防ぐためのセキュリティ対策が重要です。

Anthropic社は、[公式リポジトリの.devcontainerディレクトリ](https://github.com/anthropics/claude-code/tree/main/.devcontainer)で以下のセキュリティ機能を加えた実装を公開しています:

- **iptablesによるファイアウォール設定**: 許可リストベースで必要なサービス（GitHub、npm、Bedrock等）のみ外部通信を許可

:::note INFO
企業環境や機密プロジェクトでClaude Codeを利用する場合は、上記の公式実装を参考にセキュリティ強化を検討しても良いでしょう。
:::

### カスタマイズのポイント

プロジェクトの要件に応じて、以下のような調整が必要になる場合があります:

- **言語やフレームワーク固有のツール**: Node.js、Python、Java等のランタイムやパッケージマネージャー
- **追加の開発ツール**: linter、formatter、テストフレームワーク等
- **プロジェクト固有の依存関係**: データベースクライアント、クラウドのCLI等

これらは`features`セクションや`postCreateCommand`等で追加できます。詳細は[Dev Containers公式ドキュメント](https://containers.dev/)をご参照ください。

### DevContainer環境の起動

1. VS Codeでプロジェクトフォルダを開く
2. `Ctrl+Shift+P` → "Dev Containers: Rebuild Container（開発コンテナー: コンテナーのリビルド）"
3. 初回起動時はイメージのビルドに時間がかかります

<!-- markdownlint-disable-next-line MD024 -->
### 動作確認

DevContainer環境が起動したら、以下を確認してください。

#### Claude Codeの動作確認

[1. Claude Codeのセットアップ ＞ Claude Codeにログインする](#claude-codeにログインする)を実施してください。実施後、ターミナル上で`claude`を実行するとClaude Codeが起動します。
