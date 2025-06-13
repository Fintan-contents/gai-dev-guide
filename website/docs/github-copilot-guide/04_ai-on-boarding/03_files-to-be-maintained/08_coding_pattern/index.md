---
sidebar_position: 8
---

# 実装パターン

AIにプロジェクト内のルールに沿ったコードを生成させるには、コーディング標準のような指針を示すことも重要ですが、模倣してもらうサンプルコードが必要です。

新しくプロジェクトを始め、各開発者がソースコードを作成するには手本となるサンプルコードが必要になります。
またサンプルコードの質に問題があると、その質に倣ったコードがたくさん作られてしまいます。

よって各開発者に守って欲しいことを押さえたサンプルコードを、[ステレオタイプ](../stereotype)や実装パターンごとに用意することが多いのではないでしょうか。  
AIに対しても同じです。

これらの実装パターンをインストラクションファイルとしてAIに提供することで、AIはプロジェクトにおける「手本」のコードを学習し、それを模倣して新しいコードを生成するようになります。
これにより開発者は実装方法を都度細かく指示する必要が少なくなり、より本質的な仕様の伝達に集中できます。

以下は、各ステレオタイプの実装パターンに関する[インストラクションファイル](../../shared-instructions-prompts)の記述例です。

````markdown
---
applyTo: "**"
---

# 実装パターン

## Controllerの実装例

```java
package com.example.myapp.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@Transactional
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * ユーザーをIDで検索します。
     *
     * @param id ユーザーID
     * @return ユーザー情報
     */
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        UserDto userDto = userService.findById(id);
        UserResponse response = UserResponse.fromUserDto(userDto);
        return ResponseEntity.ok(response);
    }

    /**
     * ユーザーを作成します。
     *
     * @param request 作成するユーザーの情報
     * @return 作成されたユーザーの情報
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody @Validated UserCreateRequest request) {
        UserDto userDto = userService.createUser(request.toUserDto());
        UserResponse response = UserResponse.fromUserDto(userDto);
        return ResponseEntity.ok(response);
    }
}
```

## Requestの実装例

（省略）

## Responseの実装例

（省略）

## Serviceの実装例

（省略）

（以降省略）

````

このようなインストラクションファイルを`.github/instructions/coding-pattern.instructions.md`のようなファイル名で用意することで、GitHub Copilotはサンプルに従った一貫性のあるコードを生成しやすくなるでしょう。