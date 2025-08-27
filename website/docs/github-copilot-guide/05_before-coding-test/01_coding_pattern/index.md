---
sidebar_position: 1
---

# 実装例をプロンプトに含める

開発者がソースコードを作成するには、手本となるサンプルコードが必要です。  
これはAIに対しても同じことです。

またサンプルコードの質に問題があると、その質に倣ったコードがたくさん作られてしまいます。

適切な実装例を提示することで、AIが生成するコードの精度向上が期待できます。  
これにより開発者は実装方法を都度細かく指示する必要が少なくなり、より本質的な仕様の伝達に集中できます。

## 実装例はカスタムインストラクションに含めない

このような開発時に共通となる考え方はカスタムインストラクションに含むべき内容にも思えますが、本ガイドでは実装例を対象外にしています。

実装例自体はAIが生成するコードの精度向上には必要ですが、内容が長大になりやすくコンテキストウィンドウを圧迫します。  
このため、1回の指示で生成するコードに関わる実装例をプロンプトに含めるのがよいと考えます。  

しかし実装例をプロンプトに入力するのも手間となるため、指示内容に応じたプロンプトファイルへ含めるのがよいでしょう。

## 実装パターン

以下は、各ステレオタイプの実装パターンの記述例です。このような内容を、生成対象のソースコードに関連するプロンプトファイルへ含めましょう。  
ソースコード生成に関するプロンプトについては、[コードを生成する](../../programming-test/generate-code)を参照してください。

````markdown
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
