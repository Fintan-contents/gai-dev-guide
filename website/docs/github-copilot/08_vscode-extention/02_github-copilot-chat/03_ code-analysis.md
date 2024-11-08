---
sidebar_position: 3
---

# 利用例：コード解析

ソースコードの論理構造と実行フローを視覚的に表現するために、GitHub Copilotを使ってクラス図とフロー図を作成できます。

## クラス図を作成する

1. Copilot Chat Viewを開く
2. GitHub Copilotに以下を入力する。

    ```txt
    「#file:CopyCallTreeAnalyzeTool.java ロジックを理解して、クラス図をMermaidで作成してください。 
    フローチャートにABCDを実際のメソッド名変更してください。処理ロジック漏れなくご注意ください。」
    ```

3. クラス図が提案される

    ![graph_1.png](images/graph_1.png)

4. Mermaidで表現するクラス図

    ![graph_2.png](images/graph_2.png)

## フロー図を作成する

1. Copilot Chat Viewを開く
2. GitHub Copilotに以下を入力する

    ```txt
    「#file:CopyCallTreeAnalyzeTool.java ロジックを理解して、処理フロー図をMermaidで作成してください。
    フローチャートにABCDを実際のメソッド名変更してください。」
    ```

3. フロー図が提案される

    ![graph_3.png](images/graph_3.png)<br/>
    ※中は省略<br/>
    ![graph_4.png](images/graph_4.png)

4. Mermaidで表現するフロー図

    ![graph_5.png](images/graph_5.png)
