# 簡単なアプリ作成チュートリアル

## 概要

このチュートリアルでは、Claude Codeを使用してシンプルなタスク管理APIを作成します。  
Spring Bootを使用したRESTful APIの開発を通じて、Claude Codeの基本的な使い方を学びます。

## 学習目標

- Claude Codeとの基本的な対話方法
- コード生成機能の活用
- 既存コードの編集と拡張
- テストコードの自動生成
- デバッグとトラブルシューティング

## 前提条件

- [セットアップガイド](../02_basics/02_setup.md)が完了していること
- DevContainer環境が起動していること
- Bedrock経由でのモデルアクセスが設定済みであること

## 1. プロジェクトの初期化

### Claude Codeとの対話開始

1. VS Codeで新しいフォルダを開く
2. `Ctrl+Shift+P` → "Claude Code: Open in Terminal"
3. Shift+TabでPlan Modeにしてから以下のプロンプトを入力：

    ```txt
    Spring Bootを使用したタスク管理APIを作成したいです。
    対象のAPIはREST APIで、基本的なCRUD操作を行います。
    以下の要件でプロジェクトを初期化してください：

    - 言語
    - Java 21
    - フレームワーク
    - Spring Boot 3.4
    - データベースアクセスライブラリ
    - MyBatis 3
    - Flyway
    - テスティングフレームワーク
    - Spring Test
    - JUnit 5
    - AssertJ
    - ビルドツール
    - Apache Maven 3.9
    - データベース
    - H2データベース

    まずはプロジェクト構造とpom.xmlのみを作成してください。
    フレームワークやライブラリは上記で指示したもののみを利用してください。
    ```

### 期待される応答

Webへのアクセス許可などが求められる場合があるので、内容を確認して許可してください。  
何度かやり取りすると、Claude Codeが以下のような構造を提案します。

```txt
first-app/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── taskapi/
│   │   │               ├── TaskApiApplication.java
│   │   │               ├── controller/
│   │   │               ├── service/
│   │   │               ├── mapper/
│   │   │               └── model/
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── db/
│   │       │   └── migration/
│   │       └── mapper/
│   └── test/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── taskapi/
│       └── resources/
└── README.md
```

提案された内容を修正したい場合、「No, keep planning」を選んで修正点を指示してみましょう。  
提案内容が問題ないと感じたら「Yes, and auto-accept edits」を選んで作業を進めます。  

作業が終わったら現時点でビルドが通るかも確認しておきましょう。  
Claude CodeをShift+Tabで通常モードにしてから、以下のプロンプトを送信します。

```txt
ビルドが通るか確認してください。
```

Mavenの実行許可を求められるので、許可してください。  
暫く待つとビルドが終わるか、ビルドで問題が発生してる場合はClaude Codeから修正の提案が行われるはずです。

## 2. 基本的なエンティティの作成

### MyBatis用のモデルの作成

プロジェクトの構成が整ったので、次にMyBatis用のモデルを作ってみましょう。  
Plan Modeにしてから以下のプロンプトを送信します。

```txt
Taskモデルを作成したいです。

以下のフィールドを含む：
- id (Long, 主キー)
- title (String, 空文字不可)
- description (String)
- completed (Boolean, デフォルトfalse, 必須)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

タイトルは100文字以内、説明は500文字以内であることを確認するバリデーションも追加してください。
まずはモデルとデータベース用のマイグレーションのみを作ってください。
```

Claude Codeが提示してきた内容で良ければ、進めてください。  
以下のようなモデルと対応するマイグレーションファイルが生成されるはずです。

<!-- markdownlint-disable-next-line MD024 -->
### 生成されるコード例

```java
package com.example.taskapi.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class Task {
    private Long id;
    
    @NotBlank(message = "タイトルは必須です")
    @Size(max = 100, message = "タイトルは100文字以内で入力してください")
    private String title;
    
    @Size(max = 500, message = "説明は500文字以内で入力してください")
    private String description;
    
    @NotNull(message = "完了状態は必須です")
    private Boolean completed = false;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    public Task() {
    }
    
    public Task(String title, String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.title = title;
        this.description = description;
        this.completed = false;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // ゲッター・セッターなどは省略
}
```

ここまで進めた状態で再度以下のようなプロンプトでビルドの確認をしてみましょう。  
Shift+Tabで通常モードにしてから入力してください。

```txt
ビルドが通るか確認してください。
```

Mavenによるビルドの確認と、場合によってはマイグレーションの動作チェックもしてくれます。
もしマイグレーションの動作チェックが行われなかった場合は、以下のプロンプトで動作チェックしてみても良いでしょう。

```txt
マイグレーションが動作するか確認してください。
```

## 3. マッパーの作成

### UserMapperの作成

次にMyBatisのUserMapperを作成してみましょう。  
Plan Modeにしてから以下のプロンプトを入力してください。

```txt
MyBatisのUserMapperを作成してください。
SQLは全てxml側に記述してください。

基本的なCRUDに加えて、以下のカスタムメソッドも追加：
- 完了状態で検索するメソッド
- タイトルで部分一致検索するメソッド
- 作成日時で並び替えるメソッド
```

Claude Codeの提示してきた内容を確認し、必要に応じてチャットで調整してから先に進んでください。  

<!-- markdownlint-disable-next-line MD024 -->
### 生成されるコード例

```java
package com.example.taskapi.mapper;

import com.example.taskapi.model.Task;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface TaskMapper {
    
    List<Task> findAll();
    
    Optional<Task> findById(@Param("id") Long id);
    
    int insert(Task task);
    
    int update(Task task);
    
    int delete(@Param("id") Long id);
    
    List<Task> findByCompleted(@Param("completed") Boolean completed);
    
    List<Task> findByTitleContaining(@Param("keyword") String keyword);
    
    List<Task> findAllOrderByCreatedAt();
    
    List<Task> findAllOrderByCreatedAtDesc();
}
```

## 4. サービス層の作成

### TaskServiceの作成

次にTaskMapperを利用するサービス層のコードを生成してみましょう。  
Plan Modeにしてから以下のプロンプトを入力してください。

```txt
TaskServiceクラスを作成してください。
既に作成されているTaskMapperを利用してください。

以下の機能を実装：
- 全タスク取得
- ID指定でタスク取得
- タスク作成
- タスク更新
- タスク削除
- 完了状態の切り替え

適切な例外処理も含めてください。
```

Claude Codeの提示してきた内容を確認し、必要に応じてチャットで調整してから先に進んでください。  

<!-- markdownlint-disable-next-line MD024 -->
### 生成されるコード例

```java
package com.example.taskapi.service;

import com.example.taskapi.exception.ResourceNotFoundException;
import com.example.taskapi.mapper.TaskMapper;
import com.example.taskapi.model.Task;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TaskService {
    
    private final TaskMapper taskMapper;
    
    public TaskService(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }
    
    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskMapper.findAll();
    }
    
    @Transactional(readOnly = true)
    public Task getTaskById(Long id) {
        return taskMapper.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
    }
    
    public Task createTask(Task task) {
        if (task.getCreatedAt() == null) {
            task.setCreatedAt(LocalDateTime.now());
        }
        if (task.getUpdatedAt() == null) {
            task.setUpdatedAt(LocalDateTime.now());
        }
        if (task.getCompleted() == null) {
            task.setCompleted(false);
        }
        
        int result = taskMapper.insert(task);
        if (result == 0) {
            throw new RuntimeException("タスクの作成に失敗しました");
        }
        
        return task;
    }
    
    public Task updateTask(Long id, Task taskUpdate) {
        Task existingTask = taskMapper.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        
        existingTask.setTitle(taskUpdate.getTitle());
        existingTask.setDescription(taskUpdate.getDescription());
        existingTask.setCompleted(taskUpdate.getCompleted());
        existingTask.setUpdatedAt(LocalDateTime.now());
        
        int result = taskMapper.update(existingTask);
        if (result == 0) {
            throw new RuntimeException("タスクの更新に失敗しました");
        }
        
        return existingTask;
    }
    
    public void deleteTask(Long id) {
        Task task = taskMapper.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        
        int result = taskMapper.delete(id);
        if (result == 0) {
            throw new RuntimeException("タスクの削除に失敗しました");
        }
    }
    
    public Task toggleCompleted(Long id) {
        Task task = taskMapper.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        
        task.setCompleted(!task.getCompleted());
        task.setUpdatedAt(LocalDateTime.now());
        
        int result = taskMapper.update(task);
        if (result == 0) {
            throw new RuntimeException("タスクの完了状態の更新に失敗しました");
        }
        
        return task;
    }
    
    @Transactional(readOnly = true)
    public List<Task> getTasksByCompleted(Boolean completed) {
        return taskMapper.findByCompleted(completed);
    }
    
    @Transactional(readOnly = true)
    public List<Task> searchTasksByTitle(String keyword) {
        return taskMapper.findByTitleContaining(keyword);
    }
    
    @Transactional(readOnly = true)
    public List<Task> getTasksOrderByCreatedAt(boolean descending) {
        if (descending) {
            return taskMapper.findAllOrderByCreatedAtDesc();
        } else {
            return taskMapper.findAllOrderByCreatedAt();
        }
    }
}
```

コードが生成されたら、念のためビルドが通る状態か確認しておきましょう。  
Shift+Tabで通常モードにしてから、以下のプロンプトを入力してください。

```txt
ビルドが通るか確認してください。
```

## 5. コントローラーの作成

### REST APIコントローラーの作成

TaskモデルとTaskMapper、TaskServiceができたので次はREST API用のコントローラを作成しましょう。  
Planモードにしてから以下のプロンプトを入力してください。

```txt
TaskControllerクラスを作成してください。
データアクセスにはTaskServiceを利用してください。

RESTful APIとして以下のエンドポイントを実装：
- GET /api/tasks - 全タスク取得
- GET /api/tasks/{id} - 特定タスク取得
- POST /api/tasks - タスク作成
- PUT /api/tasks/{id} - タスク更新
- DELETE /api/tasks/{id} - タスク削除
- PATCH /api/tasks/{id}/toggle - 完了状態切り替え

適切なHTTPステータスコードとエラーハンドリングを含めてください。
```

<!-- markdownlint-disable-next-line MD024 -->
### 生成されるコード例

```java
package com.example.taskapi.controller;

import com.example.taskapi.model.Task;
import com.example.taskapi.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    private final TaskService taskService;
    
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }
    
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task task) {
        Task updatedTask = taskService.updateTask(id, task);
        return ResponseEntity.ok(updatedTask);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Task> toggleCompleted(@PathVariable Long id) {
        Task updatedTask = taskService.toggleCompleted(id);
        return ResponseEntity.ok(updatedTask);
    }
}
```

## 6. テストコードの作成

### TaskMapperの単体テスト生成

REST API用のコントローラまで作成できたので、次は単体テストを作成して動作確認をしていきましょう。  
Planモードに変更してから、以下のプロンプトを入力してください。

```txt
TaskMapperクラスのテストを作成してください。
正常系だけではなく、異常系（バリデーションエラーなど）のテストも行ってください。
テストデータ作成時には対象のモデルクラスの実装を読んだ上で、バリデーション要件にそったデータを作成するようにしてください。
例外処理はグローバルで行われているものもあるので、コードを確認した上でテストを作ってください。

TaskMapperで作成するテスト：
- 基本的なCRUD
- 完了状態で検索するメソッド
- タイトルで部分一致検索するメソッド
- 作成日時で並び替えるメソッド
```

Claude Codeが提案してきた内容に問題が無ければ進めてください。  
これまでに生成してきたコードに問題があった場合や生成されたテストコードに問題があった場合、Claude Codeが修正内容について聞いてくる場合があります。  
そういった場合はClaude Codeと対話しながら修正内容を確認しながら進めることができます。

<!-- markdownlint-disable-next-line MD024 -->
### 生成されるテストコード例

```java
package com.example.taskapi.mapper;

import com.example.taskapi.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@DisplayName("TaskMapperテスト")
class TaskMapperTest {

    @Autowired
    private TaskMapper taskMapper;

    private Task createValidTask(String title, String description, boolean completed) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setCompleted(completed);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return task;
    }

    private Task createTaskWithCustomDate(String title, LocalDateTime createdAt) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription("Test description");
        task.setCompleted(false);
        task.setCreatedAt(createdAt);
        task.setUpdatedAt(createdAt);
        return task;
    }

    @BeforeEach
    void setUp() {
        // 各テストの前にデータをクリア
        List<Task> allTasks = taskMapper.findAll();
        for (Task task : allTasks) {
            taskMapper.delete(task.getId());
        }
    }

    @Nested
    @DisplayName("基本的なCRUD操作")
    class CrudOperations {

        @Test
        @DisplayName("正常系: 有効なTaskを挿入できる")
        void testInsert_ValidTask() {
            // Given
            Task task = createValidTask("テストタスク", "テストの説明", false);

            // When
            int result = taskMapper.insert(task);

            // Then
            assertThat(result).isEqualTo(1);
            assertThat(task.getId()).isNotNull();
            assertThat(task.getId()).isGreaterThan(0);
        }

        @Test
        @DisplayName("正常系: タイトルが100文字のTaskを挿入できる")
        void testInsert_MaxLengthTitle() {
            // Given
            String maxTitle = "あ".repeat(100);
            Task task = createValidTask(maxTitle, "説明", false);

            // When
            int result = taskMapper.insert(task);

            // Then
            assertThat(result).isEqualTo(1);
            Optional<Task> saved = taskMapper.findById(task.getId());
            assertThat(saved).isPresent();
            assertThat(saved.get().getTitle()).isEqualTo(maxTitle);
        }

        // 長いので以下は省略
    }
}
```

### TaskServiceの単体テスト生成

次はTaskServiceのテストを作成してみましょう。  
Planモードに変更してから、以下のプロンプトを入力してください。

```txt
TaskServiceクラスのテストを作成してください。
正常系だけではなく、異常系（バリデーションエラーなど）のテストも行ってください。
テストデータ作成時には対象のモデルクラスの実装を読んだ上で、バリデーション要件にそったデータを作成するようにしてください。
例外処理はグローバルで行われているものもあるので、コードを確認した上でテストを作ってください。

TaskServiceで作成するテスト：
- 全タスク取得
- 特定のタスク取得
- タスク作成
- タスク更新
- タスク削除
- 存在しないタスクの処理
```

Claude Codeが提案してきた内容に問題が無ければ進めてください。  
TaskMapperのテスト作成の時と同じく、上手く動かない場合はClaude Codeが修正方針などを提案してくるので適時対話しながら進めてみてください。

<!-- markdownlint-disable-next-line MD024 -->
### 生成されるテストコード例

```java
package com.example.taskapi.service;

import com.example.taskapi.exception.ResourceNotFoundException;
import com.example.taskapi.mapper.TaskMapper;
import com.example.taskapi.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TaskServiceテスト")
class TaskServiceTest {

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskService taskService;

    private Task createValidTask(Long id, String title, String description, boolean completed) {
        Task task = new Task();
        task.setId(id);
        task.setTitle(title);
        task.setDescription(description);
        task.setCompleted(completed);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return task;
    }

    @Nested
    @DisplayName("getAllTasks")
    class GetAllTasks {

        @Test
        @DisplayName("正常系：タスクリストを正常に取得できる")
        void getAllTasks_Success() {
            // Given
            List<Task> expectedTasks = Arrays.asList(
                createValidTask(1L, "タスク1", "説明1", false),
                createValidTask(2L, "タスク2", "説明2", true),
                createValidTask(3L, "タスク3", "説明3", false)
            );
            when(taskMapper.findAll()).thenReturn(expectedTasks);

            // When
            List<Task> actualTasks = taskService.getAllTasks();

            // Then
            assertThat(actualTasks).hasSize(3);
            assertThat(actualTasks).isEqualTo(expectedTasks);
            verify(taskMapper, times(1)).findAll();
        }

        @Test
        @DisplayName("正常系：タスクが0件の場合は空のリストを返す")
        void getAllTasks_EmptyList() {
            // Given
            when(taskMapper.findAll()).thenReturn(Collections.emptyList());

            // When
            List<Task> actualTasks = taskService.getAllTasks();

            // Then
            assertThat(actualTasks).isEmpty();
            verify(taskMapper, times(1)).findAll();
        }
    }

    // 長いので省略
}
```

## 8. アプリケーションの実行とテスト

### アプリケーションの起動

テストコードも生成できたので、最後に実際にアプリケーションを起動して動作確認を行いましょう。
まずは以下のコマンドでSpring Bootを起動しておきます。

```bash
mvn spring-boot:run
```

### APIの動作チェック

次に、Claude Codeに動作チェック用のコマンドを生成してもらいましょう。  
Planモードにして以下のプロンプトを送信してください。

```txt
作成したAPIをテストするためのcurlコマンドを生成してください。
全てのエンドポイントをテストできるようにmarkdownファイルに簡潔にまとめてください。
```

### 生成されるテストコマンド例

````markdown
# Task API テスト用 curl コマンド

## 前提条件
- Spring Bootアプリケーションが `http://localhost:8080` で起動していること
- H2データベースが使用可能であること

## 1. 全タスクの取得
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Content-Type: application/json"
```

## 2. 特定タスクの取得

```bash
curl -X GET http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json"
```

## 3. 新規タスクの作成

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新しいタスク",
    "description": "タスクの詳細説明",
    "completed": false
  }'
```

## 4. タスクの更新

```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新されたタスク",
    "description": "更新された説明",
    "completed": true
  }'
```

## 5. タスクの削除

```bash
curl -X DELETE http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json"
```

## 6. タスク完了状態の切り替え

```bash
curl -X PATCH http://localhost:8080/api/tasks/1/toggle \
  -H "Content-Type: application/json"
```
````

## 9. デバッグとトラブルシューティング

### よくある問題の解決

Claude Codeに問題が発生した場合の対話例です。

```txt
アプリケーション起動時に以下のエラーが発生しました：
[エラーメッセージをコピー&ペースト]

原因と解決方法を教えてください。
```

Claude Codeが以下のような分析と解決策を提供します。

1. **エラーの原因分析**
2. **具体的な修正方法**
3. **予防策の提案**

## 10. 次のステップ

基本的なアプリケーションが完成したら、以下の拡張を試してみましょう。

### 機能拡張の提案

Claude Codeに以下のプロンプトを送信します。

```txt
このタスク管理アプリに以下の機能を追加したいです：
- ユーザ認証機能
- タスクのカテゴリ分類
- 期限設定機能
- ファイル添付機能

どの機能から始めるのが良いか、実装の順序を提案してください。
```

### 学習の継続

1. **機能編**で各機能の詳細を学習
2. **実践編**で実際のプロジェクトでの活用方法を学習
3. **チーム開発編**でチーム開発での活用方法を学習

## まとめ

このチュートリアルを通じて、以下のClaude Codeの基本機能を学習しました。

- **自然言語でのコード生成**: 要求を自然言語で伝えてコードを生成
- **段階的な開発**: 小さな単位で機能を追加していく開発手法
- **テストコードの自動生成**: 単体テストの自動作成
- **デバッグ支援**: エラーの原因分析と解決策の提案

Claude Codeは強力なツールですが、生成されたコードは必ず理解し、適切にレビューすることが重要です。継続的な学習と実践を通じて、より効果的にClaude Codeを活用していきましょう。
