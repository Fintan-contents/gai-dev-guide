---
sidebar_position: 9
---

# テストコードパターン

[実装パターン](../coding_pattern)と同様に、AIにプロジェクトのルールに沿ったテストコードを生成させるには、[テストコード標準](../test-code-standards)を示すだけでなく、模倣してもらうサンプルコード（テストコードパターン）が必要です。

テストコードは実装するテストの種類に応じてパターン化されやすく、よく似た構造になるため、実装方法をサンプルとして提供しておくことが非常に有効です。  

AIにテストコードパターンをインストラクションファイルとして提供することで、AIはプロジェクトにおける「手本」となるテストコードを学習し、それを模倣して新しいテストコードを生成するようになります。
これにより、開発者はテストの実装方法を都度細かく指示する必要がなくなり、テスト内容の確認やテストケースの網羅性など、より本質的な部分に集中できます。

以下は、各ステレオタイプのテストコードパターンに関する[インストラクションファイル](../../shared-instructions-prompts)の記述例です。

````markdown
---
applyTo: "**"
---
# テストコードパターン

## Controllerのテストコード実装例
```java
package com.example.myapp.user.controller;

import com.example.myapp.user.dto.UserDto;
import com.example.myapp.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    /**
     * ユーザー作成処理(POST /users)のテスト
     *
     * <p>
     *   内容: 正常なユーザー作成リクエストを送信する。
     *   期待値: HTTPステータス200が返却され、レスポンスボディにIDが付与されたユーザー情報が返却されること。
     * </p>
     */
    @Test
    void testCreateUser() throws Exception {
        // given
        String requestBody = "{\"name\": \"new-user\", \"email\": \"new-user@example.com\"}";
        UserDto createdUser = new UserDto(1L, "new-user", "new-user@example.com");
        when(userService.createUser(any(UserDto.class))).thenReturn(createdUser);

        // when, then
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"id\":1,\"name\":\"new-user\",\"email\":\"new-user@example.com\"}"));
    }
}
```

## Serviceのテストコード実装例
```java
package com.example.myapp.user.service;

import com.example.myapp.user.dto.UserDto;
import com.github.database.rider.core.api.dataset.DataSet;
import com.github.database.rider.core.api.dataset.ExpectedDataSet;
import com.github.database.rider.junit5.api.DBRider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@DBRider
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    /**
     * ユーザー検索処理のテスト
     *
     * <p>
     *   内容: 指定したIDのユーザーを検索する。
     *   期待値: 指定したIDのユーザー情報が取得できること。
     * 　　・ユーザー名:test-user
     * </p>
     */
    @Test
    @DataSet("datasets/com/example/myapp/user/service/UserServiceTest/findById.yml")
    void testFindById() {
        // given
        Long userId = 1L;

        // when
        UserDto actual = userService.findById(userId);

        // then
        assertThat(actual.getId()).isEqualTo(userId);
        assertThat(actual.getName()).isEqualTo("test-user");
    }

    /**
     * ユーザー更新処理(updateUser)のテスト
     *
     * <p>
     *   内容: 既存のユーザー情報を更新する。
     *   期待値: ユーザーテーブルの指定したIDのユーザー情報が以下の内容に更新されていること。
     *   　・ユーザー名: updated-user
     * 　　・メールアドレス: updated-user@example.com
     * </p>
     */
    @Test
    @DataSet("datasets/com/example/myapp/user/service/UserServiceTest/testUpdateUser.yml")
    @ExpectedDataSet("datasets/com/example/myapp/user/service/UserServiceTest/expected/testUpdateUser.yml")
    void testUpdateUser() {
        // given
        UserDto userToUpdate = new UserDto(1L, "updated-user", "updated-user@example.com");

        // when
        userService.updateUser(userToUpdate);

        // then
        // @ExpectedDataSetで検証
    }
}
```

（以降省略）

````

このようなインストラクションファイルを、`.github/instructions/test-code-pattern.instructions.md`のようなファイル名で作成します。これにより、GitHub Copilotはサンプルに従った一貫性のあるテストコードを生成しやすくなるでしょう。
