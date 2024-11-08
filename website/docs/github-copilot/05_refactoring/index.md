---
sidebar_position: 5
---

# コードを改善する

GitHub Copilotにサポートしてもらいながら、リファクタリングやドキュメント生成する方法を学びます。

## JavaクラスのJavadocを生成する

GitHub Copilot Chatを使い、こちらのコードにJavadocを書いてもらいます。

<details>
  <summary>Javadocを書いてもらいたいコード</summary>

    ```java
    package com.nablarch.example.app.entity.core.validation.validator;
    
    import nablarch.core.util.DateUtil;
    import nablarch.core.util.StringUtil;
    
    public class DateRangeValidator {
        private final String start;
        private final String end;
    
        private final String dateFormat;
    
        public DateRangeValidator(final String start, final String end) {
            this(start, end, "yyyyMMdd");
        }
    
        public DateRangeValidator(final String start, final String end, final String dateFormat) {
            this.start = start;
            this.end = end;
            this.dateFormat = dateFormat;
        }
    
        public boolean isValid() {
            if (isValidDate(start) && isValidDate(end)) {
                return DateUtil.getParsedDate(start, dateFormat).compareTo(DateUtil.getParsedDate(end, dateFormat)) <= 0;
            }
            return true;
        }
    
        private boolean isValidDate(final String date) {
            if (StringUtil.isNullOrEmpty(date)) {
                return false;
            }
            return DateUtil.isValid(date, dateFormat);
        }
    }
    ```

</details>

1. エディタで、該当のファイルを開く
2. Copilot Chat Viewを開く
3. `/doc 日本語でjavadocを書いてください`と入力し送信
4. GitHub Copilot Chatにより、元のコードにJavadocを加えた結果が出力される
5. ファイル（DateRangeValidator.java）の内容を全選択する
6. Insert at Cursorボタンを押す
7. ファイルの内容がJavadocを加えた新しいものに置き換わる

![Untitled](images/Untitled.png)

最終的に以下のようなJavadocが出力されました。
<details>
<summary>出力されたJavaDoc</summary>

    ```java
    package com.nablarch.example.app.entity.core.validation.validator;

    import nablarch.core.util.DateUtil;
    import nablarch.core.util.StringUtil;

    /**
        * 日付範囲のバリデーター。
        * 開始日と終了日を指定し、その範囲が有効かどうかを検証します。
        */
    public class DateRangeValidator {
        private final String start;
        private final String end;

        private final String dateFormat;

        /**
            * デフォルトの日付形式（"yyyyMMdd"）を使用して、バリデーターを作成します。
            *
            * @param start 開始日
            * @param end 終了日
            */
        public DateRangeValidator(final String start, final String end) {
            this(start, end, "yyyyMMdd");
        }

        /**
            * 指定された日付形式を使用して、バリデーターを作成します。
            *
            * @param start 開始日
            * @param end 終了日
            * @param dateFormat 日付形式
            */
        public DateRangeValidator(final String start, final String end, final String dateFormat) {
            this.start = start;
            this.end = end;
            this.dateFormat = dateFormat;
        }

        /**
            * 開始日と終了日が有効な範囲であるかどうかを検証します。
            *
            * @return 開始日と終了日が有効な範囲であればtrue、そうでなければfalse
            */
        public boolean isValid() {
            if (isValidDate(start) && isValidDate(end)) {
                return DateUtil.getParsedDate(start, dateFormat).compareTo(DateUtil.getParsedDate(end, dateFormat)) <= 0;
            }
            return true;
        }

        /**
            * 指定された日付が有効かどうかを検証します。
            *
            * @param date 検証する日付
            * @return 日付が有効であればtrue、そうでなければfalse
            */
        private boolean isValidDate(final String date) {
            if (StringUtil.isNullOrEmpty(date)) {
                return false;
            }
            return DateUtil.isValid(date, dateFormat);
        }
    }
    ```

</details>

## Javaクラスをリファクタリングする

1. エディタで、該当のファイルを開く
2. Copilot Chat Viewを開く
3. `/fix リファクタリングしてください`と入力し送信
4. GitHub Copilot Chatにより、リファクタリング内容とリファクタリング後のクラスが提案されます
5. ファイルの内容を全選択する
6. Insert at Cursorボタンを押す
7. ファイルの内容がリファクタリングされた新しいものに置き換わる

![スクリーンショット 2023-12-04 16.51.44.png](images/スクリーンショット_2023-12-04_16.51.44.png)

## Javaクラスをレビューする

1. エディタで、該当ファイルを開く
2. Copilot Chat Viewを開く
3. GitHub Copilotに以下を入力する

        ```txt
        開発基準のMarkdownファイルを開発基準に、対象ファイルをレビューし、問題があれば、改修案を提示してください
        ```

4. 改修原因と改修内容が提案される

![suggestion_1.png](images/suggestion_1.png)
![suggestion_2.png](images/suggestion_2.png)
![suggestion_3.png](images/suggestion_3.png)
