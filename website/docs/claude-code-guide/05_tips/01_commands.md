# カスタムコマンドの実例

ここでは実プロジェクトで用いられている、以下のカスタムコマンドの実例を紹介します。

- `execute_design_phase`: 機能仕様から詳細設計書と実装計画を生成するコマンド
- `execute_build_phase`: 詳細設計書と実装計画から実装コードを生成するコマンド

## カスタムコマンドのワークフロー解説

これらのカスタムコマンドは、複数のサブエージェントを協調させることで、複雑なソフトウェア開発タスクを自動化しています。以下では、各コマンドがどのようなワークフローで動作し、どのようにエージェント間の連携を実現しているかを詳しく解説します。

### execute_design_phaseのワークフロー

`execute_design_phase`コマンドは、高レベルな機能仕様書（YAMLフォーマット）を受け取り、実装可能な詳細設計書と実装計画を自動生成します。このプロセスは、人間の設計者が行う思考過程を模倣しながら、機械的な精度と一貫性を保証するよう設計されています。

このコマンドの中核となるのは、**設計判断の一元化**という原則です。従来の設計プロセスでは、「AまたはBという方法がある」といった曖昧な記述が残りがちでしたが、このコマンドは必ず単一の設計決定を下します。例えば、日付フォーマットの処理をSQL側で行うかアプリケーション側で行うかという選択において、設計フェーズで下された決定は、後続の全てのフェーズで厳密に遵守されます。

ワークフローは二つの主要なフェーズで構成されています。Phase 1A（詳細設計）では、batch-architectエージェントが機能仕様を読み込み、既存のコードベースを調査して、詳細な技術設計をYAML形式で生成します。この際、プロジェクト固有のルールや既存の実装パターンを参照し、一貫性のある設計を行います。生成された設計は、code-reviewerエージェントによる厳格なレビューを受けます。レビューでは、設計の曖昧さ、代替案の混在、契約定義の不明確さなどがチェックされ、問題があれば設計者に差し戻されます。

Phase 1B（実装計画）では、承認された詳細設計を基に、TDD（テスト駆動開発）に基づいた段階的な実装計画を生成します。この計画は人間の開発者が読める形式（Markdown）で記述され、各ステップでRED（失敗するテスト作成）→GREEN（実装）→REFACTOR（リファクタリング）のサイクルを明確に定義します。さらに、db-expertエージェントが計画を分析し、必要なテストデータの要件を抽出して別途ドキュメント化します。

このワークフローの特徴的な点は、**レビューループの組み込み**です。各フェーズの成果物は必ずレビューを受け、承認されるまで修正と再レビューを繰り返します。これにより、後続の実装フェーズで設計の曖昧さに起因する問題が発生することを防いでいます。

### execute_build_phaseのワークフロー

`execute_build_phase`コマンドは、設計フェーズで生成された成果物を入力として、実際のコード実装と検証を自動化します。このコマンドの最大の特徴は、**自己修復型のワークフロー**を持つことです。エラーが発生した場合、事前に定義されたエラーハンドリング手順に従って自動的に問題を解決し、処理を継続します。

実装フェーズ（Phase 2）では、承認された実装計画の各ステップを順次実行します。各ステップは独立したTDDサイクルとして構成され、まずtest-engineerエージェントが失敗するテストの作成を確認し（RED phase）、次に実装コードを生成してテストを通過させ（GREEN phase）、最後にcode-reviewerエージェントがコードレビューを行います。この過程で発生するエラーは、エラーハンドリング手順（別途`ERROR_HANDLING.md`に定義）に従って処理されます。例えば、外部キー制約違反が発生した場合は、関連テーブルのテストデータを追加する手順が自動的に実行されます。

重要な点として、各ステップの実装では**契約の厳密な遵守**が求めています。詳細設計で定められたメソッド名、SQLのnamespace/id、データ型、テストデータセットのファイル名などは、一字一句違わずに実装されます。これにより、設計と実装の乖離を完全に排除しています。

検証フェーズ（Phase 3）では、生成されたコード全体の統合テストを実行し、最終的な品質保証を行います。このフェーズでは、個別のユニットテストだけでなく、CSVファイルの出力形式（日付フォーマット、ヘッダー行の有無、文字エンコーディング）、ソート順序、NULL値の処理など、詳細な仕様適合性の検証も行われます。全ての検証に合格して初めて、ワークフローは完了となります。

エラーが発生した場合の対処も自動化されています。例えば、コンパイルエラーが発生した場合はtroubleshooterエージェントが呼び出され、インポート文の修正やアノテーションの追加などの修正を自動的に行います。データベース関連のエラーでは、db-expertエージェントがスキーマを分析して必要な修正を提案します。

### エージェント間の協調メカニズム

これらのカスタムコマンドの背後では、複数の専門エージェントが協調して動作しています。各エージェントは明確に定義された責任範囲を持ち、特定のタスクに特化しています。

batch-architectエージェントは設計と計画の生成に特化し、プロジェクトのアーキテクチャルールや既存パターンに精通しています。code-reviewerエージェントは品質保証の門番として、設計の一貫性やコードの品質をチェックします。test-engineerエージェントはテストの実行と結果の検証を担当し、TDDサイクルの適切な実行を保証します。db-expertエージェントはデータベース関連の分析と問題解決を行い、troubleshooterエージェントは予期しないエラーの診断と修復を担当します。

これらのエージェント間の連携は、明確に定義されたインターフェースを通じて行われます。各エージェントは、入力として必要な情報（ファイルパス、エラーメッセージなど）と、出力として生成する成果物（設計書、テストレポートなど）が明確に定義されており、これによりスムーズな連携が実現されています。

### プロンプトの記述言語

エージェントの性能を求めようとすると、日本語より英語の方が有利になります。プロンプトを踏まえたチーム内での共通言語形成を主軸におくなら日本語、エージェントの性能を求めるのであれば英語で記述する方針になるでしょう。

以下ではプロンプトの日本語訳と原文(英語)の両方を記載しておきます。

## プロンプト（日本語）

<!-- markdownlint-disable-next-line MD024 -->
### execute_design_phase

```markdown
---
name: execute_design_phase
description: "バッチタスクワークフローの設計・計画フェーズ（フェーズ1Aと1B）のみを実行し、detailed_design.yamlとplan.mdファイルを生成します。"
category: workflow
personas: [batch-architect, code-reviewer, db-expert]
---

# execute_design_phase - 設計・計画フェーズ実行コマンド

## トリガー
- このコマンドはバッチ開発タスクの設計・計画フェーズのみを実行するために使用されます。
- `instructions/tickets/BA10601.yaml`などのタスク仕様ファイルをユーザーが提供した際に起動されます。

## 行動指針
自律的な**設計リーダー**として行動します。あなたのミッションは、仕様ファイル（`BA*.yaml`）を受け取り、2つの重要な設計成果物（詳細設計書と実装計画）を作成することです。フェーズ1A（詳細設計）とフェーズ1B（実装計画）のみを実行し、その後停止します。各フェーズには品質確保のためのレビューサイクルが含まれます。プロセスは `設計 -> レビュー -> （必要に応じて）修正 -> 計画 -> レビュー -> （必要に応じて）修正 -> 完了` です。

## 重点領域
- **設計品質**: 包括的で機械可読な設計ドキュメントの作成
- **計画精度**: 詳細でTDDベースの実装計画の生成
- **レビュー準拠**: すべての出力が仕様とアーキテクチャ要件を満たすことを確認
- **DB分析**: テストデータ準備のためのデータベース依存関係を積極的に特定

## 主要アクション＆ワークフロー
**このワークフローはフェーズ1Aと1Bのみを実行し、その後停止します。**

### フェーズ1A: 詳細設計
1. **設計フェーズの開始宣言**: `フェーズ1A開始。仕様から詳細設計を生成中...`
2. **詳細設計のためにアーキテクトに委譲**:
   @agent-batch-architect
   **指示**: これは詳細設計フェーズです。YAML形式で包括的な設計ドキュメントを作成してください。
   **入力**: 提供されたチケット仕様ファイル
   **出力**: /output/[task_id]/[task_id]_detailed_design.yaml
3. **詳細設計のレビュー**: `@agent-code-reviewer`を呼び出して以下の点に特に注意して設計を検証:
   - **🔴 決定の一元化（重要）**: 設計に代替アプローチや「AまたはB」のオプションが存在しないことを確認。各技術的決定には厳密に1つの選択された解決策が必要。「オプションAまたはオプションB」や「XまたはYで実行可能」といったフレーズがある設計は却下。
   - **🔴 契約の正確性（重要）**: すべての契約（Mapperメソッド名、SQL namespace/id、resultType、テストデータセットパス）が厳密で交渉不可能な値として指定されていることを確認。範囲指定や「〜べき」ではなく、「厳密に〜でなければならない」のみ。
   - **🔴 責任の単一性（重要）**: 各責任が厳密に1つのレイヤーに割り当てられていることを確認（日付フォーマット：SQLまたはFieldExtractorのいずれか、バリデーション：JobParametersValidatorまたはビジネスロジックのいずれか）。
   - **共通基盤の前提**: `BatchBaseConfig`と`CustomerClient`のような共通コンポーネントへの依存関係の文書化を確認
   - **バリデーションの完全性**: 日付パラメータにフォーマットと存在の両方のバリデーションが含まれることを確認
   - **デフォルトパラメータメカニズム**: どのアプローチ（SpEL vs Supplierパターン）を使用するかと理由が明確に指定されていることを確認
   - **出力フォーマット処理**: 日付フォーマットが必要な場合のカスタムFieldExtractor設計をチェック
   - **NULL値処理**: FieldExtractor設計がNULLから空文字列への変換を処理することを確認
   - **🔴 CSVヘッダー行（重要）**: I/F仕様書でヘッダー要件がチェックされていることを確認。不確かな場合は両方のシナリオを設計に含める必要がある
   - **データ整合性**: JOIN動作と欠落マスタデータの処理の文書化をチェック
   - **パフォーマンス設定**: データベースリーダーにfetchSize設定が含まれることをチェック
   - **運用ログ**: ログ戦略に特定のログレベル（INFO/WARN/ERROR/DEBUG）とビジネス関連メッセージが含まれることを確認
   - **🔴 データモデルの分離（重要）**: 設計に2つの異なるデータモデルが含まれることを確認:
     - リーダーモデル（例：`ProjectAndCodeNameDetail`）DB マッピング用
     - ライターモデル（例：`ExportProjectsInPeriodItem`）CSV 出力用
     - ItemProcessorが適切な変換のために`<ReaderModel, WriterModel>`として定義されていることを確認
   - **再実行戦略＆トランザクション動作**: 文書に以下が含まれることを確認:
     - ファイル上書きポリシー（`shouldDeleteIfExists(true)`）
     - 空ファイル作成ポリシー（`shouldDeleteIfEmpty(false)`）
     - チャンク失敗動作とリカバリーアプローチ
4. **ゲート＆ループ**: 承認されない場合、承認されるまでフィードバックと共にアーキテクトに戻る。
5. **完了の宣言**: `フェーズ1A完了。詳細設計が承認されました。`

### フェーズ1B: 実装計画
1. **計画フェーズの開始宣言**: `フェーズ1B開始。承認された設計から段階的な実装計画を生成中...`
2. **実装計画のためにアーキテクトに委譲**:
   @agent-batch-architect
   **指示**: これは実装計画フェーズです。Markdown形式でTDDベースの実装計画を作成してください。
   **入力**: /output/[task_id]/[task_id]_detailed_design.yaml
   **出力**: /output/[task_id]/[task_id]_plan.md
3. **積極的なDB分析**: `@agent-db-expert`を呼び出して計画を分析し、テストデータ要件を生成。
4. **実装計画のレビュー**: `@agent-code-reviewer`を呼び出して計画を検証、以下を確認:
   - **🔴 契約の一貫性の強制（重要）**: すべてのステップが厳密なメソッドシグネチャ、SQL namespace/id、resultType、テストデータセットファイル名を変更なしで指定していることを確認。詳細設計の決定はすべてのステップを通じて一貫して参照される必要がある。
   - **🔴 単一アプローチへの準拠（重要）**: 各ステップが日付フォーマットをSQL（Processorパススルー）またはFieldExtractor（SQL生型）のどちらで処理するか明確に述べていることを確認 - 同じ計画で両方のアプローチを許可しない。
   - **🔴 テスト資産の命名規則（重要）**: すべてのテストデータセットパス、ファイル名、テーブル名、カラム参照が既存プロジェクトの規則に厳密に従うことを確認。変更や「柔軟な」命名は不可。
   - **🔴 モデル実装ステップ（重要）**: 計画に正しい順序で3つの異なるステップが含まれることを確認:
     1. リーダーモデル実装ステップ（DBマッピングモデル）
     2. ライターモデル実装ステップ（CSV出力モデル）
     3. ItemProcessor変換ステップ（リーダー→ライター変換）
   - **専用バリデーターステップ**: JobParametersValidator実装のための特定のステップが存在することを確認
   - **デフォルトパラメータステップ**: デフォルト値メカニズム実装のステップが含まれることを確認
   - **カスタムFieldExtractorステップ**: 日付フォーマットとnull処理実装のステップが含まれることを確認
   - **パフォーマンス設定ステップ**: fetchSize設定がリーダー実装で対処されることを確認
   - **インフラエラーテスト**: DB接続エラー、ファイルI/Oエラー、APIタイムアウトのテストが計画に含まれることを確認
   - **境界値テスト**: プロジェクト開始/終了境界での日付を使用したテストをチェック
   - **テストデータの完全性**: 統合テストステップがすべての関連テーブルに言及していることをチェック
   - **CSVフォーマット検証**: テストステップに以下が含まれることを確認:
     - 日付フォーマット検証（yyyy/MM/dd）
     - NULL値処理検証
     - **ソート順検証**: 正しい順序付けのための行ごとの比較
     - **ヘッダー行検証**: 最初の行の内容チェック
5. **ゲート＆ループ**: 承認されない場合、承認されるまでフィードバックと共にアーキテクトに戻る。
6. **完了の宣言**: `フェーズ1B完了。実装計画が承認されました。`

### ワークフロー完了
1. **最終サマリー**: 生成された成果物のサマリーを提示:
   - 詳細設計: `/output/[task_id]/[task_id]_detailed_design.yaml`
   - 実装計画: `/output/[task_id]/[task_id]_plan.md`
   - DB要件: `/output/[task_id]/[task_id]_db_requirements.md`
2. **終了メッセージ**: `設計と計画フェーズが完了しました。実装フェーズの準備ができました。`

## 出力
- **詳細設計ドキュメント（`/output/[task_id]/[task_id]_detailed_design.yaml`）**: 機械可読な設計ブループリント
- **実装計画（`/output/[task_id]/[task_id]_plan.md`）**: 段階的なTDD実行計画
- **DB要件レポート（`/output/[task_id]/[task_id]_db_requirements.md`）**: テストデータ依存関係分析

## 境界
**実行する内容:**
- フェーズ1Aと1Bを自律的に実行
- 設計とレビューのために専門エージェントを編成
- 必要なすべての設計成果物を作成
- 計画フェーズ完了後に停止

**実行しない内容:**
- 実装コード生成の実行
- 設計レビュー以外のテストや検証の実行
- フェーズ2（実装）への進行
- ソースコードファイルの変更
```

<!-- markdownlint-disable-next-line MD024 -->
### execute_build_phase

```markdown
---
name: execute_build_phase
description: "既存のdetailed_design.yamlとplan.mdファイルを使用して、バッチタスクワークフローの実装・検証フェーズ（フェーズ2と3）を実行し、コードの生成とテストを行います。"
category: workflow
personas: [code-reviewer, test-engineer, db-expert, troubleshooter]
---

# execute_build_phase - 実装・検証フェーズ実行コマンド

## トリガー
- このコマンドはバッチ開発タスクの実装・検証フェーズを実行するために使用されます。
- `execute_design_phase`からの既存の設計成果物が必要です。
- 既存の設計ドキュメントと共にタスク仕様ファイルをユーザーが提供した際に起動されます。

## 行動指針
自律的な**実装リーダー**として行動します。あなたのミッションは、承認された設計成果物（`detailed_design.yaml`と`plan.md`）を受け取り、完全でテスト済みの実装まで推進することです。回復力のある自己修正ワークフローを通じてフェーズ2（実装）とフェーズ3（検証）を実行します。プロセスは `コード -> テスト -> レビュー -> （必要に応じて）トラブルシュート -> 修正 -> 継続` で、最終的な検証済みコードの準備が整うまで続けます。

## 前提条件
**必須：実行前に以下のファイルが存在している必要があります:**
- `/output/[task_id]/[task_id]_detailed_design.yaml` - 承認された詳細設計ドキュメント
- `/output/[task_id]/[task_id]_plan.md` - 承認された実装計画

## 重点領域
- **TDD強制**: RED -> GREEN -> REFACTORサイクルを厳格に適用
- **自律的実行**: 人間の介入なしに計画のすべてのステップを実行
- **自己修復**: 定義された手順を使用してエラーから自動的に回復
- **品質保証**: すべてのコードがレビューとテストに合格することを確認

## 主要アクション＆ワークフロー
**このワークフローは既存の設計成果物を使用してフェーズ2と3を実行します。**

**必須：エラー処理手順を参照。**
開始前に、`@.claude/core/ERROR_HANDLING.md`に定義されたエラー回復手順を必ず読み込んで理解してください。

### 初期設定
1. **設計成果物の読み込み**:
   - `/output/[task_id]/[task_id]_detailed_design.yaml`を読み込む
   - `/output/[task_id]/[task_id]_plan.md`を読み込む
2. **前提条件の検証**:
   - 両ファイルが存在し有効であることを確認
   - **共通基盤の確認**: `BatchBaseConfig`と`CustomerClient`のような共通コンポーネントが利用可能であることを確認
3. **開始の宣言**: `承認された設計と計画から実装を開始します...`

### フェーズ2: 実装（計画の段階的実行）
1. **実行フェーズの宣言**: `フェーズ2開始：段階的実装...`
2. **順次ステップ実行ループ**: 承認された計画の各ステップに対して：
   a. **現在のステップの宣言**: `[ステップX/Y実行中]: ...`
   b. **TDD - REDフェーズ**:
      - `detailed_design.yaml`に基づいて、テストクラスと失敗するテストを生成
      - パッチを適用
      - `@agent-test-engineer`に委譲してテストが失敗すること（RED）を確認
   c. **TDD - GREENフェーズ（コード生成）**:
      - `detailed_design.yaml`に基づいて実装コードを生成
      - 設計ドキュメントの正確な仕様を使用
      - **重要な実装チェック**:
        - **🔴 契約の忠実性（重要）**: 生成されたすべてのコードがdetailed_design.yamlで指定された厳密な契約（メソッド名、SQL namespace/id、resultType、クラス名）と一致することを確認。承認された設計からの逸脱は不可。
        - **🔴 テスト資産の整合性（重要）**: すべてのテストデータセットファイル名、パス、テーブル名、カラム参照が既存プロジェクトの規則と正確に一致することを確認。適切な大文字小文字で正しいディレクトリにデータセットが配置されていることをチェック。
        - **🔴 単一アプローチの一貫性（重要）**: 実装が設計から選択された単一のアプローチ（日付フォーマットの位置、バリデーション戦略、データ変換ロジック）に従うことを確認。アプローチの混在は不可。
        - **🔴 データモデルの場合**: 2つの異なるモデルクラスが実装されることを確認：
          - リーダーモデル（DBマッピング）SQL SELECT構造と正確に一致
          - ライターモデル（CSV出力）最終出力フォーマットと一致
        - **🔴 ItemProcessorの場合**: 適切なフィールド単位の変換ロジックで`<ReaderModel, WriterModel>`として実装
        - JobParametersValidatorの場合：フォーマットと存在の両方のバリデーションを確認（例：2025/02/30を拒否）
        - デフォルトパラメータの場合：デフォルト値注入メカニズムを実装（例：businessDateがBusinessDateSupplier.getDate()にデフォルト設定）
        - FieldExtractorの場合：DateTimeFormatterを使用したカスタム日付フォーマット（yyyy/MM/dd）とnullから空文字列への変換を実装
        - データベースリーダーの場合：OutOfMemoryErrorを防ぐため適切にfetchSizeを設定（例：setFetchSize(1000)）
        - テストデータの場合：外部キー違反を避けるため、すべての関連テーブルを含める
        - CSVライターの場合：
          - 適切な再実行のため`shouldDeleteIfExists(true)`を設定
          - **🔴 データなし時の空ファイル作成を確保するため`shouldDeleteIfEmpty(false)`を設定**
          - **🔴 I/F仕様がヘッダーを要求する場合はヘッダーコールバックを設定**
          - チャンク失敗時のトランザクション動作を文書化
      - パッチを適用
   d. **テスト前コードレビューゲート**:
      - `@agent-code-reviewer`に委譲してコードをレビュー
      - 失敗した場合、エラー処理手順を参照するかトラブルシューターにエスカレート
   e. **TDD - GREENフェーズ（検証）**:
      - `@agent-test-engineer`に委譲してテストを実行
      - 失敗した場合、エラー処理手順を参照するかトラブルシューターにエスカレート
   f. **重要な退行チェック**:
      - `mvn test -f batch/pom.xml`を実行
      - 退行が見つかった場合、トラブルシューターにエスカレート
   g. **ステップ完了のマーク**: `[ステップX/Y完了]`を宣言して続行
3. **移行**: すべてのステップが完了したら、`フェーズ2完了。`を宣言

### フェーズ3: 最終検証＆デリバリー
1. **最終検証の宣言**: `フェーズ3開始：最終検証＆デリバリー...`
2. **フルテストスイート実行**: `mvn test -f batch/pom.xml`を実行
3. **最終出力検証**:
   - **🔴 実装契約準拠**: 実装されたコードがdetailed_design.yamlの契約と正確に一致することを確認（Mapperメソッドシグネチャ、SQL文、クラス名、パッケージ構造）
   - **🔴 テスト実行一貫性**: すべてのテストデータセットが「dataset not found」エラーなしで読み込めること、テーブル/カラム参照がプロジェクト規則に従って正しくケース処理されていることを確認
   - **🔴 単一アプローチ検証**: 日付フォーマットが選択された単一の場所（SQL TO_CHARまたはFieldExtractorのいずれか）で処理されており、両方ではないことを確認
   - **🔴 CSVヘッダー行**: ヘッダーの有無がI/F仕様と正確に一致することを確認
   - **ソート順検証**: CSV全体を読み込み、行ごとの順序付けを確認（start_date ASC、end_date ASC、name ASC）
   - CSV出力日付フォーマットがyyyy/MM/dd（yyyy-MM-ddではない）であることを確認
   - CSV文字エンコーディングが指定通りUTF-8であることを確認
   - CSVのNULL値が空文字列として出力されること（「null」ではない）を確認
   - デフォルトパラメータメカニズムが動作することを確認（例：businessDateが指定されていない場合に正しくデフォルト設定される）
   - データベースリーダーのfetchSizeがパフォーマンスのため適切に設定されていることを確認
   - **運用ログ検証**:
     - ビジネス日付を含むジョブ開始/終了のINFOログ
     - 処理メトリクスのINFOログ（N件のレコードを処理）
     - クライアントIDを含むAPI失敗のWARNログ
   - テストデータに必要なすべての関連テーブルが含まれることを確認
   - JobParametersValidatorが無効な日付を拒否することを検証（例：2025/02/30）
   - インフラエラー処理を確認（DBエラー、ファイルI/Oエラー）
4. **最終コードレビュー**: 包括的なレビューのため`@agent-code-reviewer`を呼び出す
5. **ゲート＆ループ**: 失敗した場合、問題のある領域を特定して修正
6. **完了**: 承認されたら、`ワークフロー完了。`を宣言
7. **デリバー**: 最終サマリーと完全なソースコードを提示

## エラー回復手順
特定のエラーに遭遇した際に以下の手順を自動的に適用：
- **EHP-01**: 外部キー制約違反
- **EHP-01R**: 繰り返し発生する外部キー問題
- **EHP-02**: @StepScopeアノテーション不足
- **EHP-03**: NoSuchTableException
- **EHP-04**: ApplicationContext読み込み失敗
- **EHP-05**: コンパイル/インポートエラー

## 出力
- **実装コード**: 完全なJavaソースファイルとリソース
- **テストクラス**: ユニットおよび統合テスト実装
- **テストレポート**: 実行結果と検証レポート
- **最終ソースコード**: 完全にテストおよびレビュー済みの実装

## 境界
**実行する内容:**
- 既存の設計を使用してフェーズ2と3を自律的に実行
- 承認された設計に基づいてすべての実装コードを生成
- テストを実行し、エラーを自動的に処理
- 完全でテスト済みのソースコードを提供

**実行しない内容:**
- 設計ドキュメントの作成や変更
- 実装計画の変更
- テストやレビューステップのスキップ
- フェーズ3が完了するか回復不能エラーが発生するまで停止しない
```

## プロンプト（原文）

<!-- markdownlint-disable-next-line MD024 -->
### execute_design_phase

```markdown
---
name: execute_design_phase
description: "Executes only the design and planning phases (Phase 1A and 1B) of the batch task workflow, producing detailed_design.yaml and plan.md files."
category: workflow
personas: [batch-architect, code-reviewer, db-expert]
---

# execute_design_phase - Design & Planning Phase Executor

## Triggers
- This command is used for executing only the design and planning phases of batch development tasks.
- It is activated when a user provides a task specification file, such as `instructions/tickets/BA10601.yaml`.

## Behavioral Mindset
Act as an autonomous **Design Lead**. Your mission is to take a specification file (`BA*.yaml`) and produce two critical design artifacts: a detailed design document and an implementation plan. You will execute Phase 1A (Detailed Design) and Phase 1B (Implementation Planning) only, then stop. Each phase includes review cycles to ensure quality. Your process is `Design -> Review -> (if needed) Fix -> Plan -> Review -> (if needed) Fix -> Complete`.

## Focus Areas
- **Design Quality**: Create comprehensive, machine-readable design documents
- **Planning Precision**: Generate granular, TDD-based implementation plans
- **Review Compliance**: Ensure all outputs meet specification and architectural requirements
- **DB Analysis**: Proactively identify database dependencies for test data preparation

## Key Actions & Workflow
**This workflow executes Phase 1A and 1B only, then stops.**

### Phase 1A: Detailed Design
1.  **Announce Design Phase**: `Phase 1A START. Generating detailed design from specification...`
2.  **Delegate to Architect for Detailed Design**: 
    @agent-batch-architect
    **Instruction**: This is the DETAILED DESIGN phase. Create a comprehensive design document in YAML format.
    **Input**: The provided ticket specification file
    **Output**: /output/[task_id]/[task_id]_detailed_design.yaml
3.  **Review the Detailed Design**: Invoke `@agent-code-reviewer` to validate the design with special attention to:
    - **🔴 Decision Unification (CRITICAL)**: Verify NO alternative approaches or "either/or" options exist in the design. Each technical decision MUST have exactly ONE chosen solution. Reject designs with phrases like "Option A or Option B" or "can be done with X or Y".
    - **🔴 Contract Exactness (CRITICAL)**: Verify ALL contracts (Mapper method names, SQL namespace/id, resultType, test dataset paths) are specified as EXACT, non-negotiable values. No ranges, no "should be", only "MUST be exactly".
    - **🔴 Responsibility Singularity (CRITICAL)**: Verify each responsibility is assigned to exactly ONE layer (date formatting: EITHER SQL OR FieldExtractor, validation: EITHER JobParametersValidator OR business logic).
    - **Common Foundation Assumptions**: Verify documentation of dependencies on `BatchBaseConfig` and common components like `CustomerClient`
    - **Validation Completeness**: Verify that date parameters include BOTH format and existence validation
    - **Default Parameter Mechanism**: Verify design clearly specifies which approach (SpEL vs Supplier Pattern) and rationale
    - **Output Format Handling**: Check for custom FieldExtractor design when date formatting is required
    - **NULL Value Handling**: Verify FieldExtractor design handles NULL-to-empty-string conversion
    - **🔴 CSV Header Row (CRITICAL)**: Verify I/F specification document is checked for header requirements. Design MUST include both scenarios if uncertain
    - **Data Integrity**: Check documentation of JOIN behavior and handling of missing master data
    - **Performance Configuration**: Check that database reader includes fetchSize configuration
    - **Operational Logging**: Verify logging strategy includes specific log levels (INFO/WARN/ERROR/DEBUG) and business-relevant messages
    - **🔴 Data Model Separation (CRITICAL)**: Verify that the design includes TWO distinct data models:
        - Reader Model (e.g., `ProjectAndCodeNameDetail`) for DB mapping
        - Writer Model (e.g., `ExportProjectsInPeriodItem`) for CSV output
        - Confirm ItemProcessor is defined as `<ReaderModel, WriterModel>` for proper transformation
    - **Re-execution Strategy & Transaction Behavior**: Confirm documentation includes:
        - File overwrite policy (`shouldDeleteIfExists(true)`)
        - Empty file creation policy (`shouldDeleteIfEmpty(false)`)
        - Chunk failure behavior and recovery approach
4.  **Gate & Loop**: If not approved, loop back to architect with feedback until approved.
5.  **Announce Completion**: `Phase 1A COMPLETE. Detailed design approved.`

### Phase 1B: Implementation Planning
1.  **Announce Planning Phase**: `Phase 1B START. Generating step-by-step implementation plan from the approved design...`
2.  **Delegate to Architect for Implementation Plan**: 
    @agent-batch-architect
    **Instruction**: This is the IMPLEMENTATION PLANNING phase. Create a TDD-based implementation plan in Markdown format.
    **Input**: /output/[task_id]/[task_id]_detailed_design.yaml
    **Output**: /output/[task_id]/[task_id]_plan.md
3.  **Proactive DB Analysis**: Invoke `@agent-db-expert` to analyze the plan and generate test data requirements.
4.  **Review the Implementation Plan**: Invoke `@agent-code-reviewer` to validate the plan, ensuring:
    - **🔴 Contract Consistency Enforcement (CRITICAL)**: Verify every step specifies EXACT method signatures, SQL namespace/id, resultType, and test dataset file names with NO variations. The detailed design's decisions MUST be consistently referenced throughout all steps.
    - **🔴 Single Approach Adherence (CRITICAL)**: Verify each step clearly states whether date formatting is handled in SQL (Processor pass-through) OR FieldExtractor (SQL raw types) - NEVER allowing both approaches in the same plan.
    - **🔴 Test Asset Naming Convention (CRITICAL)**: Verify all test dataset paths, file names, table names, and column references follow existing project conventions exactly. No variations or "flexible" naming.
    - **🔴 Model Implementation Steps (CRITICAL)**: Verify the plan includes THREE distinct steps in correct order:
        1. Reader Model implementation step (DB mapping model)
        2. Writer Model implementation step (CSV output model)
        3. ItemProcessor transformation step (Reader → Writer conversion)
    - **Dedicated Validator Step**: Confirm a specific step exists for JobParametersValidator implementation
    - **Default Parameter Step**: Verify a step for implementing default value mechanism is included
    - **Custom FieldExtractor Step**: Verify a step for date formatting AND null handling implementation is included  
    - **Performance Configuration Step**: Confirm fetchSize configuration is addressed in reader implementation
    - **Infrastructure Error Testing**: Verify plan includes tests for DB connection errors, file I/O errors, API timeouts
    - **Boundary Value Testing**: Check for tests with dates at project start/end boundaries
    - **Test Data Completeness**: Check that integration test steps mention all related tables
    - **CSV Format Verification**: Ensure test steps include:
        - Date format verification (yyyy/MM/dd)
        - NULL value handling verification
        - **Sort order verification**: Row-by-row comparison for correct ordering
        - **Header row verification**: First line content check
5.  **Gate & Loop**: If not approved, loop back to architect with feedback until approved.
6.  **Announce Completion**: `Phase 1B COMPLETE. Implementation plan approved.`

### Workflow Completion
1.  **Final Summary**: Present a summary of generated artifacts:
    - Detailed Design: `/output/[task_id]/[task_id]_detailed_design.yaml`
    - Implementation Plan: `/output/[task_id]/[task_id]_plan.md`
    - DB Requirements: `/output/[task_id]/[task_id]_db_requirements.md`
2.  **Exit Message**: `Design and planning phases complete. Ready for implementation phase.`

## Outputs
- **Detailed Design Document (`/output/[task_id]/[task_id]_detailed_design.yaml`)**: Machine-readable design blueprint
- **Implementation Plan (`/output/[task_id]/[task_id]_plan.md`)**: Step-by-step TDD execution plan
- **DB Requirements Report (`/output/[task_id]/[task_id]_db_requirements.md`)**: Test data dependency analysis

## Boundaries
**Will:**
- Execute Phase 1A and 1B autonomously
- Orchestrate specialist agents for design and review
- Produce all necessary design artifacts
- Stop after planning phase completion

**Will Not:**
- Execute any implementation code generation
- Run any tests or validation beyond design reviews
- Proceed to Phase 2 (Implementation)
- Modify any source code files
```

<!-- markdownlint-disable-next-line MD024 -->
### execute_build_phase

```markdown
---
name: execute_build_phase
description: "Executes the implementation and validation phases (Phase 2 and 3) of the batch task workflow, using existing detailed_design.yaml and plan.md files to generate and test code."
category: workflow
personas: [code-reviewer, test-engineer, db-expert, troubleshooter]
---

# execute_build_phase - Implementation & Validation Phase Executor

## Triggers
- This command is used for executing the implementation and validation phases of batch development tasks.
- It requires pre-existing design artifacts from `execute_design_phase`.
- It is activated when a user provides a task specification file with existing design documents.

## Behavioral Mindset
Act as an autonomous **Implementation Lead**. Your mission is to take approved design artifacts (`detailed_design.yaml` and `plan.md`) and drive them to complete, tested implementation. You will execute Phase 2 (Implementation) and Phase 3 (Validation) through a resilient, self-correcting workflow. Your process is `Code -> Test -> Review -> (if needed) Troubleshoot -> Fix -> Continue` until the final, validated code is ready.

## Prerequisites
**MANDATORY: The following files must exist before execution:**
- `/output/[task_id]/[task_id]_detailed_design.yaml` - The approved detailed design document
- `/output/[task_id]/[task_id]_plan.md` - The approved implementation plan

## Focus Areas
- **TDD Enforcement**: Rigorously apply the RED -> GREEN -> REFACTOR cycle
- **Autonomous Execution**: Execute all steps from the plan without human intervention
- **Self-Healing**: Automatically recover from errors using defined procedures
- **Quality Assurance**: Ensure all code passes reviews and tests

## Key Actions & Workflow
**This workflow executes Phase 2 and 3, using existing design artifacts.**

**MANDATORY: Reference the Error Handling Procedures.**
Before starting, you MUST load and understand the error recovery procedures defined in `@.claude/core/ERROR_HANDLING.md`.

### Initial Setup
1.  **Load Design Artifacts**: 
    - Read `/output/[task_id]/[task_id]_detailed_design.yaml`
    - Read `/output/[task_id]/[task_id]_plan.md`
2.  **Validate Prerequisites**: 
    - Confirm both files exist and are valid
    - **Verify common foundation**: Ensure `BatchBaseConfig` and common components like `CustomerClient` are available
3.  **Announce Start**: `Starting implementation from approved design and plan...`

### Phase 2: Implementation (Execute the Plan Step-by-Step)
1.  **Announce Execution Phase**: `Starting Phase 2: Step-by-Step Implementation...`
2.  **Sequential Step Execution Loop**: For each step in the approved plan:
    a. **Announce Current Step**: `[Executing Step X of Y]: ...`
    b. **TDD - RED Phase**:
        - Based on the `detailed_design.yaml`, generate test class and failing test
        - Apply the patches
        - Delegate to `@agent-test-engineer` to confirm test fails (RED)
    c. **TDD - GREEN Phase (Code Generation)**:
        - Based on the `detailed_design.yaml`, generate implementation code
        - Use exact specifications from design document
        - **CRITICAL IMPLEMENTATION CHECKS**:
          - **🔴 Contract Fidelity (CRITICAL)**: Ensure ALL generated code matches the EXACT contracts specified in detailed_design.yaml (method names, SQL namespace/id, resultType, class names). NO deviations from the approved design.
          - **🔴 Test Asset Alignment (CRITICAL)**: Verify all test dataset file names, paths, table names, and column references match existing project conventions exactly. Check dataset placement in correct directories with proper casing.
          - **🔴 Single Approach Consistency (CRITICAL)**: Ensure implementation follows the SINGLE chosen approach from the design (date formatting location, validation strategy, data transformation logic). NO mixing of approaches.
          - **🔴 For Data Models**: Ensure TWO distinct model classes are implemented:
            - Reader Model (DB mapping) matching SQL SELECT structure exactly
            - Writer Model (CSV output) matching final output format
          - **🔴 For ItemProcessor**: Implement as `<ReaderModel, WriterModel>` with proper field-by-field transformation logic
          - For JobParametersValidator: Ensure BOTH format AND existence validation (e.g., reject 2025/02/30)
          - For Default Parameters: Implement default value injection mechanism (e.g., businessDate defaulting to BusinessDateSupplier.getDate())
          - For FieldExtractor: Implement custom date formatting (yyyy/MM/dd) using DateTimeFormatter AND null-to-empty-string conversion
          - For Database Reader: Configure fetchSize appropriately (e.g., setFetchSize(1000)) to prevent OutOfMemoryError
          - For Test Data: Include ALL related tables to avoid foreign key violations
          - For CSV Writer: 
            - Configure `shouldDeleteIfExists(true)` for proper re-execution
            - **🔴 Configure `shouldDeleteIfEmpty(false)` to ensure empty file creation when no data**
            - **🔴 Configure header callback if I/F spec requires headers**
            - Document transaction behavior for chunk failures
        - Apply the patch
    d. **PRE-TEST CODE REVIEW GATE**:
        - Delegate to `@agent-code-reviewer` to review the code
        - If fails, consult Error Handling Procedures or escalate to troubleshooter
    e. **TDD - GREEN Phase (Verification)**:
        - Delegate to `@agent-test-engineer` to run the test
        - If fails, consult Error Handling Procedures or escalate to troubleshooter
    f. **Critical Regression Check**:
        - Run `mvn test -f batch/pom.xml`
        - If regression found, escalate to troubleshooter
    g. **Mark Step Complete**: Announce `[Step X of Y COMPLETE]` and proceed
3.  **Transition**: Once all steps complete, announce `Phase 2 COMPLETE.`

### Phase 3: Final Validation & Delivery
1.  **Announce Final Validation**: `Starting Phase 3: Final Validation & Delivery...`
2.  **Full Test Suite Execution**: Run `mvn test -f batch/pom.xml`
3.  **Final Output Verification**: 
    - **🔴 Implementation Contract Compliance**: Verify the implemented code matches the detailed_design.yaml contracts exactly (Mapper method signatures, SQL statements, class names, package structures)
    - **🔴 Test Execution Consistency**: Confirm ALL test datasets can be loaded without "dataset not found" errors and table/column references are correctly cased according to project conventions
    - **🔴 Single Approach Verification**: Verify date formatting is handled in the SINGLE chosen location (either SQL TO_CHAR OR FieldExtractor), not both
    - **🔴 CSV Header Row**: Verify header presence/absence matches I/F specification exactly
    - **Sort Order Verification**: Read entire CSV and verify row-by-row ordering (start_date ASC, end_date ASC, name ASC)
    - Verify CSV output date format is yyyy/MM/dd (not yyyy-MM-dd)
    - Verify CSV character encoding is UTF-8 as specified
    - Verify NULL values in CSV are output as empty strings (not "null")
    - Confirm default parameter mechanism works (e.g., businessDate defaults correctly when not specified)
    - Verify database reader fetchSize is configured appropriately for performance
    - **Operational Logging Verification**: 
        - INFO logs for job start/end with business date
        - INFO logs for processing metrics (N records processed)
        - WARN logs for API failures with client ID
    - Confirm test data includes all necessary related tables
    - Validate JobParametersValidator rejects invalid dates (e.g., 2025/02/30)
    - Verify infrastructure error handling (DB errors, file I/O errors)
4.  **Final Code Review**: Invoke `@agent-code-reviewer` for holistic review
5.  **Gate & Loop**: If failures, identify and fix problematic areas
6.  **Completion**: Once approved, announce `Workflow Complete.`
7.  **Deliver**: Present final summary and complete source code

## Error Recovery Procedures
Automatically apply these procedures when encountering specific errors:
- **EHP-01**: Foreign key constraint violations
- **EHP-01R**: Recurring foreign key issues
- **EHP-02**: Missing @StepScope annotations
- **EHP-03**: NoSuchTableException
- **EHP-04**: ApplicationContext loading failures
- **EHP-05**: Compilation/import errors

## Outputs
- **Implementation Code**: Complete Java source files and resources
- **Test Classes**: Unit and integration test implementations
- **Test Reports**: Execution results and validation reports
- **Final Source Code**: Fully tested and reviewed implementation

## Boundaries
**Will:**
- Execute Phase 2 and 3 autonomously using existing design
- Generate all implementation code based on approved design
- Run tests and handle errors automatically
- Deliver complete, tested source code

**Will Not:**
- Create or modify design documents
- Change the implementation plan
- Skip test or review steps
- Stop until Phase 3 is complete or unrecoverable error occurs
```
