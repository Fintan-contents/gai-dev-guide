import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Fintan » Development Guide with Generative AI',
  tagline: '',
  url: 'https://Fintan-contents.github.io',
  baseUrl: '/gai-dev-guide',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  noIndex: false,

  // GitHub pages deployment config.
  organizationName: 'fintan-contents',
  projectName: 'gai-dev-guide',

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          showLastUpdateTime: true,
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true,
      }

    },
    metadata: [
      // TODO: 正式なURLに変更する
      // OGP: 既存の生成AI活用ガイドのOGPを流用
      { name: 'og:url', content: 'https://Fintan-contents.github.io/gai-dev-guide' },
      { name: 'og:site_name', content: 'Fintan » 生成AI活用ガイド' },
      { name: 'og:locale', content: 'ja_JP' },
      { name: 'og:image', content: 'https://Fintan-contents.github.io/gai-dev-guide/img/OGP.png' },
      { name: 'og:image:alt', content: 'Fintan » 生成AI活用ガイド' },
      { name: 'og:type', content: 'website' },

      // Twitter Card: 既存の生成AI活用ガイドのOGPを流用
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Fintan » 生成AI活用ガイド' },
      { name: 'twitter:description', content: `AI技術を使って日常の業務をスムーズに進めたいですか？
生成AI活用ガイドはTIS株式会社が作成している生成AIを活用するためのガイドラインです。
ChatGPTやGitHub Copilotなどの導入方法、基本的な操作、効果的な使い方などを提供します。
どなたでも無償で利用いただけます。` },
      { name: 'twitter:image', content: 'https://Fintan-contents.github.io/gai-dev-guide/img/OGP.png' },
      { name: 'twitter:image:alt', content: 'Fintan » 生成AI活用ガイド' },
    ],
    image: 'img/OGP.png',
    announcementBar: {
      id: 'announcement-bar',
      content: '現在作成中のサイトです',
      backgroundColor: '#fafbfc',
      textColor: '#091E42',
      isCloseable: true,
    },
    navbar: {
      title: '生成AI活用ガイド',
      logo: {
        alt: 'Fintan » 生成AI活用ガイド',
        src: 'img/fintan-logo.jpg',
        href: 'https://fintan.jp',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'githubCopilotSidebar',
          position: 'left',
          label: 'GitHub Copilot ガイド',
        },
        {
          type: 'docSidebar',
          sidebarId: 'developmentProcessSidebar',
          position: 'left',
          label: '開発プロセス',
        },
        {
          href: 'https://github.com/Fintan-contents/gai-dev-guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
      hideOnScroll: false,
    },
    footer: {
      style: 'light',
      links: [
        {
          // TODO: コンテンツができたら置き換える
          title: 'Docs',
          items: [],
        },
        {
          title: 'Related Work',
          items: [
            {
              label: 'Fintan',
              href: 'https://fintan.jp',
            },
          ],
        },
      ],
      copyright: `<div class="no-content">
<div class="copyright">
  ドキュメントは、<a rel="license" href="https://fintan.jp/?page_id=201" target="_blank">Fintan コンテンツ 使用許諾条項</a
  >の下に提供されています。</div></div>`,

/*
TODO: コンテンツができたら置き換える
<div class="supplementary">
  <a href="/${project}/terms-of-use/" class="footer__link-item">当サイトのご利用にあたって</a>
  <a href="/${project}/trademark/" class="footer__link-item">商標について</a>
</div>
</div>
*/
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
