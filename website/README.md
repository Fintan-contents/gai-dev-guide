# 生成AI エンジニアリング活用ガイド

## ディレクトリ構成

- `website`: GitHub Pagesで公開しているページのソースコード（Docusaurus）

## ライセンス

ドキュメントは、<a rel="license" href="https://fintan.jp/?page_id=201" target="_blank">Fintanコンテンツ使用許諾条項</a>の下に提供されています。

## アクセス数集計

plausibleを用いてアクセス数を集計する。

アクセス数は以下から閲覧可能  
https://plausible.io/gai-dev-guide.fintan-contents.github.io/installation

`website\docusaurus.config.ts`の下記scriptsを追加することにより、plausibleにアクセス数が集計される仕組みになっている。

```js
  ・
  ・
  ・
  plugins,
  scripts: [
    {
      src: 'https://plausible.io/js/pa-HCRkSORSKyT_D_l9FX2DM.js',
      async: true,
    },
    {
      src: `${urlWithBase}js/plausible.js`,
      defer: true,
    }
  ],
  presets: [
    [
  ・
  ・
  ・
```

なお、テストなどでローカルで起動したサーバーにアクセスした際は、集計対象にならない。