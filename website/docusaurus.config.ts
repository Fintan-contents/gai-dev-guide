import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const organization = 'fintan-contents';
const project = 'gai-dev-guide';

const url = process.env.BUILD_TYPE === 'prd' ? `https://${organization}.github.io` : 'http://localhost:3000';
const baseUrl = process.env.BUILD_TYPE === 'prd' ? `/${project}/` : '';
const urlWithBase = url + baseUrl
const ogpImageUrl = `${urlWithBase}img/OGP.png`;
const repositoryUrl = `https://github.com/${organization}/${project}`

const experimental_router = process.env.BUILD_TYPE === 'usableWithoutServer' ? 'hash' : 'browser';

const copyright = `
<div class="no-content">
  <div class="copyright">
    ドキュメントは、<a rel="license" href="https://fintan.jp/?page_id=201" target="_blank">Fintan コンテンツ 使用許諾条項</a>の下に提供されています。
  </div>
  <div class="supplementary">
    <a href="/${project}/trademark/" class="footer__link-item">商標について</a>
    <a href="/${project}/customize-and-distribution/" class="footer__link-item">ガイドのカスタマイズ・配布について</a>
  </div>
</div>`;


const plugins = [];
if (process.env.BUILD_TYPE === 'prd' || process.env.BUILD_TYPE === 'local') {
  plugins.push([
    require.resolve('@cmfcmf/docusaurus-search-local'),
    {
      indexDocs: true,
      indexPages: true,
      indexBlog: false,
      language: ['ja'],
    },
  ]);
}

const config: Config = {
  title: 'Fintan » Development Guide with Generative AI',
  tagline: '',
  url,
  baseUrl,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  noIndex: false,

  organizationName: organization, // Usually your GitHub org/user name.
  projectName: project, // Usually your repo name.

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },
  plugins,
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
      // OGP: 既存の生成AI活用ガイド(https://gen-ai-docs.jp/)のOGPを流用
      { name: 'og:url', content: urlWithBase},
      { name: 'og:site_name', content: 'Fintan » 生成AI エンジニアリング活用ガイド' },
      { name: 'og:locale', content: 'ja_JP' },
      { name: 'og:image', content: ogpImageUrl },
      { name: 'og:image:alt', content: 'Fintan » 生成AI エンジニアリング活用ガイド' },
      { name: 'og:type', content: 'website' },

      // Twitter Card: 既存の生成AI活用ガイド(https://gen-ai-docs.jp/)のOGPを流用
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Fintan » 生成AI エンジニアリング活用ガイド' },
      { name: 'twitter:description', content: `AI技術を使って日常の業務をスムーズに進めたいですか？
生成AI エンジニアリング活用ガイドはTIS株式会社が作成している生成AIを活用するためのガイドラインです。
ChatGPTやGitHub Copilotなどの導入方法、基本的な操作、効果的な使い方などを提供します。
どなたでも無償で利用いただけます。` },
      { name: 'twitter:image', content: ogpImageUrl },
      { name: 'twitter:image:alt', content: 'Fintan » 生成AI エンジニアリング活用ガイド' },
    ],
    image: 'img/OGP.png',
    navbar: {
      title: '生成AI エンジニアリング活用ガイド',
      logo: {
        alt: 'Fintan » 生成AI エンジニアリング活用ガイド',
        src: 'img/fintan-logo.jpg',
        href: urlWithBase,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'githubCopilotGuideSidebar',
          position: 'left',
          label: 'GitHub Copilot活用ガイド',
        },
        {
          href: repositoryUrl,
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
      hideOnScroll: false,
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'GitHub Copilot活用ガイド',
              to: 'github-copilot-guide',
            }
          ],
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
      copyright,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java'],
    },
  } satisfies Preset.ThemeConfig,
  future: {
    experimental_router,
  },
};

export default config;
