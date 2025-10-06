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

:::note INFO
いずれのオプションも選択可能な場合は、より単一目的に利用可能な`オプションD：Bedrock APIキー`の利用を推奨します。
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

- オプションC: 環境変数（SSOプロファイル）

    ```bash
    aws sso login --profile=<your-profile-name>

    export AWS_PROFILE=your-profile-name
    ```

- オプションD: Bedrock APIキー

    ```bash
    export AWS_BEARER_TOKEN_BEDROCK=your-bedrock-api-key
    ```

Bedrock APIキーは、完全なAWS認証情報を必要とせずに、よりシンプルな認証方法を提供します。[Bedrock APIキーについて詳しく学ぶ。](https://aws.amazon.com/blogs/machine-learning/accelerate-ai-development-with-amazon-bedrock-api-keys/)

:::note INFO
APIキーは最大12時間有効な「Short-term API keys」と、それ以上（最大365日あるいは無期限）設定できる「Long-term API keys」の2種類から選択が可能です。
:::

**Claude Codeを設定する**
Bedrockを有効にするため、以下の環境変数を設定してください。

```bash
# Bedrock統合を有効にする
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=ap-northeast-1
```

さらに、デフォルトでモデルがUSリージョンのモデルが設定されているため、東京リージョンを含むAPACのクロスリージョン推論モデルを利用する場合、推論プロファイルIDかアプリケーション推論プロファイルを指定してください。

```bash
# 推論プロファイルIDを使用
export ANTHROPIC_MODEL='apac.anthropic.claude-sonnet-4-20250514-v1:0'
export ANTHROPIC_SMALL_FAST_MODEL='apac.anthropic.claude-3-haiku-20240307-v1:0'

# アプリケーション推論プロファイルARNを使用
export ANTHROPIC_MODEL='arn:aws:bedrock:ap-northeast-1:your-account-id:application-inference-profile/your-model-id'

# オプション: 必要に応じてプロンプトキャッシュを無効にする
export DISABLE_PROMPT_CACHING=1
```

これでClaude CodeへのアクセスをBedrock経由に設定することができました。`claude`コマンドを実行し、Bedrock経由でClaudeモデルにアクセスすることができることを確認してください。

```bash
/status
```

:::note INFO
また、東京リージョンではClaude 4 Opusが提供されていないことにより、エラーになる可能性があります。モデルの指定コマンドを実行して、適切なアプリケーション推論プロファイル（Claude 4 Sonnet）を選択し直すことで実行可能になります。

```bash
/model
```

:::

最終確認です。オプションDのBedrock APIキーで設定した場合、最終的に環境変数は以下のように設定されているはずです。

```bash
# Bedrock統合を有効にする
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=ap-northeast-1
export AWS_BEARER_TOKEN_BEDROCK=your-bedrock-api-key

# 推論プロファイルIDを使用
export ANTHROPIC_MODEL='apac.anthropic.claude-sonnet-4-20250514-v1:0'
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

Claude CodeをIDE統合して利用するために、まずはVS Codeのインストールします。

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

Devcontainerに接続して安全に利用するために、ローカルのDocker環境を準備します。

**Windows:**
1. [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)をダウンロードする
2. インストーラーを実行する
3. WSL2バックエンドを有効化する

**macOS:**
1. [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)をダウンロードする
2. インストーラーを実行する

**Linux:**

```bash
# Ubuntu/Debianの場合
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# インストール確認
docker --version
docker-compose --version
```

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

これらの拡張機能を有効化することで、Claude CodeのIDE統合や、Devcontainer環境内で安全にClaude Codeを実行できるようになります。

## 4. 最初のプロジェクトのセットアップ

GitHubやGitLabのリモートリポジトリを作成し、ローカルにクローンして最初のリポジトリを作成しましょう。

## 5. (オプション) Dev Containerの設定

最後に、ローカルでClaude Codeを使うよりも安全なDev Container環境をセットアップしましょう。

:::note INFO
この操作は任意です。
:::

### DevContainer設定

プロジェクトルートに以下の`.devcontainer/`構成を配置するか、[Claude Code公式リポジトリ](https://github.com/anthropics/claude-code)の`.devcontainer`フォルダをリポジトリ内にコピーしてください。

:::note INFO
`.devcontainer`は個々人で管理する前提となるため `.gitignore`対象にしてください。
:::

```text
.devcontainer/
├── devcontainer.json
├── Dockerfile
└── init-firewall.sh
```

**Dockerfile例:**

```dockerfile
FROM node:20

ARG TZ
ENV TZ="$TZ"

ARG CLAUDE_CODE_VERSION=latest

# Install basic development tools and iptables/ipset
RUN apt-get update && apt-get install -y --no-install-recommends \
  less \
  git \
  procps \
  sudo \
  fzf \
  zsh \
  man-db \
  unzip \
  gnupg2 \
  gh \
  iptables \
  ipset \
  iproute2 \
  dnsutils \
  aggregate \
  jq \
  nano \
  vim \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Ensure default node user has access to /usr/local/share
RUN mkdir -p /usr/local/share/npm-global && \
  chown -R node:node /usr/local/share

ARG USERNAME=node

# Persist bash history.
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Create workspace and config directories and set permissions
RUN mkdir -p /workspace /home/node/.claude && \
  chown -R node:node /workspace /home/node/.claude

WORKDIR /workspace

ARG GIT_DELTA_VERSION=0.18.2
RUN ARCH=$(dpkg --print-architecture) && \
  wget "https://github.com/dandavison/delta/releases/download/${GIT_DELTA_VERSION}/git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  sudo dpkg -i "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  rm "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb"

# Set up non-root user
USER node

# Install global packages
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin

# Set the default shell to zsh rather than sh
ENV SHELL=/bin/zsh

# Set the default editor and visual
ENV EDITOR=nano
ENV VISUAL=nano

# Default powerline10k theme
ARG ZSH_IN_DOCKER_VERSION=1.2.0
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh)" -- \
  -p git \
  -p fzf \
  -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
  -a "source /usr/share/doc/fzf/examples/completion.zsh" \
  -a "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  -x

# Install Claude
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}


# Copy and set up firewall script
COPY init-firewall.sh /usr/local/bin/
USER root
RUN chmod +x /usr/local/bin/init-firewall.sh && \
  echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > /etc/sudoers.d/node-firewall && \
  chmod 0440 /etc/sudoers.d/node-firewall
USER node
```

**devcontainer.json例:**

```json
{
  "name": "Claude Code Sandbox",
  "build": {
    "dockerfile": "Dockerfile",
    "args": {
      "TZ": "${localEnv:TZ:America/Los_Angeles}",
      "CLAUDE_CODE_VERSION": "latest",
      "GIT_DELTA_VERSION": "0.18.2",
      "ZSH_IN_DOCKER_VERSION": "1.2.0"
    }
  },
  "runArgs": [
    "--cap-add=NET_ADMIN",
    "--cap-add=NET_RAW"
  ],
  "customizations": {
    "vscode": {
      "extensions": [
        "anthropic.claude-code",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "eamodio.gitlens"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
        },
        "terminal.integrated.defaultProfile.linux": "zsh",
        "terminal.integrated.profiles.linux": {
          "bash": {
            "path": "bash",
            "icon": "terminal-bash"
          },
          "zsh": {
            "path": "zsh"
          }
        }
      }
    }
  },
  "remoteUser": "node",
  "mounts": [
    "source=claude-code-bashhistory-${devcontainerId},target=/commandhistory,type=volume",
    "source=claude-code-config-${devcontainerId},target=/home/node/.claude,type=volume"
  ],
  "containerEnv": {
    "NODE_OPTIONS": "--max-old-space-size=4096",
    "CLAUDE_CONFIG_DIR": "/home/node/.claude",
    "POWERLEVEL9K_DISABLE_GITSTATUS": "true"
  },
  "workspaceMount": "source=${localWorkspaceFolder},target=/workspace,type=bind,consistency=delegated",
  "workspaceFolder": "/workspace",
  "postStartCommand": "sudo /usr/local/bin/init-firewall.sh",
  "waitFor": "postStartCommand"
}
```

**init-firewall.sh例:**

```bash
#!/bin/bash
set -euo pipefail  # Exit on error, undefined vars, and pipeline failures
IFS=$'\n\t'       # Stricter word splitting

# 1. Extract Docker DNS info BEFORE any flushing
DOCKER_DNS_RULES=$(iptables-save -t nat | grep "127\.0\.0\.11" || true)

# Flush existing rules and delete existing ipsets
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X
ipset destroy allowed-domains 2>/dev/null || true

# 2. Selectively restore ONLY internal Docker DNS resolution
if [ -n "$DOCKER_DNS_RULES" ]; then
    echo "Restoring Docker DNS rules..."
    iptables -t nat -N DOCKER_OUTPUT 2>/dev/null || true
    iptables -t nat -N DOCKER_POSTROUTING 2>/dev/null || true
    echo "$DOCKER_DNS_RULES" | xargs -L 1 iptables -t nat
else
    echo "No Docker DNS rules to restore"
fi

# First allow DNS and localhost before any restrictions
# Allow outbound DNS
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
# Allow inbound DNS responses
iptables -A INPUT -p udp --sport 53 -j ACCEPT
# Allow outbound SSH
iptables -A OUTPUT -p tcp --dport 22 -j ACCEPT
# Allow inbound SSH responses
iptables -A INPUT -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT
# Allow localhost
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Create ipset with CIDR support
ipset create allowed-domains hash:net

# Fetch GitHub meta information and aggregate + add their IP ranges
echo "Fetching GitHub IP ranges..."
gh_ranges=$(curl -s https://api.github.com/meta)
if [ -z "$gh_ranges" ]; then
    echo "ERROR: Failed to fetch GitHub IP ranges"
    exit 1
fi

if ! echo "$gh_ranges" | jq -e '.web and .api and .git' >/dev/null; then
    echo "ERROR: GitHub API response missing required fields"
    exit 1
fi

echo "Processing GitHub IPs..."
while read -r cidr; do
    if [[ ! "$cidr" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/[0-9]{1,2}$ ]]; then
        echo "ERROR: Invalid CIDR range from GitHub meta: $cidr"
        exit 1
    fi
    echo "Adding GitHub range $cidr"
    ipset add allowed-domains "$cidr"
done < <(echo "$gh_ranges" | jq -r '(.web + .api + .git)[]' | aggregate -q)

# Resolve and add other allowed domains
for domain in \
    "registry.npmjs.org" \
    "api.anthropic.com" \
    "sentry.io" \
    "statsig.anthropic.com" \
    "statsig.com" \
    "marketplace.visualstudio.com" \
    "vscode.blob.core.windows.net" \
    "update.code.visualstudio.com"; do
    echo "Resolving $domain..."
    ips=$(dig +noall +answer A "$domain" | awk '$4 == "A" {print $5}')
    if [ -z "$ips" ]; then
        echo "ERROR: Failed to resolve $domain"
        exit 1
    fi
    
    while read -r ip; do
        if [[ ! "$ip" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
            echo "ERROR: Invalid IP from DNS for $domain: $ip"
            exit 1
        fi
        echo "Adding $ip for $domain"
        ipset add allowed-domains "$ip"
    done < <(echo "$ips")
done

# Get host IP from default route
HOST_IP=$(ip route | grep default | cut -d" " -f3)
if [ -z "$HOST_IP" ]; then
    echo "ERROR: Failed to detect host IP"
    exit 1
fi

HOST_NETWORK=$(echo "$HOST_IP" | sed "s/\.[0-9]*$/.0\/24/")
echo "Host network detected as: $HOST_NETWORK"

# Set up remaining iptables rules
iptables -A INPUT -s "$HOST_NETWORK" -j ACCEPT
iptables -A OUTPUT -d "$HOST_NETWORK" -j ACCEPT

# Set default policies to DROP first
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

# First allow established connections for already approved traffic
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Then allow only specific outbound traffic to allowed domains
iptables -A OUTPUT -m set --match-set allowed-domains dst -j ACCEPT

# Explicitly REJECT all other outbound traffic for immediate feedback
iptables -A OUTPUT -j REJECT --reject-with icmp-admin-prohibited

echo "Firewall configuration complete"
echo "Verifying firewall rules..."
if curl --connect-timeout 5 https://example.com >/dev/null 2>&1; then
    echo "ERROR: Firewall verification failed - was able to reach https://example.com"
    exit 1
else
    echo "Firewall verification passed - unable to reach https://example.com as expected"
fi

# Verify GitHub API access
if ! curl --connect-timeout 5 https://api.github.com/zen >/dev/null 2>&1; then
    echo "ERROR: Firewall verification failed - unable to reach https://api.github.com"
    exit 1
else
    echo "Firewall verification passed - able to reach https://api.github.com as expected"
fi
```

### DevContainer環境の起動

1. VS Codeでプロジェクトフォルダを開く
2. `Ctrl+Shift+P` → "Dev Containers: Reopen in Container"
3. 初回起動時はイメージのビルドに時間がかかります

### 動作確認

DevContainer環境が起動したら、以下を確認してください。

#### Claude Codeの動作確認

- Windows: Ctrl+Shift+P → "Run Claude Code"
- macOS: ⌘+Shift+P → "Run Claude Code"

`1. Claude Codeのセットアップ`でセットアップしたとおり、Dev Container内で利用するClaude Codeをセットアップしてください。
