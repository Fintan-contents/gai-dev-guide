# 機能概要

ここまでClaude Codeを動かして基本的な操作に慣れてきました。この章ではよりよくClaude Codeを活用するために、こまかい機能をひとつひとつ理解して、便利な機能を活用できるようになりましょう。
公式マニュアルのうち、必ず知っておくべき内容をわかりやすく抜粋してありますが、さらに詳細を知りたい場合は[公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/overview)を参照してください。

## Claude Code設定

### 設定ファイル (`settings.json`)

設定ファイル（`settings.json`）は、階層的な設定を通じてClaude Codeを設定するための仕組みです。

- ユーザ設定
  - 場所： `~/.claude/settings.json`
  - ユーザ設定はすべてのプロジェクトに適用される個人のグローバル設定ファイルです

- プロジェクト設定
  - 場所： `.claude/settings.json`
  - プロジェクトで共有する設定です、チェックイン対象

- プロジェクト設定（ローカル）
  - 場所： `.claude/settings.local.json`
  - ローカルのみで有効な設定。Claude Code起動時に `.gitignore` へ追加されますが、必要があれば除外対象に追加してください

- エンタープライズ管理ポリシー設定（`managed-settings.json`）
  - 場所： 詳細は[公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/settings)参照
  - MDMを用いて配布が可能なファイル

#### 設定の優先順位

以下の優先順位で適用されます。設定はマージされ、より具体的な設定がより広範な設定に追加またはオーバーライドします。上位の設定は下位の設定をオーバーライドします。

1. エンタープライズ管理ポリシー設定
1. コマンドライン引数
1. ローカルプロジェクト設定 (`.claude/settings.local.json`)
1. 共有プロジェクト設定 (`.claude/settings.json`)
1. ユーザ設定 (`~/.claude/settings.json`)

#### 利用可能な設定

`settings.json`は多数のオプションをサポートしています。
ここでは代表的な設定のみ解説します、詳細は[公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/settings#%E5%88%A9%E7%94%A8%E5%8F%AF%E8%83%BD%E3%81%AA%E8%A8%AD%E5%AE%9A)を参照してください。

| キー | 説明 | 例 |
| ---- | ---- | ---- |
| `env` | すべてのセッションに適用される環境変数 | `{"FOO": "bar"}` |
| `permissions` | 権限の構造については下記の表参照 |  |
| `hooks` | ツール実行の前後に実行するコマンドを設定します。[フック](./05_hooks.md)を参照 | `{"PreToolUse": {"Bash": "echo 'Running command...'"}}` |
| `model` | Claude Codeで使用するデフォルトモデルをオーバーライドします | `"claude-3-5-sonnet-20241022"` |

#### 権限設定

権限設定（[公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/settings#%E6%A8%A9%E9%99%90%E8%A8%AD%E5%AE%9A)）およびアイデンティティとアクセス管理（[公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/iam)）を参照ください。

#### 現在の設定の確認

現在反映されている設定は `/config` スラッシュコマンドで確認できます。

```bash
> /config

╭────────────────────────────────────────────────────────────────────────────────╮
│ Settings                                                                       │
│ Configure Claude Code preferences                                              │
│                                                                                │
│ ❯ Auto-compact                              true                               │
│                                                                                │
│   Use todo list                             true                               │
│                                                                                │
│   Verbose output                            false                              │
│                                                                                │
│   Auto-updates                              true                               │
│                                                                                │
│   Theme                                     Dark mode (colorblind-friendly)    │
│                                                                                │
│   Notifications                             Auto                               │
│                                                                                │
│   Output style                              default                            │
│                                                                                │
│   Editor mode                               normal                             │
│                                                                                │
│   Model                                     Default (recommended)              │
│                                                                                │
│   Diff tool                                 auto                               │
│                                                                                │
│   Auto-connect to IDE (external terminal)   true                               │
│                                                                                │
╰────────────────────────────────────────────────────────────────────────────────╯
```

ここで編集した設定はプロジェクト設定（`.claude/settings.json`）に保存されます。

### メモリファイル (`CLAUDE.md`)

メモリファイル（`CLAUDE.md`）は、スタイルガイドラインやワークフローの一般的なコマンドなど、セッション間でユーザの指示を記憶することができます。

- ユーザメモリ
  - 場所： `~/.claude/CLAUDE.md`
  - ユーザ設定はすべてのプロジェクトに適用される個人のグローバル設定ファイルです。コードスタイリング設定、個人ツールのショートカットなどの記憶に使えます

- プロジェクトメモリ
  - 場所： `./CLAUDE.md` or `./.claude/CLAUDE.md`
  - プロジェクトで共有する指示の記憶です、チェックイン対象。プロジェクトアーキテクチャ、コーディング標準、一般的なワークフローなどの指示の記憶に使えます

- プロジェクトメモリ（ローカル）
  - 場所： `./CLAUDE.local.md`
  - ローカルのみで有効な記憶です。個人のプロジェクト固有設定に使えますが、チェックイン対象にならないように `.gitignore`に追加しておく必要があります。ただしCLAUDE.mdにはインポート機構が使えるため、個人設定はプロジェクト外で管理しインポートして利用することが推奨されています

すべてのメモリファイルは、Claude Code起動時に自動的にコンテキストに読み込まれます。

#### CLAUDE.mdのインポート機構

CLAUDE.mdファイル内で `@path/to/import` 構文を使用して追加ファイルをインポートできます。

```md
プロジェクト概要については@READMEを、このプロジェクトで利用可能なnpmコマンドについては@package.jsonを参照してください。

# 追加指示
- gitワークフロー @docs/git-instructions.md
```

このファイルではインポート機構で3ファイルが読み込まれます。

この機構を利用してユーザのホームディレクトリからCLAUDE.local.md相当のファイルを読み込む方法が現在は推奨されています。

```md
# 個人設定
- @~/.claude/my-project-instructions.md
```

また、潜在的な衝突を避けるため、markdownコードスパンとコードブロック内ではインポートは評価されないことにも注意が必要です。

```md
このコードスパンはインポートとして扱われません：`@anthropic-ai/claude-code`
```

インポートされたファイルは追加ファイルを再帰的にインポートでき、最大深度は5ホップです。/memoryコマンドはメモリファイル編集用のスラッシュコマンドですが、どのメモリファイルが読み込まれているかを確認するのにも役立ちます。

以下は`.claude/CLAUDE.md`ファイルが存在するプロジェクトで/memoryコマンドを実行した例です。User memoryとProject memoryはファイルの有無に関係なく必ず表示されます。

```bash
> /memory 

╭──────────────────────────────────────────────────────────────────╮
│                                                                  │
│ Select memory to edit:                                           │
│                                                                  │
│  ❯ 1. .claude/CLAUDE.md                                          │
│    2. User memory         Saved in ~/.claude/CLAUDE.md           │
│    3. Project memory      Checked in at ./CLAUDE.md              │
│                                                                  │
╰──────────────────────────────────────────────────────────────────╯

```

#### CLAUDE.mdの再帰的読み込み

Claude Codeはメモリを再帰的に読み取ります。cwdから開始して、Claude Codeはプロジェクトのルートディレクトリまで再帰し、見つけたCLAUDE.mdまたはCLAUDE.local.mdファイルを読み取ります。これは、foo/bar/ でClaude Codeを実行し、foo/CLAUDE.mdとfoo/bar/CLAUDE.mdの両方にメモリがある大きなリポジトリで作業する際に特に便利です。

Claudeは現在の作業ディレクトリ下のサブツリーにネストされたCLAUDE.mdも発見します。起動時の読み込みは行わず、Claudeがそれらのサブツリー内のファイルを読み取る際にのみ読み込まれます。

#### `#` ショートカットでメモリを追加する

入力を `#` 文字で開始すると、これを保存するメモリファイルを選択するように求められ、素早くメモリを追加できます。

```md
> # 常に説明的な変数名を使用する
```

#### `/memory` でメモリを直接編集

Claude Codeセッション中に `/memory` スラッシュコマンドを使用すると、システムエディタが起動して当該メモリファイルを開きます。

```bash
> /memory
```

#### `/init` でプロジェクトメモリをブートストラップ

プロジェクトメモリをすばやく作成するときに利用します。

```bash
> /init
```

プロジェクトが進んだ状態で使用すると、予期せぬ破壊的な変更を起こす可能性があるため、注意が必要です。

### サブエージェント設定

Claude Codeは、ユーザレベルとプロジェクトレベルの両方で設定できるカスタムAIサブエージェントをサポートしています。これらのサブエージェントは、YAMLフロントマターを持つMarkdownファイルとして保存されます。

- **ユーザサブエージェント**：`~/.claude/agents/` - すべてのプロジェクトで利用可能
- **プロジェクトサブエージェント**：`.claude/agents/` - プロジェクト固有でチームと共有可能

サブエージェントファイルは、カスタムプロンプトとツール権限を持つ専門のAIアシスタントを定義します。サブエージェントの作成と使用について詳しくは、[**サブエージェント**](./03_subagents.md)をご覧ください。

### 環境変数

すべての環境変数は設定ファイル（`settings.json`）でも設定可能です。
詳細は[公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/settings#%E7%92%B0%E5%A2%83%E5%A4%89%E6%95%B0)を参照してください。

## モデル設定

設定で確認したとおり、Claude Codeには`model`設定があります。

```bash
> /config
```

また、現在のモデルの確認は以下のコマンドでも可能です。

```bash
> /status (アカウント情報も表示されます)
```

モデル設定には以下のいずれかを設定できます。

- モデルエイリアス
- 完全な**モデル名**
- Bedrockの場合、ARN

### モデル

Amazon Bedrockを利用している場合は[セットアップ](../02_basics/02_setup.md)で指定したモデルが表示されています。

プライマリモデル、小型/高速モデルともに最新のモデルを指定して利用したい場合は設定を変更して利用してください。ただし、USリージョンと東京を含むAPACリージョンではモデルの提供状況に違いがあるため、注意が必要です。

## スラッシュコマンド

Claude Codeのインタラクティブセッション中にスラッシュコマンドで動作を制御します。

### 組み込みスラッシュコマンド

以下によく使うスラッシュコマンドを記載します。

| キー | 説明 |
| ---- | ---- |
| `/add-dir` | 追加の作業ディレクトリを追加 |
| `/agents` | 専門的なタスク用のカスタムAIサブエージェントを管理 |
| `/clear` | 会話履歴をクリア |
| `/compact [instructions]` | オプションのフォーカス指示で会話を圧縮 |
| `/config` | 設定を表示/変更 |
| `/doctor` | Claude Codeインストールの健全性をチェック |
| `/help` | 使用方法のヘルプを取得 |
| `/init` | CLAUDE.mdガイドでプロジェクトを初期化 |
| `/mcp` | MCPサーバ接続とOAuth認証を管理 |
| `/memory` | CLAUDE.mdメモリファイルを編集 |
| `/model` | AIモデルを選択または変更 |
| `/permissions` | 権限を表示または更新 |
| `/status` | アカウントとシステムのステータスを表示 |

完全なスラッシュコマンド一覧は[公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/slash-commands#%E7%B5%84%E3%81%BF%E8%BE%BC%E3%81%BF%E3%82%B9%E3%83%A9%E3%83%83%E3%82%B7%E3%83%A5%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89)を参照してください。

### カスタムスラッシュコマンド

カスタムスラッシュコマンドを使用すると、Claude Codeが実行できるMarkdownファイルとして頻繁に使用するプロンプトを定義できます。コマンドはスコープ（プロジェクト固有または個人）で整理され、ディレクトリ構造を通じて名前空間をサポートします。

#### 構文

カスタムスラッシュコマンドは `<command-name>.md` でコマンド作成ができ、オプション引数を入力に利用できるカスタムコマンドです。

```bash
> /<command-name> [arguments]
```

#### コマンドタイプ

##### プロジェクトコマンド

- 場所： `.claude/commands/`
- リポジトリに保存され、チームと共有されるコマンド。`/help`でリストされる際、これらのコマンドは説明の後に「(project)」を表示します

コマンドの作成方法は以下の通りです。

```bash
# プロジェクトコマンドを作成
mkdir -p .claude/commands
echo "このコードのパフォーマンス問題を分析し、最適化を提案してください:" > .claude/commands/optimize.md
```

##### 個人コマンド

- 場所： `~/.claude/commands/`
- 個人のグローバルで利用可能なコマンド。`/help`でリストされる際、これらのコマンドは説明の後に「(user)」を表示します

コマンドの作成方法は以下の通りです。

```bash
# 個人コマンドを作成
mkdir -p ~/.claude/commands
echo "このコードのセキュリティ上の脆弱性を確認してください:" > ~/.claude/commands/security-review.md
```

#### 機能

##### 名前空間

コマンドは各 `commands`配下のサブディレクトリに整理できます。コマンド名はどのサブディレクトリに格納されていてもファイル名のままで利用できます。

##### 引数

スラッシュコマンドに渡された `$ARGUMENTS` ですべての引数をキャプチャします。

```bash
# コマンド定義
echo 'Fix issue #$ARGUMENTS following our coding standards' > .claude/commands/fix-issue.md

# 使用方法
> /fix-issue 123 high-priority
# $ARGUMENTSは「123 high-priority」になります
```

位置パラメータを使用して特定の引数に個別にアクセスします（シェルスクリプトと同様）

```bash
# コマンド定義  
echo 'Review PR #$1 with priority $2 and assign to $3' > .claude/commands/review-pr.md

# 使用方法
> /review-pr 456 high alice
# $1は「456」、$2は「high」、$3は「alice」になります
```

##### Bashコマンド実行

`!` プレフィクスを使用して、スラッシュコマンドが実行される前にbashコマンドを実行します。

```md
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

##### ファイル参照

`@`プレフィックスを使用してファイルを参照し、コマンドにファイル内容を含めます。

```md
# 特定のファイルを参照

Review the implementation in @src/utils/helpers.js

# 複数のファイルを参照

Compare @src/old-version.js with @src/new-version.js
```

その他 `フロントマター` や `MCPスラッシュコマンド` が利用できます。詳細は[公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/slash-commands#%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%83%9E%E3%82%BF%E3%83%BC)を参照してください。

## 安全性、セキュリティ

Claude Codeの安全性の詳細については、[Anthropic Trust Center](https://trust.anthropic.com/)を参照ください。

ライセンスはAmazon Bedrock経由のアクセスの場合も、Anthropic社の商用利用規約が適用される点に注意が必要です。

## 出力スタイル

出力スタイルを指定すると、コード生成やソフトウェアエンジニアリングの完了のために効率的な出力として調整されているデフォルトのシステムプロンプトを直接変更することができます。

`/output-style` を実行してメニューから出力スタイルを選択します。（`/config` メニューからもアクセス可能）

## トラブルシューティング

Claude Codeのインストールと使用に関する一般的な問題の解決策は[公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/troubleshooting)を参照してください。
